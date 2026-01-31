import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Save, History, Calendar, Clock } from "lucide-react";
import { useVitalsStore } from "@/lib/vitalsStore";
import { useScanFlowStore } from "@/lib/scanFlowStore";

// UI Components
import VitalCard from "@/components/VitalCard";
import Button from "@/components/Button";
import RiskBanner from "@/components/RiskBanner";
import NextStepsCard from "@/components/NextStepsCard";
import ConfidenceIndicator from "@/components/ConfidenceIndicator";
import SignalQualityChip from "@/components/SignalQualityChip";
import ShareModal from "@/components/ShareModal";

const ResultsScreen = () => {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);

  // Read from Zustand store
  const { heartRate, spo2, respirationRate, signalQuality } = useVitalsStore();
  const resetScan = useScanFlowStore((state) => state.resetScan);

  const mappedQuality = signalQuality.toLowerCase() as "poor" | "fair" | "good";

  // Map signal quality to confidence score for the indicator
  const confidenceScore = signalQuality === "Good" ? 98 : signalQuality === "Fair" ? 75 : 45;

  const getStatus = (type: "heartRate" | "spo2" | "respiratory", value?: number): "normal" | "warning" | "critical" => {
    if (value === undefined) return "normal";

    switch (type) {
      case "heartRate":
        return (value >= 60 && value <= 100) ? "normal" : "warning";
      case "spo2":
        if (value >= 95) return "normal";
        if (value >= 90) return "warning";
        return "critical";
      case "respiratory":
        return (value >= 12 && value <= 20) ? "normal" : "warning";
      default:
        return "normal";
    }
  };

  const hrStatus = getStatus("heartRate", heartRate);
  const spo2Status = getStatus("spo2", spo2);
  const respStatus = getStatus("respiratory", respirationRate);

  const getOverallRiskLevel = (): "low" | "moderate" | "high" => {
    const statuses = [hrStatus, spo2Status, respStatus];
    if (statuses.includes("critical")) return "high";
    if (statuses.includes("warning")) return "moderate";
    return "low";
  };

  const riskLevel = getOverallRiskLevel();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-lg min-h-screen flex flex-col bg-background px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Scan Results</h1>
          <button
            onClick={() => setShowShareModal(true)}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm hover:bg-accent transition-colors"
          >
            <Share2 className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-6 overflow-y-auto pb-4">
          {/* Signal Assessment */}
          <div className="flex items-center justify-between bg-muted/30 rounded-2xl p-4 border border-border/50">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Signal Quality</span>
              <SignalQualityChip quality={mappedQuality} />
            </div>
            <div className="text-right space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">AI Confidence</span>
              <ConfidenceIndicator confidence={confidenceScore} showTooltip={false} size="sm" />
            </div>
          </div>

          {/* Risk Summary */}
          <RiskBanner />

          {/* Vital Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            <VitalCard
              type="heartRate"
              value={heartRate ?? "—"}
              unit="BPM"
              status={hrStatus}
            />
            <VitalCard
              type="spo2"
              value={spo2 ?? "—"}
              unit="%"
              status={spo2Status}
            />
            <VitalCard
              type="respiratory"
              value={respirationRate ?? "—"}
              unit="RPM"
              status={respStatus}
            />
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground py-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Next Steps Guidance */}
          <NextStepsCard
            riskLevel={riskLevel}
            onSave={() => { resetScan(); navigate("/dashboard"); }}
            onShare={() => setShowShareModal(true)}
            onRescan={() => resetScan()}
          />
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 space-y-3 pb-4">
          <Button
            onClick={() => { resetScan(); navigate("/dashboard"); }}
            fullWidth
            className="shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            Save to Health Log
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/history")}
            fullWidth
          >
            <History className="w-4 h-4 mr-2" />
            View History
          </Button>
        </div>
      </div>

      {/* Share Modal Overlay */}
      {showShareModal && (
        <ShareModal
          reading={{
            heartRate: heartRate || 0,
            spo2: spo2 || 0,
            respiratory: respirationRate || 0,
            riskLevel: riskLevel,
            timestamp: new Date(),
          }}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default ResultsScreen;
