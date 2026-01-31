import { ShieldCheck, AlertTriangle, AlertOctagon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVitalsStore } from "@/lib/vitalsStore";

type RiskLevel = "low" | "moderate" | "high";

interface RiskBannerProps {
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
    defaultExplanation: "Heart rate is elevated. Consider re-measuring after rest.",
    bgClass: "bg-warning/5",
    borderClass: "border-warning/20",
    iconBgClass: "bg-warning/20",
    textClass: "text-warning",
  },
  high: {
    icon: AlertOctagon,
    title: "Seek Medical Attention",
    defaultExplanation: "Oxygen levels are below normal. Please consult a healthcare provider.",
    bgClass: "bg-destructive/5",
    borderClass: "border-destructive/20",
    iconBgClass: "bg-destructive/20",
    textClass: "text-destructive",
  },
};

const RiskBanner = ({ onLearnMore }: RiskBannerProps) => {
  const { heartRate, spo2 } = useVitalsStore();

  // Rule-based logic
  let level: RiskLevel | null = null;
  let explanation = "";

  if (spo2 !== undefined && spo2 < 92) {
    level = "high";
    explanation = "Oxygen saturation (SpO₂) is low. This may indicate poor gas exchange.";
  } else if (heartRate !== undefined && heartRate > 110) {
    level = "moderate";
    explanation = "Heart rate is significantly elevated. Sit still and rest for 5 minutes.";
  }

  // If no risk detected, do not render
  if (!level) return null;

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
