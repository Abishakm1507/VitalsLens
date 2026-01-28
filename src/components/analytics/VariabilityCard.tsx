import { Activity, Info } from "lucide-react";

type VariabilityLevel = "low" | "moderate" | "high";

interface VariabilityCardProps {
  level: VariabilityLevel;
  percentage: number;
  vitalName: string;
}

const levelConfig = {
  low: {
    label: "Low Variability",
    color: "bg-success",
    textColor: "text-success",
    description: "Your readings are consistent and stable.",
  },
  moderate: {
    label: "Moderate Variability",
    color: "bg-warning",
    textColor: "text-warning",
    description: "Some fluctuation observed. This may be normal depending on activity level.",
  },
  high: {
    label: "High Variability",
    color: "bg-destructive",
    textColor: "text-destructive",
    description: "Higher variability may indicate stress, fatigue, or inconsistent breathing patterns.",
  },
};

const VariabilityCard = ({ level, percentage, vitalName }: VariabilityCardProps) => {
  const config = levelConfig[level];

  return (
    <div className="card-medical hover-lift">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-card-title text-foreground">{vitalName} Variability</h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
              level === "low" ? "bg-success/10 text-success" :
              level === "moderate" ? "bg-warning/10 text-warning" :
              "bg-destructive/10 text-destructive"
            }`}>
              {config.label.split(" ")[0]}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${config.color}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {/* Description */}
          <p className="text-caption text-muted-foreground leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>
      
      {/* Info tooltip */}
      <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border">
        <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Variability is calculated from the standard deviation of your readings over the selected time period.
        </p>
      </div>
    </div>
  );
};

export default VariabilityCard;
