import { Check, AlertTriangle, Sun, User, Hand, Glasses, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckItem {
  id: string;
  label: string;
  status: "ready" | "warning" | "pending";
  icon: LucideIcon;
}

interface ReadinessCheckProps {
  checks: CheckItem[];
  tips?: string[];
}

const statusConfig = {
  ready: { icon: Check, className: "bg-success/10 text-success border-success/20" },
  warning: { icon: AlertTriangle, className: "bg-warning/10 text-warning border-warning/20" },
  pending: { icon: null, className: "bg-muted text-muted-foreground border-border" },
};

const ReadinessCheck = ({ checks, tips }: ReadinessCheckProps) => {
  const allReady = checks.every(c => c.status === "ready");
  
  return (
    <div className="space-y-4">
      {/* Checklist */}
      <div className="space-y-2">
        {checks.map((check, index) => {
          const config = statusConfig[check.status];
          const StatusIcon = config.icon || check.icon;
          
          return (
            <div
              key={check.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300",
                config.className,
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                check.status === "ready" && "bg-success/20",
                check.status === "warning" && "bg-warning/20",
                check.status === "pending" && "bg-muted"
              )}>
                <StatusIcon className="w-4 h-4" />
              </div>
              <span className="text-card-title flex-1">{check.label}</span>
              {check.status === "ready" && (
                <Check className="w-5 h-5 text-success" />
              )}
              {check.status === "warning" && (
                <AlertTriangle className="w-5 h-5 text-warning" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Micro tips */}
      {tips && tips.length > 0 && (
        <div className="bg-muted/50 rounded-xl p-3 space-y-2">
          <p className="text-caption font-medium text-muted-foreground">Quick Tips:</p>
          <div className="flex flex-wrap gap-2">
            {tips.map((tip, index) => (
              <span 
                key={index}
                className="text-caption bg-card px-2 py-1 rounded-lg border border-border"
              >
                {tip}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Status indicator */}
      {allReady && (
        <div className="flex items-center justify-center gap-2 text-success animate-fade-in">
          <Check className="w-5 h-5" />
          <span className="text-body font-medium">Ready for accurate measurement</span>
        </div>
      )}
    </div>
  );
};

export default ReadinessCheck;
