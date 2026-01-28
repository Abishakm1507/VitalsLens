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
}> = {
  heartRate: {
    icon: Heart,
    label: "Heart Rate",
    colorClass: "text-heartRate",
    bgClass: "bg-heartRate/10",
  },
  spo2: {
    icon: Droplets,
    label: "SpO₂",
    colorClass: "text-spo2",
    bgClass: "bg-spo2/10",
  },
  respiratory: {
    icon: Wind,
    label: "Respiratory",
    colorClass: "text-respiratory",
    bgClass: "bg-respiratory/10",
  },
};

const statusConfig: Record<Status, { label: string; className: string }> = {
  normal: { label: "Normal", className: "status-normal" },
  warning: { label: "Elevated", className: "status-warning" },
  critical: { label: "High", className: "status-critical" },
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
        "vital-card cursor-pointer hover:shadow-elevated transition-shadow duration-200",
        compact && "min-h-[100px]"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className={cn("p-2 rounded-xl", config.bgClass)}>
          <Icon className={cn("w-6 h-6", config.colorClass)} />
        </div>
        <span className={cn(
          "px-2 py-1 rounded-full text-caption font-medium",
          statusInfo.className
        )}>
          {statusInfo.label}
        </span>
      </div>
      
      <div className="flex-1 flex flex-col justify-end">
        <span className="text-muted-foreground text-caption">{config.label}</span>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-vital", config.colorClass)}>{value}</span>
          <span className="text-muted-foreground text-body">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default VitalCard;
