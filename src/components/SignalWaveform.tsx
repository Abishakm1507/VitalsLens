import { useEffect, useRef } from "react";

interface SignalWaveformProps {
    className?: string;
    data?: number[];
}

const SignalWaveform = ({ className, data = [] }: SignalWaveformProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Config
        ctx.strokeStyle = "#ef4444"; // Red for heart beat
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();

        const w = canvas.width;
        const h = canvas.height;

        if (!data || data.length < 2) {
            // Flatline if no data
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.strokeStyle = "#374151"; // Gray
            ctx.stroke();
            return;
        }

        // Render waveform
        // Map data index to X (spread across width)
        // Map data value (0-1) to Y (height)

        const step = w / (data.length - 1);

        data.forEach((val, i) => {
            const x = i * step;
            // Invert Y because canvas 0 is top. Value 1 should be top (0), Value 0 bottom (h).
            // Actually, let's keep some padding.
            const padding = 5;
            const y = h - padding - (val * (h - 2 * padding));

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.stroke();

        // Add "Scan Line" gradient effect
        const gradient = ctx.createLinearGradient(0, 0, w, 0);
        gradient.addColorStop(0, "rgba(239, 68, 68, 0.1)");
        gradient.addColorStop(1, "rgba(239, 68, 68, 0.8)");
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();

    }, [data]);

    return (
        <div className={`w-full h-full bg-card rounded-xl border border-border overflow-hidden relative ${className}`}>
            {/* Grid background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                }}
            />
            <canvas ref={canvasRef} width={400} height={128} className="w-full h-full relative z-10" />
        </div>
    );
};

export default SignalWaveform;
