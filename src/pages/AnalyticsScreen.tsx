import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import BottomNav from "@/components/BottomNav";
import SummaryCard from "@/components/analytics/SummaryCard";
import AIHealthSummary from "@/components/analytics/AIHealthSummary";
import RiskTimeline from "@/components/analytics/RiskTimeline";
import DataQualityPanel from "@/components/analytics/DataQualityPanel";
import ComplianceFooter from "@/components/analytics/ComplianceFooter";
import { BarChart3, FileText, Bell, ChevronRight } from "lucide-react";

const AnalyticsScreen = () => {
  const navigate = useNavigate();

  // Mock data
  const vitalSummaries = [
    { type: "heartRate" as const, average: 72, unit: "BPM", trend: "stable" as const, status: "normal" as const },
    { type: "spo2" as const, average: 96, unit: "%", trend: "down" as const, status: "borderline" as const },
    { type: "respiratory" as const, average: 15, unit: "br/m", trend: "stable" as const, status: "normal" as const },
  ];

  const riskEvents = [
    { date: "Jan 20", level: "normal" as const },
    { date: "Jan 21", level: "normal" as const },
    { date: "Jan 22", level: "monitor" as const, tooltip: "SpO₂ below normal range" },
    { date: "Jan 23", level: "normal" as const },
    { date: "Jan 24", level: "normal" as const },
    { date: "Jan 25", level: "monitor" as const, tooltip: "Elevated heart rate" },
    { date: "Jan 26", level: "normal" as const },
  ];

  const aiSummary = "Your heart rate has remained stable over the past week, averaging 72 BPM. A mild drop in oxygen levels was observed on two occasions, possibly due to fatigue or posture. No immediate concern detected, but continued monitoring is recommended.";

  return (
    <MobileFrame showNav>
      <div className="h-full flex flex-col">
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
            <RiskTimeline events={riskEvents} />
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
    </MobileFrame>
  );
};

export default AnalyticsScreen;
