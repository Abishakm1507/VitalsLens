import { Zap, AlertTriangle } from "lucide-react";

interface CorrelationCardProps {
  title: string;
  description: string;
  strength: "weak" | "moderate" | "strong";
}

const strengthConfig = {
  weak: {
    label: "Weak correlation",
    bars: 1,
    color: "bg-muted-foreground",
  },
  moderate: {
    label: "Moderate correlation",
    bars: 2,
    color: "bg-warning",
  },
  strong: {
    label: "Strong correlation",
    bars: 3,
    color: "bg-primary",
  },
};

const CorrelationCard = ({ title, description, strength }: CorrelationCardProps) => {
  const config = strengthConfig[strength];

  return (
    <div className="card-medical hover-lift">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-card-title text-foreground">{title}</h4>
            
            {/* Strength indicator */}
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((bar) => (
                <div
                  key={bar}
                  className={`w-1 rounded-full transition-all ${
                    bar <= config.bars ? config.color : "bg-muted"
                  }`}
                  style={{ height: `${8 + bar * 4}px` }}
                />
              ))}
            </div>
          </div>
          
          <p className="text-body text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          <p className="text-caption text-muted-foreground mt-2">
            {config.label}
          </p>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <AlertTriangle className="w-3 h-3 text-warning shrink-0" />
        <p className="text-[10px] text-muted-foreground">
          Correlation ≠ Diagnosis. Patterns are for awareness only.
        </p>
      </div>
    </div>
  );
};

export default CorrelationCard;
