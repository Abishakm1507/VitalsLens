import { Signal, SignalLow, SignalMedium, SignalHigh } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVitalsStore } from "@/lib/vitalsStore";

type Quality = "excellent" | "good" | "fair" | "poor";

interface SignalQualityChipProps {
  quality?: Quality;
  showLabel?: boolean;
  className?: string;
}

const qualityConfig: Record<Quality, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  bars: number;
}> = {
  excellent: {
    label: "Excellent",
    color: "text-success",
    bgColor: "bg-success/15",
    borderColor: "border-success/30",
    bars: 4
  },
  good: {
    label: "Good",
    color: "text-success",
    bgColor: "bg-success/15",
    borderColor: "border-success/30",
    bars: 3
  },
  fair: {
    label: "Fair",
    color: "text-warning",
    bgColor: "bg-warning/15",
    borderColor: "border-warning/30",
    bars: 2
  },
  poor: {
    label: "Poor",
    color: "text-destructive",
    bgColor: "bg-destructive/15",
    borderColor: "border-destructive/30",
    bars: 1
  },
};

const SignalQualityChip = ({ quality: propQuality, showLabel = true, className }: SignalQualityChipProps) => {
  const storeQuality = useVitalsStore((state) => state.signalQuality);

  // Use prop quality if provided, otherwise use store quality
  const rawQuality = propQuality || storeQuality.toLowerCase();
  const quality = (rawQuality as Quality) || "poor";

  const config = qualityConfig[quality] || qualityConfig.poor;

  return (
    <div className={cn(
      "flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-md border",
      config.bgColor,
      config.borderColor,
      className
    )}>
      {/* Signal bars - Enhanced */}
      <div className="flex items-end gap-1 h-5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={cn(
              "w-1.5 rounded-full transition-all duration-300",
              bar <= config.bars ? config.color.replace("text-", "bg-") : "bg-muted/40",
              bar === 1 && "h-2",
              bar === 2 && "h-3",
              bar === 3 && "h-4",
              bar === 4 && "h-5"
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className={cn("text-caption font-bold", config.color)}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default SignalQualityChip;
