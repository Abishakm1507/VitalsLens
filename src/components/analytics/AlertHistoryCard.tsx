import { AlertTriangle, AlertCircle, Info, Clock } from "lucide-react";

type AlertType = "critical" | "warning" | "info";

interface AlertHistoryCardProps {
  type: AlertType;
  title: string;
  reason: string;
  suggestion: string;
  timestamp: string;
}

const typeConfig = {
  critical: {
    icon: AlertTriangle,
    bgColor: "bg-destructive/10",
    iconColor: "text-destructive",
    borderColor: "border-l-destructive",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-warning/10",
    iconColor: "text-warning",
    borderColor: "border-l-warning",
  },
  info: {
    icon: Info,
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "border-l-primary",
  },
};

const AlertHistoryCard = ({ type, title, reason, suggestion, timestamp }: AlertHistoryCardProps) => {
  const config = typeConfig[type];
  const AlertIcon = config.icon;

  return (
    <div className={`card-medical border-l-4 ${config.borderColor} hover-lift`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center shrink-0`}>
          <AlertIcon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-card-title text-foreground">{title}</h4>
            <div className="flex items-center gap-1 text-muted-foreground shrink-0">
              <Clock className="w-3 h-3" />
              <span className="text-[10px]">{timestamp}</span>
            </div>
          </div>
          
          <p className="text-body text-muted-foreground mb-2">
            {reason}
          </p>
          
          <div className="bg-muted/50 rounded-lg px-3 py-2">
            <p className="text-caption text-foreground">
              <span className="font-medium">Suggestion:</span> {suggestion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertHistoryCard;
