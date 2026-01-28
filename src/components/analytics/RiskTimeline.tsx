import { useState } from "react";
import { Info } from "lucide-react";

type RiskLevel = "normal" | "monitor" | "critical";

interface TimelineEvent {
  date: string;
  level: RiskLevel;
  tooltip?: string;
}

interface RiskTimelineProps {
  events: TimelineEvent[];
  title?: string;
}

const levelConfig = {
  normal: {
    color: "bg-success",
    label: "Normal",
  },
  monitor: {
    color: "bg-warning",
    label: "Monitor",
  },
  critical: {
    color: "bg-destructive",
    label: "Critical",
  },
};

const RiskTimeline = ({ events, title = "Risk Timeline" }: RiskTimelineProps) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  return (
    <div className="card-medical">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-card-title text-foreground">{title}</h3>
        <div className="flex items-center gap-3">
          {(["normal", "monitor", "critical"] as RiskLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${levelConfig[level].color}`} />
              <span className="text-[10px] text-muted-foreground">{levelConfig[level].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Track background */}
        <div className="h-3 bg-muted rounded-full overflow-hidden flex">
          {events.map((event, index) => (
            <div
              key={index}
              className={`flex-1 ${levelConfig[event.level].color} relative cursor-pointer transition-all hover:brightness-110`}
              onMouseEnter={() => setActiveTooltip(index)}
              onMouseLeave={() => setActiveTooltip(null)}
              style={{
                marginRight: index < events.length - 1 ? "2px" : 0,
              }}
            >
              {/* Tooltip */}
              {activeTooltip === index && event.tooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 animate-fade-in">
                  <div className="bg-foreground text-background px-2.5 py-1.5 rounded-lg text-[11px] whitespace-nowrap shadow-lg">
                    {event.tooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Date labels */}
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">{events[0]?.date}</span>
          <span className="text-[10px] text-muted-foreground">{events[events.length - 1]?.date}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-start gap-2 mt-4 pt-3 border-t border-border">
        <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-caption text-muted-foreground leading-relaxed">
          Timeline shows daily risk assessment based on vital readings. Tap segments for details.
        </p>
      </div>
    </div>
  );
};

export default RiskTimeline;
