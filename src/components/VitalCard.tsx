import { Heart, Droplets, Wind, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type VitalType = "heartRate" | "spo2" | "respiratory";
type Status = "normal" | "warning" | "critical";

interface VitalCardProps {
  type: VitalType;
  value: number | string;
  unit: string;
  status?: Status;
  compact?: boolean;
  onClick?: () => void;
}

const vitalConfig: Record<VitalType, {
  icon: LucideIcon;
  label: string;
  colorClass: string;
  bgClass: string;
  gradientClass: string;
}> = {
  heartRate: {
    icon: Heart,
    label: "Heart Rate",
    colorClass: "text-[hsl(var(--heart-rate))]",
    bgClass: "bg-[hsl(var(--heart-rate)/0.12)]",
    gradientClass: "from-[hsl(var(--heart-rate)/0.08)] to-transparent",
  },
  spo2: {
    icon: Droplets,
    label: "SpO₂",
    colorClass: "text-[hsl(var(--spo2))]",
    bgClass: "bg-[hsl(var(--spo2)/0.12)]",
    gradientClass: "from-[hsl(var(--spo2)/0.08)] to-transparent",
  },
  respiratory: {
    icon: Wind,
    label: "Respiratory Rate",
    colorClass: "text-[hsl(var(--respiratory))]",
    bgClass: "bg-[hsl(var(--respiratory)/0.12)]",
    gradientClass: "from-[hsl(var(--respiratory)/0.08)] to-transparent",
  },
};

const statusConfig: Record<Status, { label: string; className: string; dotColor: string }> = {
  normal: {
    label: "Normal",
    className: "bg-success/15 text-success border border-success/25",
    dotColor: "bg-success"
  },
  warning: {
    label: "Elevated",
    className: "bg-warning/15 text-warning border border-warning/25",
    dotColor: "bg-warning"
  },
  critical: {
    label: "Critical",
    className: "bg-destructive/15 text-destructive border border-destructive/25",
    dotColor: "bg-destructive"
  },
};

const VitalCard = ({
  type,
  value,
  unit,
  status = "normal",
  compact = false,
  onClick
}: VitalCardProps) => {
  const config = vitalConfig[type];
  const statusInfo = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "vital-card cursor-pointer hover:shadow-elevated transition-all duration-300 relative overflow-hidden group",
        compact && "min-h-[120px] p-4"
      )}
      onClick={onClick}
    >
      {/* Subtle gradient background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40", config.gradientClass)} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300", config.bgClass)}>
            <Icon className={cn("w-7 h-7", config.colorClass)} strokeWidth={2.5} />
          </div>
          <span className={cn(
            "px-3 py-1.5 rounded-full text-caption font-bold flex items-center gap-1.5",
            statusInfo.className
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", statusInfo.dotColor)} />
            {statusInfo.label}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-end space-y-1">
          <span className="text-muted-foreground text-caption uppercase tracking-wide">{config.label}</span>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-vital", config.colorClass)}>{value}</span>
            <span className="text-muted-foreground text-body font-semibold">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalCard;
