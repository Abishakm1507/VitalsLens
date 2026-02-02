import { useEffect, useRef } from "react";
import { useVitalsStore } from "@/lib/vitalsStore";

interface SignalSample {
    t: number;
    r: number;
    g: number;
    b: number;
}

/**
 * Lightweight hook for real-time signal quality monitoring
 * Used in PreScanScreen to evaluate readiness before starting full scan
 */
export const useSignalQuality = () => {
    const setVitals = useVitalsStore((state) => state.setVitals);
    const bufferRef = useRef<SignalSample[]>([]);
    const isRunningRef = useRef(true);

    useEffect(() => {
        const startTime = Date.now();
        const SAMPLING_RATE = 30; // Hz

        // Continuous sampling for quality assessment
        const samplingInterval = setInterval(() => {
            if (!isRunningRef.current) return;

            const elapsed = (Date.now() - startTime) / 1000;
            const rawSample = captureStubbedROIData(elapsed);
            bufferRef.current.push(rawSample);

            // Keep only last 90 samples (3 seconds of data)
            if (bufferRef.current.length > 90) {
                bufferRef.current.shift();
            }

            // Evaluate signal quality every 30 samples (~1 second)
            if (bufferRef.current.length >= 30 && bufferRef.current.length % 30 === 0) {
                const quality = evaluateSignalQuality(bufferRef.current.slice(-60));
                setVitals({ signalQuality: quality });
            }
        }, 1000 / SAMPLING_RATE);

        return () => {
            isRunningRef.current = false;
            clearInterval(samplingInterval);
        };
    }, [setVitals]);
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
