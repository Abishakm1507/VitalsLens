import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, Calendar, Heart, Droplets, Wind, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

type VitalType = "heartRate" | "spo2" | "respiratory";

const mockData = {
  heartRate: [
    { day: "Mon", value: 72 },
    { day: "Tue", value: 75 },
    { day: "Wed", value: 68 },
    { day: "Thu", value: 74 },
    { day: "Fri", value: 71 },
    { day: "Sat", value: 69 },
    { day: "Sun", value: 73 },
  ],
  spo2: [
    { day: "Mon", value: 97 },
    { day: "Tue", value: 98 },
    { day: "Wed", value: 97 },
    { day: "Thu", value: 98 },
    { day: "Fri", value: 96 },
    { day: "Sat", value: 98 },
    { day: "Sun", value: 97 },
  ],
  respiratory: [
    { day: "Mon", value: 15 },
    { day: "Tue", value: 16 },
    { day: "Wed", value: 14 },
    { day: "Thu", value: 15 },
    { day: "Fri", value: 16 },
    { day: "Sat", value: 14 },
    { day: "Sun", value: 15 },
  ],
};

const vitalConfig = {
  heartRate: {
    label: "Heart Rate",
    unit: "BPM",
    color: "hsl(0, 84%, 60%)",
    icon: Heart,
    min: 50,
    max: 100,
  },
  spo2: {
    label: "Blood Oxygen",
    unit: "%",
    color: "hsl(207, 97%, 55%)",
    icon: Droplets,
    min: 90,
    max: 100,
  },
  respiratory: {
    label: "Respiratory",
    unit: "br/min",
    color: "hsl(161, 74%, 52%)",
    icon: Wind,
    min: 10,
    max: 25,
  },
};

const HistoryScreen = () => {
  const navigate = useNavigate();
  const [selectedVital, setSelectedVital] = useState<VitalType>("heartRate");
  const [period, setPeriod] = useState<"week" | "month">("week");

  const config = vitalConfig[selectedVital];
  const data = mockData[selectedVital];
  const latestValue = data[data.length - 1].value;
  const previousValue = data[data.length - 2].value;
  const trend = latestValue > previousValue ? "up" : latestValue < previousValue ? "down" : "stable";

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">History</h1>
          <button className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Vital type selector */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 p-1 bg-card rounded-xl">
            {(Object.keys(vitalConfig) as VitalType[]).map((type) => {
              const Icon = vitalConfig[type].icon;
              const isSelected = selectedVital === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedVital(type)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${isSelected
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-caption font-medium hidden sm:inline">
                    {vitalConfig[type].label.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current value card */}
        <div className="mx-4 p-4 card-medical mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-muted-foreground">{config.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-vital" style={{ color: config.color }}>
                  {latestValue}
                </span>
                <span className="text-body text-muted-foreground">{config.unit}</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${trend === "up" ? "bg-warning/10 text-warning" :
              trend === "down" ? "bg-success/10 text-success" :
                "bg-muted text-muted-foreground"
              }`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-caption font-medium">
                {Math.abs(latestValue - previousValue)} {config.unit}
              </span>
            </div>
          </div>
        </div>

        {/* Period selector */}
        <div className="px-4 mb-2 flex gap-2">
          {["week", "month"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as typeof period)}
              className={`px-4 py-2 rounded-lg text-caption font-medium transition-colors ${period === p
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground"
                }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 px-4">
          <div className="h-[200px] card-medical">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: -20 }}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(209, 22%, 49%)' }}
                />
                <YAxis
                  domain={[config.min, config.max]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(209, 22%, 49%)' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(0, 0%, 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ color: 'hsl(209, 63%, 16%)' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={config.color}
                  strokeWidth={3}
                  dot={{ fill: config.color, strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: config.color, strokeWidth: 2, fill: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent readings */}
        <div className="px-4 pb-6 mt-4">
          <h3 className="text-card-title text-foreground mb-3">Recent Readings</h3>
          <div className="space-y-2">
            {data.slice().reverse().slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-card rounded-xl">
                <span className="text-body text-muted-foreground">{item.day}</span>
                <span className="text-card-title" style={{ color: config.color }}>
                  {item.value} {config.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HistoryScreen;
