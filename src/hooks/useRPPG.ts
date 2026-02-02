import { useEffect, useRef, useState, MutableRefObject } from "react";
import { useVitalsStore } from "@/lib/vitalsStore";
import { NormalizedLandmarkList } from "@mediapipe/face_mesh";

interface SignalSample {
    t: number;
    r: number;
    g: number;
    b: number;
}

interface UseRPPGProps {
    duration: number;
    videoRef: MutableRefObject<HTMLVideoElement | null>;
    landmarks: NormalizedLandmarkList | null;
}

export const useRPPG = ({ duration, videoRef, landmarks }: UseRPPGProps) => {
    const setVitals = useVitalsStore((state) => state.setVitals);
    const [remainingTime, setRemainingTime] = useState(duration);
    const bufferRef = useRef<SignalSample[]>([]);
    const isRunningRef = useRef(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const startTimeRef = useRef<number>(0);
    const prevNoseRef = useRef<{ x: number, y: number } | null>(null);
    const [liveSignal, setLiveSignal] = useState<number[]>([]);


    // Bandpass filters and FFT Configuration
    const HR_BAND = { min: 0.8, max: 3.0 }; // Hz (48-180 BPM)
    const RR_BAND = { min: 0.1, max: 0.5 }; // Hz (6-30 RPM)
    const SAMPLING_RATE = 30; // Hz

    useEffect(() => {
        if (!canvasRef.current) {
            canvasRef.current = document.createElement("canvas");
            // Set fixed lowish resolution for performance (enough for ROI averaging)
            canvasRef.current.width = 300;
            canvasRef.current.height = 300;
        }
    }, []);

    useEffect(() => {
        // Start scanning
        isRunningRef.current = true;
        startTimeRef.current = Date.now();
        bufferRef.current = [];
        prevNoseRef.current = null; // Reset previous nose position on new scan

        const samplingInterval = setInterval(() => {
            if (!isRunningRef.current) return;

            const elapsed = (Date.now() - startTimeRef.current) / 1000;

            // 1. Capture Real Signal
            const sample = processFrame(elapsed);

            if (sample) {
                bufferRef.current.push(sample);

                // 2. Real-time Signal Quality Evaluation
                if (bufferRef.current.length > 30) {
                    const quality = evaluateSignalQuality(bufferRef.current.slice(-60), SAMPLING_RATE);
                    setVitals({ signalQuality: quality });
                }
            } else {
                // Signal lost or face not detected - could handle state here
            }

            setRemainingTime(Math.max(0, Math.ceil(duration - elapsed)));

            // Update live signal for visualization (last 5 seconds = ~150 samples)
            const recentSamples = bufferRef.current.slice(-150);
            if (recentSamples.length > 2) {
                // Detrend to remove DC offset and baseline drift
                const rawGreen = recentSamples.map(s => s.g);
                const detrended = detrendSignal(rawGreen, SAMPLING_RATE);

                // Simple Min-Max Normalization for visualization stability
                // We want the wave to look "alive" but not erratic
                const max = Math.max(...detrended);
                const min = Math.min(...detrended);
                const range = max - min;

                if (range > 0.5) { // Avoid magnifying sensor noise too much
                    const normalized = detrended.map(v => (v - min) / range);
                    setLiveSignal(normalized);
                } else {
                    // If range is tiny (flatline/noise), send zeros or raw
                    setLiveSignal(new Array(detrended.length).fill(0.5));
                }
            }

            if (elapsed >= duration) {
                stopSampling();
            }
        }, 1000 / SAMPLING_RATE); // Target 30 FPS processing

        const processFrame = (t: number): SignalSample | null => {
            if (!videoRef.current || !landmarks || !canvasRef.current) return null;

            // 1. Motion Artifact Suppression
            const nose = landmarks[1]; // Nose tip
            if (prevNoseRef.current) {
                const dx = nose.x - prevNoseRef.current.x;
                const dy = nose.y - prevNoseRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                // Threshold: 0.005 is approx 0.5% screen movement ~ 2-3mm meaningful shift
                if (dist > 0.005) {
                    prevNoseRef.current = { x: nose.x, y: nose.y };
                    return null; // Reject frame due to motion
                }
            }
            prevNoseRef.current = { x: nose.x, y: nose.y };

            const video = videoRef.current;
            if (video.readyState !== 4) return null;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (!ctx) return null;

            // Resize canvas to match video aspect if needed, or mapped ROI
            // Simplified: Draw whole frame scaled down, or crop.
            // Let's draw the video to the canvas to read pixels.
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Extract Forehead ROI
            // Forehead indices: 10 (top), 151 (bottom), 338 (left), 109 (right)
            // We map normalized coordinates to canvas dimensions
            const getCoord = (idx: number) => ({
                x: landmarks[idx].x * canvas.width,
                y: landmarks[idx].y * canvas.height
            });

            const top = getCoord(10);
            const bottom = getCoord(151);
            const left = getCoord(338);
            const right = getCoord(109);

            // Simple bounding box for ROI averaging
            const x = Math.min(top.x, left.x, right.x);
            const y = Math.min(top.y, left.y, right.y);
            const w = Math.abs(right.x - left.x);
            const h = Math.abs(bottom.y - top.y);

            // Validation: Ensure ROI is inside canvas and reasonable
            if (w <= 0 || h <= 0 || x < 0 || y < 0) return null;

            try {
                const frameData = ctx.getImageData(x, y, w, h);
                const data = frameData.data;
                let r = 0, g = 0, b = 0;
                let count = 0;

                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }

                if (count === 0) return null;

                const avgG = g / count;
                const avgR = r / count;
                const avgB = b / count;

                // 2. Lighting Normalization & Exposure Check
                // Valid PPG signal range is typically 20-235 (avoid clipping/darkness)
                if (avgG < 20 || avgG > 235) {
                    return null; // Reject due to bad lighting
                }

                return {
                    t,
                    r: avgR,
                    g: avgG,
                    b: avgB
                };
            } catch (e) {
                console.error("ROI extraction error", e);
                return null;
            }
        };

        const stopSampling = () => {
            isRunningRef.current = false;
            clearInterval(samplingInterval);
            processFinalVitals();
        };

        // 3. Signal Processing & Vital Calculation
        const processFinalVitals = () => {
            const signal = bufferRef.current;
            if (signal.length < 100) return; // Need minimal data

            // Detrending: Remove non-stationary / low-frequency noise (breathing, motion drift)
            // Using a simple sliding window mean subtraction (High-pass filter effect)
            const detrendedGreen = detrendSignal(signal.map(s => s.g), SAMPLING_RATE);
            const timestamps = signal.map(s => s.t);

            // Further Normalize: Zero-mean unit variance (Z-score) is implicitly handled by detrending roughly
            // but we can be explicit if needed. Detrending centers around 0.

            // Compute Heart Rate via FFT decomposition
            const heartRate = computeMetricFromSignal(
                detrendedGreen,
                timestamps,
                HR_BAND.min,
                HR_BAND.max
            );

            // For Respiration, we want the low-frequency component, so we use RAW or smoothed signal, NOT strong detrended
            // But usually we just filter differently. 
            // Let's use raw green for RR but maybe smoother detrend.
            const respirationRate = computeMetricFromSignal(
                signal.map(s => s.g), // Use raw signal for RR (contains the breathing baseline sway)
                timestamps,
                RR_BAND.min,
                RR_BAND.max
            );

            // Estimate SpO2 using ratio-of-ratios
            const spo2 = estimateSpO2(signal);

            setVitals({
                heartRate: Math.round(heartRate),
                respirationRate: Math.round(respirationRate),
                spo2: Math.round(spo2),
            });
        };

        return () => {
            isRunningRef.current = false;
            clearInterval(samplingInterval);
        };
    }, [duration, setVitals, videoRef, landmarks]); // Re-bind if refs change

    return { remainingTime, liveSignal };
};

