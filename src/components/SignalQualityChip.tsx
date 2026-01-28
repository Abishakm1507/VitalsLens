import { Signal, SignalLow, SignalMedium, SignalHigh } from "lucide-react";
import { cn } from "@/lib/utils";

type Quality = "excellent" | "good" | "fair" | "poor";

interface SignalQualityChipProps {
  quality: Quality;
  showLabel?: boolean;
  className?: string;
}

const qualityConfig: Record<Quality, { 
  label: string; 
  color: string; 
  bgColor: string;
  bars: number;
}> = {
  excellent: { label: "Excellent", color: "text-success", bgColor: "bg-success/10", bars: 4 },
  good: { label: "Good", color: "text-success", bgColor: "bg-success/10", bars: 3 },
  fair: { label: "Fair", color: "text-warning", bgColor: "bg-warning/10", bars: 2 },
  poor: { label: "Poor", color: "text-destructive", bgColor: "bg-destructive/10", bars: 1 },
};

const SignalQualityChip = ({ quality, showLabel = true, className }: SignalQualityChipProps) => {
  const config = qualityConfig[quality];
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md",
      config.bgColor,
      className
    )}>
      {/* Signal bars */}
      <div className="flex items-end gap-0.5 h-4">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={cn(
              "w-1 rounded-full transition-all duration-300",
              bar <= config.bars ? config.color.replace("text-", "bg-") : "bg-white/20",
              bar === 1 && "h-1",
              bar === 2 && "h-2",
              bar === 3 && "h-3",
              bar === 4 && "h-4"
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className={cn("text-caption font-medium", config.color)}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default SignalQualityChip;
