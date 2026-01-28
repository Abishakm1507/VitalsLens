import { AlertTriangle, AlertCircle, Info, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertSeverity = "info" | "warning" | "critical";

interface AlertCardProps {
  severity: AlertSeverity;
  title: string;
  message: string;
  time?: string;
}

const severityConfig: Record<AlertSeverity, {
  icon: LucideIcon;
  className: string;
  iconBg: string;
}> = {
  info: {
    icon: Info,
    className: "border-primary/30 bg-primary/5",
    iconBg: "bg-primary/10 text-primary",
  },
  warning: {
    icon: AlertCircle,
    className: "border-warning/30 bg-warning/5",
    iconBg: "bg-warning/10 text-warning",
  },
  critical: {
    icon: AlertTriangle,
    className: "border-destructive/30 bg-destructive/5",
    iconBg: "bg-destructive/10 text-destructive",
  },
};

const AlertCard = ({ severity, title, message, time }: AlertCardProps) => {
  const config = severityConfig[severity];
  const Icon = config.icon;
  
  return (
    <div className={cn("card-medical border", config.className)}>
      <div className="flex gap-3">
        <div className={cn("p-2 rounded-xl shrink-0", config.iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-card-title text-foreground">{title}</h4>
            {time && <span className="text-caption text-muted-foreground shrink-0">{time}</span>}
          </div>
          <p className="text-body text-muted-foreground mt-1 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
