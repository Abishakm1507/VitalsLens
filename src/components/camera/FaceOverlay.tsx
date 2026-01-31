import { useEffect, useRef } from "react";
import { NormalizedLandmarkList } from "@mediapipe/face_mesh";
import { cn } from "@/lib/utils";

interface FaceOverlayProps {
    landmarks: NormalizedLandmarkList | null;
    className?: string;
    showMesh?: boolean;
}

const FaceOverlay = ({ landmarks, className, showMesh = true }: FaceOverlayProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !landmarks) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear and draw
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        if (showMesh) {
            ctx.fillStyle = "rgba(59, 130, 246, 0.5)"; // primary blue with opacity
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 0.5;

            // Draw simplified mesh dots
            // We only draw a subset for performance and cleaner UI
            landmarks.forEach((landmark, index) => {
                if (index % 5 === 0) { // Sparsity for aesthetic
                    const x = landmark.x * width;
                    const y = landmark.y * height;

                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, 2 * Math.PI);
                    ctx.fill();
                }
            });

            // Draw Guide Oval (HUD feel)
            ctx.strokeStyle = "rgba(59, 130, 146, 0.5)";
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.ellipse(width / 2, height / 2, width * 0.25, height * 0.35, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }, [landmarks, showMesh]);

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
