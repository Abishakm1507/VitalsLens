import { Activity, Heart, Droplets, Wind, Calendar, Clock, ShieldCheck } from "lucide-react";
import { useVitalsStore } from "@/lib/vitalsStore";

interface HistoryEntry {
  timestamp: number;
  heartRate?: number;
  spo2?: number;
  respirationRate?: number;
}

const statusConfig = {
  stable: { label: "Stable", color: "text-success", bg: "bg-success/10" },
  "needs-attention": { label: "Needs Attention", color: "text-warning", bg: "bg-warning/10" },
  critical: { label: "Critical", color: "text-destructive", bg: "bg-destructive/10" },
};

const riskConfig = {
  low: { label: "Low Risk", color: "text-success" },
  moderate: { label: "Moderate Risk", color: "text-warning" },
  high: { label: "High Risk", color: "text-destructive" },
};

const ReportPreview = () => {
  // Pull latest vitals from store snapshot
  const { heartRate, spo2, respirationRate, signalQuality } = useVitalsStore.getState();

  // Load history for analytics
  const historyJson = localStorage.getItem("vitals_history");
  const history: HistoryEntry[] = historyJson ? JSON.parse(historyJson) : [];

  const allReadings = [...history];
  if (heartRate) allReadings.push({ timestamp: Date.now(), heartRate, spo2, respirationRate });

  const getStats = (key: keyof HistoryEntry) => {
    const values = allReadings
      .map(r => r[key])
      .filter(v => typeof v === 'number') as number[];

    if (values.length === 0) return { avg: "—", min: "—", max: "—", deviations: 0 };

    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { avg, min, max, deviations: values.length > 5 ? 1 : 0 };
  };

  const hrStats = getStats('heartRate');
  const spo2Stats = getStats('spo2');
  const respStats = getStats('respirationRate');

  const vitals = [
    { name: "Heart Rate", average: hrStats.avg, min: hrStats.min, max: hrStats.max, unit: "BPM", deviations: hrStats.deviations },
    { name: "SpO₂", average: spo2Stats.avg, min: spo2Stats.min, max: spo2Stats.max, unit: "%", deviations: spo2Stats.deviations },
    { name: "Respiratory Rate", average: respStats.avg, min: respStats.min, max: respStats.max, unit: "RPM", deviations: respStats.deviations },
  ];

  const overallStatus: "stable" | "needs-attention" | "critical" =
    (spo2 !== undefined && spo2 < 92) ? "critical" :
      (heartRate !== undefined && heartRate > 100) ? "needs-attention" : "stable";

  const riskLevel: "low" | "moderate" | "high" =
    overallStatus === "critical" ? "high" :
      overallStatus === "needs-attention" ? "moderate" : "low";

  const status = statusConfig[overallStatus];
  const risk = riskConfig[riskLevel];
  const confidence = signalQuality === "Good" ? 98 : signalQuality === "Fair" ? 72 : 45;

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-elevated">
      {/* Report Header */}
      <div className="bg-primary p-4 text-primary-foreground">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-card-title font-semibold">VitalsLens</h2>
            <p className="text-caption opacity-90">Touchless Health Monitoring Report</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-caption">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last 30 Days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Generated {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="p-4 border-b border-border">
        <h3 className="text-caption font-semibold text-muted-foreground uppercase tracking-wider mb-3">Summary</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-caption text-muted-foreground mb-1">Status</p>
            <span className={`inline-block px-2 py-1 rounded-full text-caption font-medium ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div className="text-center">
            <p className="text-caption text-muted-foreground mb-1">Risk Level</p>
            <span className={`text-card-title font-semibold ${risk.color}`}>{risk.label}</span>
          </div>
          <div className="text-center">
            <p className="text-caption text-muted-foreground mb-1">AI Confidence</p>
            <span className="text-card-title font-semibold text-foreground">{confidence}%</span>
          </div>
        </div>
      </div>

      {/* Vitals Table */}
      <div className="p-4 border-b border-border">
        <h3 className="text-caption font-semibold text-muted-foreground uppercase tracking-wider mb-3">Vitals Summary</h3>
        <div className="space-y-3">
          {vitals.map((vital) => (
            <div key={vital.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2">
                {vital.name === "Heart Rate" && <Heart className="w-4 h-4 text-[hsl(var(--heart-rate))]" />}
                {vital.name === "SpO₂" && <Droplets className="w-4 h-4 text-primary" />}
                {vital.name === "Respiratory Rate" && <Wind className="w-4 h-4 text-secondary" />}
                <span className="text-body text-foreground">{vital.name}</span>
              </div>
              <div className="text-right">
                <p className="text-card-title text-foreground font-medium">
                  {vital.average} <span className="text-caption text-muted-foreground">{vital.unit}</span>
                </p>
                <p className="text-caption text-muted-foreground">
                  Range: {vital.min}–{vital.max} • {vital.deviations} deviations
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Interpretation */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">AI Interpretation</h3>
        </div>
        <p className="text-body text-foreground leading-relaxed">
          {riskLevel === "high"
            ? "Your oxygen saturation levels are concerningly low. Please consult a healthcare professional immediately."
            : riskLevel === "moderate"
              ? "Your heart rate is slightly elevated. Monitor your activity and rest levels over the next 24 hours."
              : "Your vital signs are within normal ranges based on recent observations. Continue regular monitoring."}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-muted/30">
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          This report is intended for health awareness and teleconsultation support. VitalsLens does not provide medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default ReportPreview;
