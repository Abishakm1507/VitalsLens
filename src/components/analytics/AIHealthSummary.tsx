import { Sparkles, ShieldCheck, RefreshCw } from "lucide-react";

interface AIHealthSummaryProps {
  summary: string;
  confidence: number;
  lastUpdated: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const AIHealthSummary = ({ summary, confidence, lastUpdated, onRefresh, isLoading }: AIHealthSummaryProps) => {
  const getConfidenceLabel = (conf: number) => {
    if (conf >= 90) return { label: "High", color: "text-success" };
    if (conf >= 70) return { label: "Moderate", color: "text-warning" };
    return { label: "Low", color: "text-destructive" };
  };

  const confInfo = getConfidenceLabel(confidence);

  return (
    <div className="card-medical border-2 border-primary/20 hover-lift">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-card-title text-foreground">AI Health Summary</h3>
            <p className="text-caption text-muted-foreground">Updated {lastUpdated}</p>
          </div>
        </div>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {/* Summary text */}
      <div className="relative">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-full" />
            <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
            <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
          </div>
        ) : (
          <p className="text-body text-foreground leading-relaxed">
            {summary}
          </p>
        )}
      </div>

      {/* Confidence badge */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${confInfo.color}`} />
          <span className="text-caption text-muted-foreground">
            Insight Confidence: <span className={`font-semibold ${confInfo.color}`}>{confInfo.label} ({confidence}%)</span>
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
        AI-generated summary based on your recent readings. Not a medical diagnosis.
      </p>
    </div>
  );
};

export default AIHealthSummary;
