import { forwardRef, RefObject } from "react";
import { cn } from "@/lib/utils";

interface CameraFeedProps {
    className?: string;
    videoRef: RefObject<HTMLVideoElement>;
}

const CameraFeed = forwardRef<HTMLDivElement, CameraFeedProps>(({ className, videoRef }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "relative rounded-3xl overflow-hidden bg-black aspect-[3/4] w-full max-w-sm mx-auto shadow-elevated",
                className
            )}
        >
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror-mode"
            />

            {/* Privacy Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] text-white font-medium uppercase tracking-wider">Live</span>
            </div>
        </div>
    );
});

CameraFeed.displayName = "CameraFeed";

export default CameraFeed;
