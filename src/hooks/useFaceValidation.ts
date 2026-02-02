import { useState, useEffect, useRef, MutableRefObject } from "react";
import { NormalizedLandmarkList } from "@mediapipe/face_mesh";

export interface ValidationState {
    isValid: boolean;
    checks: {
        faceDetected: boolean;
        faceCentered: boolean;
        isStable: boolean;
        lighting: "good" | "too_dark" | "too_bright" | "optimal" | "too_dark";
        orientation: boolean;
    };
    errors: string[];
}

interface UseFaceValidationProps {
    videoRef: MutableRefObject<HTMLVideoElement | null>;
    landmarks: NormalizedLandmarkList | null;
    enabled?: boolean;
}

export const useFaceValidation = ({ videoRef, landmarks, enabled = true }: UseFaceValidationProps) => {
    const [state, setState] = useState<ValidationState>({
        isValid: false,
        checks: {
            faceDetected: false,
            faceCentered: false,
            isStable: false,
            lighting: "too_dark",
            orientation: false
        },
        errors: []
    });

    const prevLandmarksRef = useRef<NormalizedLandmarkList | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // Config
    const MOTION_THRESHOLD = 0.015; // Normalized coords
    const TILT_THRESHOLD = 15; // Degrees approx

    useEffect(() => {
        if (!enabled) return;
        if (!canvasRef.current) {
            canvasRef.current = document.createElement("canvas");
            canvasRef.current.width = 100; // Low res for lighting check
            canvasRef.current.height = 100;
        }

        const activeErrors: string[] = [];
        const checks: ValidationState["checks"] = {
            faceDetected: !!landmarks && landmarks.length > 0,
            faceCentered: false,
            isStable: true,
            lighting: "too_dark",
            orientation: false
        };

        if (!checks.faceDetected || !landmarks) {
            activeErrors.push("No face detected");
            setState({ isValid: false, checks, errors: activeErrors });
            prevLandmarksRef.current = null;
            return;
        }

        // 1. Position & Centering (Rough Oval)
        const nose = landmarks[1];
        const leftCheek = landmarks[234];
        const rightCheek = landmarks[454];

        // Center of frame is 0.5, 0.5. Oval is approx 0.3-0.7 X, 0.2-0.8 Y
        const isCenteredX = nose.x > 0.35 && nose.x < 0.65;
        const isCenteredY = nose.y > 0.3 && nose.y < 0.7;
        const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
        const isGoodSize = faceWidth > 0.15 && faceWidth < 0.55; // Not too far/close

        checks.faceCentered = isCenteredX && isCenteredY && isGoodSize;
        if (!checks.faceCentered) activeErrors.push("Position face in oval");

        // 2. Orientation (Yaw/Roll)
        // Roll: Angle between eyes (33 and 263)
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const dy = rightEye.y - leftEye.y;
        const dx = rightEye.x - leftEye.x;
        const roll = Math.atan2(dy, dx) * (180 / Math.PI);
        // Yaw: Symmetry of nose vs cheeks
        const distL = Math.abs(nose.x - leftCheek.x);
        const distR = Math.abs(nose.x - rightCheek.x);
        const yawRatio = Math.max(distL, distR) / (Math.min(distL, distR) + 0.001);

        checks.orientation = Math.abs(roll) < TILT_THRESHOLD && yawRatio < 2.5;
        if (!checks.orientation) activeErrors.push("Face too tilted");

        // 3. Stability (Motion)
        if (prevLandmarksRef.current) {
            const prevNose = prevLandmarksRef.current[1];
            const dist = Math.sqrt(Math.pow(nose.x - prevNose.x, 2) + Math.pow(nose.y - prevNose.y, 2));
            if (dist > MOTION_THRESHOLD) {
                checks.isStable = false;
                activeErrors.push("Keep head still");
            }
        }
        prevLandmarksRef.current = landmarks;

        // 4. Lighting Check
        if (videoRef.current && videoRef.current.readyState === 4 && canvasRef.current) {
            try {
                const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
                if (ctx) {
                    ctx.drawImage(videoRef.current, 0, 0, 100, 100);
                    // Sample center 50%
                    const data = ctx.getImageData(25, 25, 50, 50).data;
                    let brightSum = 0;
                    for (let i = 0; i < data.length; i += 4) {
                        brightSum += (data[i] + data[i + 1] + data[i + 2]) / 3;
                    }
                    const avgBrightness = brightSum / (data.length / 4);

                    if (avgBrightness < 30) {
                        checks.lighting = "too_dark";
                        activeErrors.push("Lighting too dark");
                    } else if (avgBrightness > 240) {
                        checks.lighting = "too_bright";
                        activeErrors.push("Lighting too bright");
                    } else {
                        checks.lighting = "optimal";
                    }
                }
            } catch (e) {
                // Ignore canvas errors
            }
        } else {
            checks.lighting = "optimal"; // Skip if video not ready, assume ok to avoid blocking
        }

        const isValid =
            checks.faceDetected &&
            checks.faceCentered &&
            checks.isStable &&
            checks.orientation &&
            checks.lighting === "optimal";

        setState({ isValid, checks, errors: activeErrors });

    }, [landmarks, videoRef, enabled]);

    return state;
};
