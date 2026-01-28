import { Signal, Sun, Move, CheckCircle, AlertCircle } from "lucide-react";

interface QualityMetric {
  label: string;
  value: number;
  icon: typeof Signal;
}

interface DataQualityPanelProps {
  signalQuality: number;
  lightingConsistency: number;
  motionInterference: number;
}

const getQualityLabel = (value: number) => {
  if (value >= 80) return { label: "Excellent", color: "text-success" };
  if (value >= 60) return { label: "Good", color: "text-primary" };
  if (value >= 40) return { label: "Fair", color: "text-warning" };
  return { label: "Poor", color: "text-destructive" };
};

const getBarColor = (value: number) => {
  if (value >= 80) return "bg-success";
  if (value >= 60) return "bg-primary";
  if (value >= 40) return "bg-warning";
  return "bg-destructive";
};

const DataQualityPanel = ({ signalQuality, lightingConsistency, motionInterference }: DataQualityPanelProps) => {
  // For motion, lower is better, so we invert for display
  const motionScore = 100 - motionInterference;
  
  const metrics: QualityMetric[] = [
    { label: "Signal Quality", value: signalQuality, icon: Signal },
    { label: "Lighting Consistency", value: lightingConsistency, icon: Sun },
    { label: "Stability Score", value: motionScore, icon: Move },
  ];

  const overallQuality = Math.round((signalQuality + lightingConsistency + motionScore) / 3);
  const overallInfo = getQualityLabel(overallQuality);

  return (
    <div className="card-medical">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-card-title text-foreground">Data Quality</h3>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${
          overallQuality >= 60 ? "bg-success/10" : "bg-warning/10"
        }`}>
          {overallQuality >= 60 ? (
            <CheckCircle className="w-3.5 h-3.5 text-success" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-warning" />
          )}
          <span className={`text-caption font-medium ${overallInfo.color}`}>
            {overallInfo.label}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        {metrics.map((metric) => {
          const qualityInfo = getQualityLabel(metric.value);
          const MetricIcon = metric.icon;
          
          return (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <MetricIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-caption text-foreground">{metric.label}</span>
                </div>
                <span className={`text-caption font-medium ${qualityInfo.color}`}>
                  {metric.value}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(metric.value)}`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tip */}
      <p className="text-caption text-muted-foreground mt-4 pt-3 border-t border-border leading-relaxed">
        Higher quality scores improve AI accuracy. Ensure good lighting and stay still during scans.
      </p>
    </div>
  );
};

export default DataQualityPanel;
