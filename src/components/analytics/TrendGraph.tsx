import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";

type TimeRange = "24h" | "7d" | "30d";
type VitalType = "heartRate" | "spo2" | "respiratory";

interface TrendGraphProps {
  type: VitalType;
  normalRange: { min: number; max: number };
  onRangeChange?: (range: TimeRange) => void;
}

const vitalConfig = {
  heartRate: {
    label: "Heart Rate",
    unit: "BPM",
    color: "hsl(var(--heart-rate))",
    gradientId: "heartRateGradient",
    storeKey: "heartRate" as keyof HistoryEntry
  },
  spo2: {
    label: "SpO₂",
    unit: "%",
    color: "hsl(var(--primary))",
    gradientId: "spo2Gradient",
    storeKey: "spo2" as keyof HistoryEntry
  },
  respiratory: {
    label: "Respiratory Rate",
    unit: "breaths/min",
    color: "hsl(var(--secondary))",
    gradientId: "respiratoryGradient",
    storeKey: "respirationRate" as keyof HistoryEntry
  },
};

interface HistoryEntry {
  timestamp: number;
  heartRate?: number;
  spo2?: number;
  respirationRate?: number;
}

const TrendGraph = ({ type, normalRange, onRangeChange }: TrendGraphProps) => {
  const [activeRange, setActiveRange] = useState<TimeRange>("7d");
  const [data, setData] = useState<Array<{ date: string; value: number }>>([]);
  const config = vitalConfig[type];

  useEffect(() => {
    // Load history from localStorage
    const loadHistory = () => {
      try {
        const historyJson = localStorage.getItem("vitals_history");
        if (!historyJson) {
          setData([]);
          return;
        }

        const history: HistoryEntry[] = JSON.parse(historyJson);

        // Map history to chart data format
        const chartData = history
          .filter(entry => entry[config.storeKey] !== undefined)
          .map(entry => ({
            date: new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
            value: entry[config.storeKey] as number
          }))
          .slice(-10); // Show last 10 readings for now

        setData(chartData);
      } catch (err) {
        console.error("Failed to load vitals history:", err);
        setData([]);
      }
    };

    loadHistory();

    // Optional: Add event listener for storage changes
    window.addEventListener("storage", loadHistory);
    return () => window.removeEventListener("storage", loadHistory);
  }, [type, config.storeKey]);

  const handleRangeChange = (range: TimeRange) => {
    setActiveRange(range);
    onRangeChange?.(range);
  };

  const hasAbnormal = data.some(d => d.value < normalRange.min || d.value > normalRange.max);

  if (data.length === 0) {
    return (
      <div className="card-medical flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <LineChart className="w-6 h-6 text-muted-foreground opacity-20" />
        </div>
        <p className="text-body font-medium text-foreground">No data available yet</p>
        <p className="text-caption text-muted-foreground mt-1">Complete a scan to see your trends</p>
      </div>
    );
  }

  return (
    <div className="card-medical">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-card-title text-foreground">{config.label} Trend</h3>
          <p className="text-caption text-muted-foreground mt-0.5">
            Normal range: {normalRange.min}-{normalRange.max} {config.unit}
          </p>
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          {(["24h", "7d", "30d"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              className={`px-3 py-1.5 rounded-md text-caption font-medium transition-all ${activeRange === range
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[180px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <ReferenceLine
              y={normalRange.min}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeOpacity={0.3}
            />
            <ReferenceLine
              y={normalRange.max}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeOpacity={0.3}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              dy={8}
            />
            <YAxis
              domain={["dataMin - 5", "dataMax + 5"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              width={35}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill={`url(#${config.gradientId})`}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2.5}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const isAbnormal = payload.value < normalRange.min || payload.value > normalRange.max;
                if (!isAbnormal) return <circle cx={cx} cy={cy} r={0} />;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="hsl(var(--destructive))"
                    stroke="white"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 6, fill: config.color, stroke: "white", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {hasAbnormal && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
          <span className="text-caption text-muted-foreground">Readings outside normal range</span>
        </div>
      )}
    </div>
  );
};

export default TrendGraph;
