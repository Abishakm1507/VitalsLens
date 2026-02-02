import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import VitalCard from "@/components/VitalCard";
import Button from "@/components/Button";
import TrustBadges from "@/components/TrustBadges";
import { Scan, TrendingUp, Bell, Shield } from "lucide-react";
import { useVitalsStore } from "@/lib/vitalsStore";

const DashboardScreen = () => {
  const navigate = useNavigate();
  const { history } = useVitalsStore();

  // Get latest scan
  const latestScan = history.length > 0 ? history[0] : null;

  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? "Good morning" : currentTime < 18 ? "Good afternoon" : "Good evening";

  // Format date helper
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return isToday ? `Today, ${timeStr}` : `${date.toLocaleDateString()} ${timeStr}`;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <p className="text-body text-muted-foreground">{greeting}</p>
            <h1 className="text-section-title text-foreground">Your Health</h1>
          </div>
          <button
            onClick={() => navigate("/alerts")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card relative btn-ripple"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-[10px] text-destructive-foreground font-bold">2</span>
            </span>
          </button>
        </div>

        {/* Last scan info */}
        <div className="card-medical animate-slide-up hover-lift" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-muted-foreground">Last scan</p>
              <p className="text-card-title text-foreground">
                {latestScan ? formatDate(latestScan.timestamp) : "No scans yet"}
              </p>
            </div>
            <div className="flex items-center gap-1 text-success">
              <TrendingUp className="w-4 h-4" />
              <span className="text-caption font-medium">
                {latestScan ? "All Normal" : "Start a scan"}
                {/* Logic for assessment can be improved later */}
              </span>
            </div>
          </div>
        </div>

        {/* Vital cards grid */}
        <div className="space-y-4">
          <h2 className="text-card-title text-foreground">Current Vitals</h2>
          {latestScan ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="hover-lift">
                  <VitalCard
                    type="heartRate"
                    value={latestScan.heartRate}
                    unit="BPM"
                    status="normal"
                    onClick={() => navigate("/history")}
                  />
                </div>
                <div className="hover-lift">
                  <VitalCard
                    type="spo2"
                    value={latestScan.spo2}
                    unit="%"
                    status="normal"
                    onClick={() => navigate("/history")}
                  />
                </div>
              </div>
              <div className="hover-lift">
                <VitalCard
                  type="respiratory"
                  value={latestScan.respirationRate}
                  unit="breaths/min"
                  status="normal"
                  onClick={() => navigate("/history")}
                />
              </div>
            </>
          ) : (
            <div className="p-8 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No vital data available yet.</p>
              <Button variant="ghost" onClick={() => navigate("/scan")} className="mt-2 text-primary">Scan Now</Button>
            </div>
          )}
        </div>

        {/* Scan CTA - Updated to go to pre-scan */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button onClick={() => navigate("/scan")} fullWidth className="btn-ripple">
            <Scan className="w-5 h-5 mr-2" />
            Start New Scan
          </Button>
        </div>

        {/* Trust badges - compact version */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-caption text-muted-foreground">Your data is protected</span>
          </div>
          <TrustBadges compact />
        </div>

        {/* Quick insights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-card-title text-foreground">Health Tips</h2>
            <button
              onClick={() => navigate("/insights")}
              className="text-primary text-caption font-medium"
            >
              View All
            </button>
          </div>
          <div className="card-medical border border-success/20 bg-success/5 hover-lift">
            <p className="text-body text-foreground leading-relaxed">
              💪 Your resting heart rate is optimal. Keep up your healthy lifestyle!
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DashboardScreen;
