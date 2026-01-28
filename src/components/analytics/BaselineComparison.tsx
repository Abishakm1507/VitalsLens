import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface BaselineComparisonProps {
  currentValue: number;
  baselineValue: number;
  unit: string;
  vitalName: string;
}

const BaselineComparison = ({ currentValue, baselineValue, unit, vitalName }: BaselineComparisonProps) => {
  const deviation = ((currentValue - baselineValue) / baselineValue) * 100;
  const absDeviation = Math.abs(deviation);
  
  const getDeviationInfo = () => {
    if (absDeviation < 5) {
      return {
        label: "Within baseline",
        icon: Minus,
        color: "text-success",
        bgColor: "bg-success/10",
      };
    }
    if (deviation > 0) {
      return {
        label: "Above baseline",
        icon: TrendingUp,
        color: absDeviation > 15 ? "text-destructive" : "text-warning",
        bgColor: absDeviation > 15 ? "bg-destructive/10" : "bg-warning/10",
      };
    }
    return {
      label: "Below baseline",
      icon: TrendingDown,
      color: absDeviation > 15 ? "text-destructive" : "text-primary",
      bgColor: absDeviation > 15 ? "bg-destructive/10" : "bg-primary/10",
    };
  };

  const devInfo = getDeviationInfo();
  const DevIcon = devInfo.icon;

  return (
    <div className="card-medical hover-lift">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
          <Target className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-card-title text-foreground mb-3">Personal Baseline</h4>
          
          {/* Comparison visual */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <p className="text-caption text-muted-foreground mb-1">Your Baseline</p>
              <p className="text-section-title text-muted-foreground">
                {baselineValue} <span className="text-caption">{unit}</span>
              </p>
            </div>
            
            <div className={`w-10 h-10 rounded-full ${devInfo.bgColor} flex items-center justify-center`}>
              <DevIcon className={`w-5 h-5 ${devInfo.color}`} />
            </div>
            
            <div className="flex-1 text-right">
              <p className="text-caption text-muted-foreground mb-1">Current</p>
              <p className="text-section-title text-foreground count-up">
                {currentValue} <span className="text-caption">{unit}</span>
              </p>
            </div>
          </div>
          
          {/* Deviation badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${devInfo.bgColor}`}>
            <DevIcon className={`w-3.5 h-3.5 ${devInfo.color}`} />
            <span className={`text-caption font-medium ${devInfo.color}`}>
              {devInfo.label} ({deviation > 0 ? "+" : ""}{deviation.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
      
      {/* Explanation */}
      <p className="text-caption text-muted-foreground mt-4 pt-3 border-t border-border leading-relaxed">
        Your baseline is calculated from your last 10 stable {vitalName.toLowerCase()} readings.
      </p>
    </div>
  );
};

export default BaselineComparison;
