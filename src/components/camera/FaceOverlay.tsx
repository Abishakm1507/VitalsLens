import { useEffect, useRef } from "react";
import { NormalizedLandmarkList } from "@mediapipe/face_mesh";
import { cn } from "@/lib/utils";

interface FaceOverlayProps {
    landmarks: NormalizedLandmarkList | null;
    className?: string;
    showMesh?: boolean;
    onFacePositionChange?: (isWithinOval: boolean) => void;
}

const FaceOverlay = ({ landmarks, className, showMesh = true, onFacePositionChange }: FaceOverlayProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        // Define oval parameters
        const ovalCenterX = width / 2;
        const ovalCenterY = height / 2;
        const ovalRadiusX = width * 0.25;
        const ovalRadiusY = height * 0.35;

        let isWithinOval = false;

        if (landmarks && landmarks.length > 0) {
            // Check if face is within oval using key landmarks
            // Use nose tip (landmark 1), left eye (33), right eye (263)
            const noseTip = landmarks[1];
            const leftEye = landmarks[33];
            const rightEye = landmarks[263];

            if (noseTip && leftEye && rightEye) {
                // Calculate face center
                const faceCenterX = noseTip.x * width;
                const faceCenterY = noseTip.y * height;

                // Calculate face width
                const faceWidth = Math.abs(leftEye.x - rightEye.x) * width;

                // Check if face center is within oval with some tolerance
                const normalizedX = (faceCenterX - ovalCenterX) / ovalRadiusX;
                const normalizedY = (faceCenterY - ovalCenterY) / ovalRadiusY;
                const distanceFromCenter = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);

                // Face is within oval if distance < 0.8 (80% of oval radius) and face is not too small/large
                isWithinOval = distanceFromCenter < 0.8 && faceWidth > width * 0.15 && faceWidth < width * 0.5;
            }
        }

        // Notify parent component
        onFacePositionChange?.(isWithinOval);

        if (showMesh) {
            // Draw the Guide Oval with color based on face position
            ctx.strokeStyle = isWithinOval
                ? "rgba(34, 197, 94, 0.7)"  // Green when face is positioned correctly
                : "rgba(59, 130, 246, 0.6)"; // Blue when face needs adjustment
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.ellipse(ovalCenterX, ovalCenterY, ovalRadiusX, ovalRadiusY, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }, [landmarks, showMesh, onFacePositionChange]);

    return (
        <canvas
            ref={canvasRef}
            className={cn("absolute inset-0 w-full h-full pointer-events-none z-10", className)}
            width={480}
            height={640}
        />
    );
};

export default FaceOverlay;
