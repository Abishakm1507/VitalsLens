import { ShieldCheck, AlertTriangle, AlertOctagon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type RiskLevel = "low" | "moderate" | "high";

interface RiskBannerProps {
  level: RiskLevel;
  explanation?: string;
  onLearnMore?: () => void;
}

const riskConfig: Record<RiskLevel, {
  icon: typeof ShieldCheck;
  title: string;
  defaultExplanation: string;
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
  textClass: string;
}> = {
  low: {
    icon: ShieldCheck,
    title: "Low Risk",
    defaultExplanation: "Based on WHO reference ranges and your recent trends",
    bgClass: "bg-success/5",
    borderClass: "border-success/20",
    iconBgClass: "bg-success/20",
    textClass: "text-success",
  },
  moderate: {
    icon: AlertTriangle,
    title: "Monitor Closely",
    defaultExplanation: "Some readings require attention. Consider re-measuring after rest.",
    bgClass: "bg-warning/5",
    borderClass: "border-warning/20",
    iconBgClass: "bg-warning/20",
    textClass: "text-warning",
  },
  high: {
    icon: AlertOctagon,
    title: "Seek Medical Attention",
    defaultExplanation: "Readings indicate potential health concern. Please consult a healthcare provider.",
    bgClass: "bg-destructive/5",
    borderClass: "border-destructive/20",
    iconBgClass: "bg-destructive/20",
    textClass: "text-destructive",
  },
};

const RiskBanner = ({ level, explanation, onLearnMore }: RiskBannerProps) => {
  const config = riskConfig[level];
  const Icon = config.icon;
  
  return (
    <div className={cn(
      "rounded-2xl border p-4 transition-all duration-300 animate-fade-in",
      config.bgClass,
      config.borderClass
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", config.iconBgClass)}>
          <Icon className={cn("w-6 h-6", config.textClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "px-2 py-0.5 rounded-full text-caption font-semibold",
              config.bgClass,
              config.textClass
            )}>
              {level === "low" && "🟢"}
              {level === "moderate" && "🟡"}
              {level === "high" && "🔴"}
            </span>
            <h3 className={cn("text-card-title font-semibold", config.textClass)}>
              {config.title}
            </h3>
          </div>
          <p className="text-caption text-muted-foreground leading-relaxed">
            {explanation || config.defaultExplanation}
          </p>
        </div>
        {onLearnMore && (
          <button 
            onClick={onLearnMore}
            className="p-2 hover:bg-card rounded-lg transition-colors shrink-0"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RiskBanner;
