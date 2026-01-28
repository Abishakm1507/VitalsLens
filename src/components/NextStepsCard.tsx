import { RefreshCw, Droplets, Share2, Save, Clock, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";

interface Suggestion {
  icon: typeof RefreshCw;
  text: string;
}

interface NextStepsCardProps {
  riskLevel?: "low" | "moderate" | "high";
  onSave?: () => void;
  onShare?: () => void;
  onRescan?: () => void;
}

const NextStepsCard = ({ riskLevel = "low", onSave, onShare, onRescan }: NextStepsCardProps) => {
  const getSuggestions = (): Suggestion[] => {
    switch (riskLevel) {
      case "high":
        return [
          { icon: Stethoscope, text: "Share this reading with a doctor" },
          { icon: RefreshCw, text: "Re-scan to confirm readings" },
          { icon: Clock, text: "Monitor symptoms closely" },
        ];
      case "moderate":
        return [
          { icon: Clock, text: "Recheck after resting 5 minutes" },
          { icon: Droplets, text: "Hydrate and monitor again later" },
          { icon: RefreshCw, text: "Take another measurement to confirm" },
        ];
      default:
        return [
          { icon: Clock, text: "Check again tomorrow morning" },
          { icon: Droplets, text: "Stay hydrated throughout the day" },
          { icon: Save, text: "Save this reading to track trends" },
        ];
    }
  };
  
  const suggestions = getSuggestions();
  
  return (
    <div className="card-medical space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-card-title text-foreground font-medium">What Should I Do Next?</h3>
      </div>
      
      {/* Suggestions */}
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-body text-foreground">{suggestion.text}</span>
            </div>
          );
        })}
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onSave}
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShare}
          className="flex-1"
        >
          <Share2 className="w-4 h-4 mr-1.5" />
          Share
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onRescan}
          className="flex-1"
        >
          <RefreshCw className="w-4 h-4 mr-1.5" />
          Re-scan
        </Button>
      </div>
    </div>
  );
};

export default NextStepsCard;
