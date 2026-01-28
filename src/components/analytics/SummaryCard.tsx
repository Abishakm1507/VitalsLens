import { TrendingUp, TrendingDown, Minus, Heart, Wind, Droplets } from "lucide-react";

type VitalType = "heartRate" | "spo2" | "respiratory";
type TrendDirection = "up" | "down" | "stable";
type StatusType = "normal" | "borderline" | "abnormal";

interface SummaryCardProps {
  type: VitalType;
  average: number;
  unit: string;
  trend: TrendDirection;
  status: StatusType;
  onClick?: () => void;
}

const vitalConfig = {
  heartRate: {
    label: "Heart Rate",
    shortLabel: "HR",
    icon: Heart,
    colorClass: "text-[hsl(var(--heart-rate))]",
    bgClass: "bg-[hsl(var(--heart-rate)/0.1)]",
  },
  spo2: {
    label: "SpO₂",
    shortLabel: "SpO₂",
    icon: Droplets,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  respiratory: {
    label: "Respiratory",
    shortLabel: "RR",
    icon: Wind,
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
  },
};

const trendConfig = {
  up: { icon: TrendingUp, label: "Rising" },
  down: { icon: TrendingDown, label: "Dip" },
  stable: { icon: Minus, label: "Stable" },
};

const statusConfig = {
  normal: {
    label: "Normal",
    className: "bg-success/10 text-success",
  },
  borderline: {
    label: "Borderline",
    className: "bg-warning/10 text-warning",
  },
  abnormal: {
    label: "Abnormal",
    className: "bg-destructive/10 text-destructive",
  },
};

const SummaryCard = ({ type, average, unit, trend, status, onClick }: SummaryCardProps) => {
  const vital = vitalConfig[type];
  const trendInfo = trendConfig[trend];
  const statusInfo = statusConfig[status];
  const TrendIcon = trendInfo.icon;
  const VitalIcon = vital.icon;

  return (
    <button
      onClick={onClick}
      className="min-w-[160px] card-medical hover-lift flex flex-col gap-3 text-left btn-ripple"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-lg ${vital.bgClass} flex items-center justify-center`}>
          <VitalIcon className={`w-4 h-4 ${vital.colorClass}`} />
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Value */}
      <div>
        <p className="text-caption text-muted-foreground">{vital.label}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-section-title text-foreground count-up">{average}</span>
          <span className="text-caption text-muted-foreground">{unit}</span>
        </div>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <TrendIcon className={`w-3.5 h-3.5 ${
          trend === "up" ? "text-warning" : 
          trend === "down" ? "text-primary" : 
          "text-muted-foreground"
        }`} />
        <span className="text-caption">7-day • {trendInfo.label}</span>
      </div>
    </button>
  );
};

export default SummaryCard;
