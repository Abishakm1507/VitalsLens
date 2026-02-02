import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import SummaryCard from "@/components/analytics/SummaryCard";
import AIHealthSummary from "@/components/analytics/AIHealthSummary";
import RiskTimeline from "@/components/analytics/RiskTimeline";
import DataQualityPanel from "@/components/analytics/DataQualityPanel";
import ComplianceFooter from "@/components/analytics/ComplianceFooter";
import { BarChart3, FileText, Bell, ChevronRight } from "lucide-react";
import { useVitalsStore } from "@/lib/vitalsStore";
import { analyzeWellness } from "@/lib/wellness";

const AnalyticsScreen = () => {
  const navigate = useNavigate();
  const { history } = useVitalsStore();

  // Calculate averages for latest snapshot
  const calculateAverage = (type: "heartRate" | "spo2" | "respirationRate") => {
    if (!history || history.length === 0) return 0;
    const values = history.map(h => h[type]);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  const hrAvg = calculateAverage("heartRate");
  const spo2Avg = calculateAverage("spo2");
  const respAvg = calculateAverage("respirationRate");

  // Wellness Calculation using latest full analysis
  const wellness = history.length > 0
    ? analyzeWellness(hrAvg, spo2Avg, respAvg)
    : null;

  // Derive status/trends for SummaryCards (keeping existing UI logic or verifying)
  const calculateMetrics = (type: "heartRate" | "spo2" | "respirationRate") => {
    if (history.length === 0) return { average: 0, trend: "stable" as const, status: "normal" as const };

    const values = history.map(h => h[type]);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = Math.round(sum / values.length);

    // Simple trend logic: compare last to average
    const last = values[0]; // history is unshifted, so 0 is latest
    let trend: "up" | "down" | "stable" = "stable";
    if (last > average * 1.05) trend = "up";
    else if (last < average * 0.95) trend = "down";

    // Status logic (simplified)
    let status: "normal" | "borderline" | "abnormal" = "normal";
    // Simplified mappings
    if (type === "spo2" && average < 95) status = "borderline";
    if (type === "spo2" && average < 90) status = "abnormal";
    if (type === "heartRate" && (average > 100 || average < 50)) status = "abnormal";

    return { average, trend, status };
  };

  const hrMetrics = calculateMetrics("heartRate");
  const spo2Metrics = calculateMetrics("spo2");
  const respMetrics = calculateMetrics("respirationRate");

  const vitalSummaries = [
    { type: "heartRate" as const, average: hrMetrics.average, unit: "BPM", trend: hrMetrics.trend, status: hrMetrics.status },
    { type: "spo2" as const, average: spo2Metrics.average, unit: "%", trend: spo2Metrics.trend, status: spo2Metrics.status },
    { type: "respiratory" as const, average: respMetrics.average, unit: "br/m", trend: respMetrics.trend, status: respMetrics.status },
  ];

  const aiSummary = wellness
    ? `Analysis complete. Your stress level is ${wellness.stress.level} (${wellness.stress.label}). Energy potential is ${wellness.energy.level}. ${wellness.risks.length > 0 ? `Detected risks: ${wellness.risks.join(", ")}.` : "No immediate health risks detected."}`
    : "No scan data available yet. Perform your first scan to generate an AI health summary.";

  const wellnessRisks = history.map((h, i) => {
    // Re-run wellness on per-item basis for timeline? Or just simple heuristics for Timeline
    // Let's keep existing simpler heuristics for timeline for now, or map risks
    let level: "normal" | "monitor" | "critical" = "normal";
    if (h.spo2 < 90 || h.heartRate > 110) level = "critical";
    else if (h.spo2 < 95 || h.heartRate > 100) level = "monitor";

    return {
      date: new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      level,
      tooltip: level === "normal" ? "Normal Scan" : `${level === "critical" ? "Critical" : "Elevated"} metrics detected`
    };
  }).slice(0, 10).reverse();


  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 pb-2">
          <h1 className="text-section-title text-foreground">Health Analytics</h1>
          <p className="text-caption text-muted-foreground mt-1">7-day overview</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-6">
          {/* Summary Cards - Horizontal Scroll */}
          <div className="px-4 mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {vitalSummaries.map((vital) => (
                <SummaryCard
                  key={vital.type}
                  type={vital.type}
                  average={vital.average}
                  unit={vital.unit}
                  trend={vital.trend}
                  status={vital.status}
                  onClick={() => navigate(`/analytics/vital/${vital.type}`)}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/analytics/report")}
                className="card-medical flex items-center gap-3 hover-lift btn-ripple"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-card-title text-foreground">Generate Report</p>
                  <p className="text-caption text-muted-foreground">Doctor-ready</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/analytics/alerts")}
                className="card-medical flex items-center gap-3 hover-lift btn-ripple"
              >
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-warning" />
                </div>
                <div className="text-left">
                  <p className="text-card-title text-foreground">Alert History</p>
                  <p className="text-caption text-muted-foreground">3 this week</p>
                </div>
              </button>
            </div>
          </div>

          {/* AI Health Summary */}
          <div className="px-4 mb-6">
            <AIHealthSummary
              summary={aiSummary}
              confidence={94}
              lastUpdated="2 hours ago"
              onRefresh={() => console.log("Refresh AI summary")}
            />
          </div>

          {/* Risk Timeline */}
          <div className="px-4 mb-6">
            <RiskTimeline events={wellnessRisks} />
          </div>

          {/* Data Quality */}
          <div className="px-4 mb-6">
            <DataQualityPanel
              signalQuality={87}
              lightingConsistency={92}
              motionInterference={15}
            />
          </div>

          {/* View Detailed Analytics */}
          <div className="px-4 mb-4">
            <button
              onClick={() => navigate("/analytics/vital/heartRate")}
              className="w-full card-medical flex items-center justify-between hover-lift btn-ripple"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-card-title text-foreground">Detailed Vital Analytics</p>
                  <p className="text-caption text-muted-foreground">Trends, variability & correlations</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Caregiver View Link */}
          <div className="px-4">
            <button
              onClick={() => navigate("/analytics/caregiver")}
              className="w-full card-medical flex items-center justify-between hover-lift btn-ripple border-2 border-dashed border-border"
            >
              <div className="text-left">
                <p className="text-card-title text-foreground">Caregiver / Elderly View</p>
                <p className="text-caption text-muted-foreground">Simplified analytics with large fonts</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Compliance Footer */}
        <ComplianceFooter compact />
      </div>

      <BottomNav />
    </div>
  );
};

export default AnalyticsScreen;
