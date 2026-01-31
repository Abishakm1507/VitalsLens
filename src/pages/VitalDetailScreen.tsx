import { useNavigate, useParams } from "react-router-dom";
import TrendGraph from "@/components/analytics/TrendGraph";
import VariabilityCard from "@/components/analytics/VariabilityCard";
import BaselineComparison from "@/components/analytics/BaselineComparison";
import CorrelationCard from "@/components/analytics/CorrelationCard";
import ComplianceFooter from "@/components/analytics/ComplianceFooter";
import { ArrowLeft, Heart, Droplets, Wind } from "lucide-react";

type VitalType = "heartRate" | "spo2" | "respiratory";

const vitalConfig = {
  heartRate: {
    label: "Heart Rate",
    icon: Heart,
    colorClass: "text-[hsl(var(--heart-rate))]",
    bgClass: "bg-[hsl(var(--heart-rate)/0.1)]",
    unit: "BPM",
    normalRange: { min: 60, max: 100 },
  },
  spo2: {
    label: "SpO₂",
    icon: Droplets,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    unit: "%",
    normalRange: { min: 95, max: 100 },
  },
  respiratory: {
    label: "Respiratory Rate",
    icon: Wind,
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    unit: "breaths/min",
    normalRange: { min: 12, max: 20 },
  },
};

const VitalDetailScreen = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: VitalType }>();

  const vitalType = (type || "heartRate") as VitalType;
  const config = vitalConfig[vitalType];
  const VitalIcon = config.icon;

  // Mock trend data
  const trendData = [
    { date: "Mon", value: vitalType === "heartRate" ? 72 : vitalType === "spo2" ? 97 : 15 },
    { date: "Tue", value: vitalType === "heartRate" ? 75 : vitalType === "spo2" ? 96 : 14 },
    { date: "Wed", value: vitalType === "heartRate" ? 68 : vitalType === "spo2" ? 94 : 16 },
    { date: "Thu", value: vitalType === "heartRate" ? 71 : vitalType === "spo2" ? 97 : 15 },
    { date: "Fri", value: vitalType === "heartRate" ? 74 : vitalType === "spo2" ? 98 : 14 },
    { date: "Sat", value: vitalType === "heartRate" ? 82 : vitalType === "spo2" ? 96 : 17 },
    { date: "Sun", value: vitalType === "heartRate" ? 70 : vitalType === "spo2" ? 97 : 15 },
  ];

  // Mock baseline data
  const baselineValue = vitalType === "heartRate" ? 71 : vitalType === "spo2" ? 97 : 15;
  const currentValue = vitalType === "heartRate" ? 74 : vitalType === "spo2" ? 96 : 15;

  // Mock correlations
  const correlations = vitalType === "heartRate" ? [
    { title: "Evening Activity", description: "Higher heart rate observed during late evening hours (8-10 PM)", strength: "moderate" as const },
    { title: "Post-Meal Pattern", description: "Slight elevation detected 30-60 minutes after meals", strength: "weak" as const },
  ] : vitalType === "spo2" ? [
    { title: "Screen Time", description: "Lower SpO₂ observed after prolonged screen time sessions", strength: "moderate" as const },
    { title: "Sleep Quality", description: "Better readings correlated with 7+ hours of sleep", strength: "strong" as const },
  ] : [
    { title: "Stress Periods", description: "Elevated breathing rate during high-stress periods", strength: "moderate" as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate("/analytics")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card btn-ripple"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${config.bgClass} flex items-center justify-center`}>
              <VitalIcon className={`w-4 h-4 ${config.colorClass}`} />
            </div>
            <h1 className="text-section-title text-foreground">{config.label}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
          {/* Trend Graph */}
          <TrendGraph
            type={vitalType}
            data={trendData}
            normalRange={config.normalRange}
          />

          {/* Variability */}
          <VariabilityCard
            level={vitalType === "heartRate" ? "moderate" : "low"}
            percentage={vitalType === "heartRate" ? 45 : 25}
            vitalName={config.label}
          />

          {/* Baseline Comparison */}
          <BaselineComparison
            currentValue={currentValue}
            baselineValue={baselineValue}
            unit={config.unit}
            vitalName={config.label}
          />

          {/* Correlations */}
          <div>
            <h3 className="text-card-title text-foreground mb-3">Behavioral Correlations</h3>
            <div className="space-y-3">
              {correlations.map((corr, index) => (
                <CorrelationCard
                  key={index}
                  title={corr.title}
                  description={corr.description}
                  strength={corr.strength}
                />
              ))}
            </div>
          </div>

          {/* Navigation to other vitals */}
          <div className="pt-4">
            <p className="text-caption text-muted-foreground mb-3">View other vitals</p>
            <div className="flex gap-2">
              {(Object.keys(vitalConfig) as VitalType[])
                .filter(v => v !== vitalType)
                .map(v => {
                  const cfg = vitalConfig[v];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={v}
                      onClick={() => navigate(`/analytics/vital/${v}`)}
                      className={`flex-1 card-medical flex items-center justify-center gap-2 py-3 hover-lift btn-ripple`}
                    >
                      <Icon className={`w-4 h-4 ${cfg.colorClass}`} />
                      <span className="text-caption text-foreground">{cfg.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Compliance Footer */}
        <ComplianceFooter compact />
      </div>
    </div>
  );
};

export default VitalDetailScreen;
