import { useEffect, useRef } from "react";

interface SignalWaveformProps {
    className?: string;
}

const SignalWaveform = ({ className }: SignalWaveformProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrame: number;
        let offset = 0;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.strokeStyle = "#3b82f6"; // Tailwind blue-500
            ctx.lineWidth = 2;

            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 + Math.sin((x + offset) * 0.05) * 20 + Math.sin((x + offset) * 0.02) * 10;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
            offset += 2;
            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return (
        <div className={`w-full h-24 bg-card rounded-xl border border-border overflow-hidden ${className}`}>
            <canvas ref={canvasRef} width={400} height={100} className="w-full h-full" />
        </div>
    );
};

export default SignalWaveform;
