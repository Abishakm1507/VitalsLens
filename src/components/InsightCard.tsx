import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "default" | "success" | "warning" | "info";
}

const InsightCard = ({ 
  icon: Icon, 
  title, 
  description, 
  variant = "default" 
}: InsightCardProps) => {
  const variantStyles = {
    default: "border-border",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    info: "border-primary/30 bg-primary/5",
  };
  
  const iconStyles = {
    default: "text-muted-foreground bg-muted",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    info: "text-primary bg-primary/10",
  };
  
  return (
    <div className={cn(
      "card-medical border",
      variantStyles[variant]
    )}>
      <div className="flex gap-3">
        <div className={cn("p-2 rounded-xl shrink-0", iconStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-card-title text-foreground mb-1">{title}</h4>
          <p className="text-body text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
