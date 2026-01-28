import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import AlertHistoryCard from "@/components/analytics/AlertHistoryCard";
import ComplianceFooter from "@/components/analytics/ComplianceFooter";
import { ArrowLeft, Filter } from "lucide-react";
import { useState } from "react";

type AlertFilter = "all" | "critical" | "warning" | "info";

const AlertHistoryScreen = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<AlertFilter>("all");

  // Mock alert history
  const alerts = [
    {
      id: 1,
      type: "warning" as const,
      title: "Low SpO₂ Reading",
      reason: "SpO₂ dropped to 94%, below the normal range of 95-100%.",
      suggestion: "Rest for 5 minutes in a comfortable position and recheck.",
      timestamp: "Today, 2:30 PM",
    },
    {
      id: 2,
      type: "info" as const,
      title: "Elevated Heart Rate",
      reason: "Heart rate of 95 BPM detected, slightly above your baseline.",
      suggestion: "This may be normal after activity. Monitor if it persists at rest.",
      timestamp: "Yesterday, 8:15 PM",
    },
    {
      id: 3,
      type: "critical" as const,
      title: "Critical SpO₂ Alert",
      reason: "SpO₂ reading of 91% detected during evening scan.",
      suggestion: "If you feel shortness of breath or dizziness, seek medical attention.",
      timestamp: "Jan 22, 11:45 AM",
    },
    {
      id: 4,
      type: "warning" as const,
      title: "Irregular Respiratory Pattern",
      reason: "Respiratory rate of 22 breaths/min exceeds normal range.",
      suggestion: "Practice slow, deep breathing and rescan after 10 minutes.",
      timestamp: "Jan 21, 3:20 PM",
    },
    {
      id: 5,
      type: "info" as const,
      title: "High Variability Detected",
      reason: "Heart rate variability increased significantly over 24 hours.",
      suggestion: "High variability may indicate stress. Consider relaxation techniques.",
      timestamp: "Jan 20, 9:00 AM",
    },
  ];

  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter(a => a.type === filter);

  const filterCounts = {
    all: alerts.length,
    critical: alerts.filter(a => a.type === "critical").length,
    warning: alerts.filter(a => a.type === "warning").length,
    info: alerts.filter(a => a.type === "info").length,
  };

  return (
    <MobileFrame>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <button 
            onClick={() => navigate("/analytics")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card btn-ripple"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-section-title text-foreground">Alert History</h1>
            <p className="text-caption text-muted-foreground">{alerts.length} alerts this month</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {([
              { value: "all" as const, label: "All" },
              { value: "critical" as const, label: "Critical" },
              { value: "warning" as const, label: "Warning" },
              { value: "info" as const, label: "Info" },
            ]).map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-caption font-medium transition-all whitespace-nowrap btn-ripple ${
                  filter === f.value
                    ? f.value === "critical" ? "bg-destructive text-destructive-foreground" :
                      f.value === "warning" ? "bg-warning text-warning-foreground" :
                      f.value === "info" ? "bg-primary text-primary-foreground" :
                      "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  filter === f.value ? "bg-white/20" : "bg-foreground/10"
                }`}>
                  {filterCounts[f.value]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Filter className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-card-title text-foreground">No alerts found</p>
              <p className="text-caption text-muted-foreground">
                No {filter} alerts in your history
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertHistoryCard
                key={alert.id}
                type={alert.type}
                title={alert.title}
                reason={alert.reason}
                suggestion={alert.suggestion}
                timestamp={alert.timestamp}
              />
            ))
          )}
        </div>

        {/* Compliance Footer */}
        <ComplianceFooter compact />
      </div>
    </MobileFrame>
  );
};

export default AlertHistoryScreen;