/**
 * Detrend signal using sliding window average subtraction
 * Window size approx 1 second (Sample Rate)
 */
function detrendSignal(data: number[], windowSize: number): number[] {
    const result: number[] = [];
    const halfWin = Math.floor(windowSize / 2);

    for (let i = 0; i < data.length; i++) {
        let start = Math.max(0, i - halfWin);
        let end = Math.min(data.length, i + halfWin);
        let sum = 0;
        for (let j = start; j < end; j++) {
            sum += data[j];
        }
        const mean = sum / (end - start);
        result.push(data[i] - mean);
    }
    return result;
}

/**
 * Signal Quality Evaluation based on variance and data completeness
 */
function evaluateSignalQuality(samples: SignalSample[], samplingRate: number): "Poor" | "Fair" | "Good" {
    if (samples.length === 0) return "Poor";

    // Check for data gaps (dropped frames)
    // Expected samples for the duration of the current `samples` array
    // Assuming `samples` is a recent window, e.g., 2 seconds (60 samples at 30Hz)
    if (samples.length > 1) {
        const duration = samples[samples.length - 1].t - samples[0].t;
        const expectedSamples = Math.round(duration * samplingRate);
        // If actual samples are significantly less than expected, it indicates dropped frames
        // A threshold of 80% of expected samples might be reasonable
        if (samples.length < expectedSamples * 0.8) {
            return "Poor";
        }
    }

    const gValues = samples.map(s => s.g);
    const mean = gValues.reduce((a, b) => a + b, 0) / gValues.length;
    // Standard deviation as a proxy for signal presence/noise
    const variance = gValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / gValues.length;
    const stdDev = Math.sqrt(variance);

    // In 8-bit color (0-255), PPG signal is typically 0.5 - 2.0 units amplitude
    // If stdDev is too low (< 0.1), it's likely a frozen image or plain color
    // If stdDev is too high (> 10), it's massive motion or light changes
    if (stdDev < 0.1) return "Poor";
    if (stdDev > 10) return "Fair";
    return "Good";
}

