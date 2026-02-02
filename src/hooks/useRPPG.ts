import { useEffect, useRef, useState } from "react";
import { useVitalsStore } from "@/lib/vitalsStore";

interface SignalSample {
    t: number;
    r: number;
    g: number;
    b: number;
}

export const useRPPG = ({ duration }: { duration: number }) => {
    const setVitals = useVitalsStore((state) => state.setVitals);
    const [remainingTime, setRemainingTime] = useState(duration);
    const bufferRef = useRef<SignalSample[]>([]);
    const isRunningRef = useRef(true);

    // Bandpass filters and FFT Configuration
    const HR_BAND = { min: 0.8, max: 3.0 }; // Hz (48-180 BPM)
    const RR_BAND = { min: 0.1, max: 0.5 }; // Hz (6-30 RPM)
    const SAMPLING_RATE = 30; // Hz - target camera/processing rate

    useEffect(() => {
        const startTime = Date.now();

        // 1. Sampling Loop - Simulation of ROI Data Capture
        const samplingInterval = setInterval(() => {
            if (!isRunningRef.current) return;

            const elapsed = (Date.now() - startTime) / 1000;

            // Stub: Simulate extraction of raw average RGB from facial ROI
            // In production, this would be fed by useFaceMesh or a canvas processor
            const rawSample = captureStubbedROIData(elapsed);
            bufferRef.current.push(rawSample);

            // 2. Real-time Signal Quality Evaluation
            if (bufferRef.current.length > 30) {
                const quality = evaluateSignalQuality(bufferRef.current.slice(-60));
                setVitals({ signalQuality: quality });
            }

            setRemainingTime(Math.max(0, Math.ceil(duration - elapsed)));

            if (elapsed >= duration) {
                stopSampling();
            }
        }, 1000 / SAMPLING_RATE);

        const stopSampling = () => {
            isRunningRef.current = false;
            clearInterval(samplingInterval);
            processFinalVitals();
        };

        // 3. Signal Processing & Vital Calculation
        const processFinalVitals = () => {
            const signal = bufferRef.current;
            if (signal.length < 100) return;

            const greenChannel = signal.map(s => s.g);
            const timestamps = signal.map(s => s.t);

            // Compute Heart Rate via FFT decomposition
            const heartRate = computeMetricFromSignal(
                greenChannel,
                timestamps,
                HR_BAND.min,
                HR_BAND.max
            );

            // Compute Respiration Rate via Low-Frequency analysis
            const respirationRate = computeMetricFromSignal(
                greenChannel,
                timestamps,
                RR_BAND.min,
                RR_BAND.max
            );

            // Estimate SpO2 using ratio-of-ratios (Experimental)
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
    }, [duration, setVitals]);

    return { remainingTime };
};

/**
 * Signal Quality Evaluation based on variance and noise floor
 */
function evaluateSignalQuality(samples: SignalSample[]): "Poor" | "Fair" | "Good" {
    const gValues = samples.map(s => s.g);
    const mean = gValues.reduce((a, b) => a + b, 0) / gValues.length;
    const variance = gValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / gValues.length;

    // Adjusted thresholds for stubbed physiological signals
    // Variance typically ranges from 0.5-3.0 for simulated data
    if (variance < 0.3) return "Poor";   // Very low signal variation
    if (variance > 10) return "Fair";    // Too much noise/motion
    return "Good";                       // Optimal signal detected
}

/**
 * Discrete Fourier Transform to find peak frequency in a specific band
 * Convert frequency (Hz) to units-per-minute
 */
function computeMetricFromSignal(
    signal: number[],
    t: number[],
    minHz: number,
    maxHz: number
): number {
    const n = signal.length;
    const fs = n / (t[t.length - 1] - t[0]); // Actual sampling frequency

    let maxPower = -1;
    let peakFreq = 0;

    // Search through frequencies in the band with 0.01Hz resolution
    for (let freq = minHz; freq <= maxHz; freq += 0.01) {
        let re = 0;
        let im = 0;
        for (let i = 0; i < n; i++) {
            const angle = 2 * Math.PI * freq * (t[i] - t[0]);
            re += signal[i] * Math.cos(angle);
            im -= signal[i] * Math.sin(angle);
        }
        const power = re * re + im * im;
        if (power > maxPower) {
            maxPower = power;
            peakFreq = freq;
        }
    }

    return peakFreq * 60;
}

/**
 * Experimental SpO2 estimation using AC/DC ratio of Red vs Blue channels
 */
function estimateSpO2(samples: SignalSample[]): number {
    const getStats = (channel: 'r' | 'b') => {
        const vals = samples.map(s => s[channel]);
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        const ac = Math.sqrt(vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length);
        return ac / mean;
    };

    const rRatio = getStats('r');
    const bRatio = getStats('b');
    const R = rRatio / bRatio;

    // Standard SpO2 empirical calibration: 110 - 25 * R
    let spo2 = 110 - 25 * R;
    return Math.max(90, Math.min(100, spo2));
}

/**
 * Stub for ROI data capture. 
 * Generates signals mirroring physiological behavior for verification.
 */
function captureStubbedROIData(t: number): SignalSample {
    const hrHz = 1.2 + Math.sin(t * 0.1) * 0.1; // ~72 BPM with slight variability
    const rrHz = 0.25; // ~15 RPM

    // Base intensity with subtle PPG oscillations
    const base = 120;
    const pulse = Math.sin(2 * Math.PI * hrHz * t) * 0.8;
    const breath = Math.sin(2 * Math.PI * rrHz * t) * 1.5;
    const noise = (Math.random() - 0.5) * 0.5;

    return {
        t,
        r: base + pulse * 0.6 + breath * 1.2 + noise,
        g: base + pulse + breath + noise, // Green channel has strongest PPG signal
        b: base + pulse * 0.4 + breath * 0.8 + noise
    };
}
