import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConfidenceIndicatorProps {
  confidence: number;
  showTooltip?: boolean;
  size?: "sm" | "md";
}

const ConfidenceIndicator = ({ 
  confidence, 
  showTooltip = true,
  size = "md" 
}: ConfidenceIndicatorProps) => {
  const getColor = (value: number) => {
    if (value >= 90) return "text-success";
    if (value >= 70) return "text-warning";
    return "text-destructive";
  };
  
  const getBgColor = (value: number) => {
    if (value >= 90) return "bg-success";
    if (value >= 70) return "bg-warning";
    return "bg-destructive";
  };
  
  return (
    <div className={cn(
      "flex items-center gap-2",
      size === "sm" && "gap-1"
    )}>
      <div className="flex items-center gap-1.5">
        <span className={cn(
          "text-caption text-muted-foreground",
          size === "sm" && "text-[10px]"
        )}>
          Confidence:
        </span>
        <span className={cn(
          "font-semibold",
          getColor(confidence),
          size === "sm" ? "text-caption" : "text-body"
        )}>
          {confidence}%
        </span>
      </div>
      
      {/* Mini progress bar */}
      <div className={cn(
        "flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[60px]",
        size === "sm" && "h-1 max-w-[40px]"
      )}>
        <div 
          className={cn("h-full rounded-full transition-all duration-500", getBgColor(confidence))}
          style={{ width: `${confidence}%` }}
        />
      </div>
      
      {showTooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-0.5 hover:bg-muted rounded-full transition-colors">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            <p className="text-xs">
              AI confidence based on signal stability, lighting conditions, and face visibility
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default ConfidenceIndicator;