/**
 * Discrete Fourier Transform
 */
function computeMetricFromSignal(
    signal: number[],
    t: number[],
    minHz: number,
    maxHz: number
): number {
    const n = signal.length;
    if (n === 0) return 0;

    // Simple Welch-like periodogram peak finding
    let maxPower = -1;
    let peakFreq = 0;

    for (let freq = minHz; freq <= maxHz; freq += 0.02) { // 0.02 Hz step
        let re = 0;
        let im = 0;
        for (let i = 0; i < n; i++) {
            const angle = 2 * Math.PI * freq * t[i]; // t starts at ~0
            re += signal[i] * Math.cos(angle);
            im -= signal[i] * Math.sin(angle);
        }
        const power = re * re + im * im;
        if (power > maxPower) {
            maxPower = power;
            peakFreq = freq;
        }
    }

    // Heuristics to reject harmonic noise?
    return peakFreq * 60;
}

/**
 * SpO2 estimation using AC/DC ratio of Red vs Blue/Green channels
 * R = (AC_red / DC_red) / (AC_blue / DC_blue) 
 * (Standard approach often uses Red/IR, but visual spectrum apps often use Red/Blue or Red/Green)
 */
function estimateSpO2(samples: SignalSample[]): number {
    const getStats = (channel: 'r' | 'b') => {
        const vals = samples.map(s => s[channel]);
        const max = Math.max(...vals);
        const min = Math.min(...vals);
        const dc = (max + min) / 2; // Approximation of DC
        const ac = max - min;       // Approximation of AC amplitude
        // Better: Standard deviation as AC, Mean as DC
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        const std = Math.sqrt(vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length);
        return std / mean;
    };

    const rRatio = getStats('r');
    const bRatio = getStats('b');

    if (bRatio === 0) return 96; // Fallback

    const R = rRatio / bRatio;

    // Empirical calibration for visual spectrum (approximate)
    // spo2 = A - B * R
    // A ~ 100-110, B ~ 10-25
    let spo2 = 104 - 17 * R;

    return Math.max(90, Math.min(100, spo2));
}
