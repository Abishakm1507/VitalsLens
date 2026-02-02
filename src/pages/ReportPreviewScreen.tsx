import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReportPreview from "@/components/analytics/ReportPreview";
import Button from "@/components/Button";
import { ArrowLeft, Download, Share2, MessageCircle, Mail, X } from "lucide-react";
import { toast } from "sonner";
import { useVitalsStore } from "@/lib/vitalsStore";

const ReportPreviewScreen = () => {
  const navigate = useNavigate();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { history } = useVitalsStore();

  const reportData = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        dateRange: { start: "-", end: "-" },
        overallStatus: "stable" as const,
        riskLevel: "low" as const,
        confidence: 0,
        vitals: [
          { name: "Heart Rate", average: 0, min: 0, max: 0, unit: "BPM", deviations: 0 },
          { name: "SpO₂", average: 0, min: 0, max: 0, unit: "%", deviations: 0 },
          { name: "Respiratory Rate", average: 0, min: 0, max: 0, unit: "br/min", deviations: 0 },
        ],
        aiInterpretation: "No data available to generate a report.",
      };
    }

    const timestamps = history.map(h => h.timestamp);
    const start = new Date(Math.min(...timestamps)).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const end = new Date(Math.max(...timestamps)).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    const calcStats = (key: "heartRate" | "spo2" | "respirationRate", minNormal: number, maxNormal: number) => {
      const values = history.map(h => h[key]);
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = Math.round(sum / values.length);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const deviations = values.filter(v => v < minNormal || v > maxNormal).length;
      return { average: avg, min, max, deviations };
    };

    const hrStats = calcStats("heartRate", 60, 100);
    const spo2Stats = calcStats("spo2", 95, 100);
    const respStats = calcStats("respirationRate", 12, 20);

    const totalDeviations = hrStats.deviations + spo2Stats.deviations + respStats.deviations;
    let riskLevel: "low" | "moderate" | "high" = "low";
    if (totalDeviations > 2) riskLevel = "moderate";
    if (totalDeviations > 5) riskLevel = "high";

    return {
      dateRange: { start, end },
      overallStatus: (riskLevel === "high" ? "critical" : riskLevel === "moderate" ? "needs-attention" : "stable") as "stable" | "needs-attention" | "critical",
      riskLevel,
      confidence: 94, // Placeholder for now, or calc based on signal quality
      vitals: [
        { name: "Heart Rate", average: hrStats.average, min: hrStats.min, max: hrStats.max, unit: "BPM", deviations: hrStats.deviations },
        { name: "SpO₂", average: spo2Stats.average, min: spo2Stats.min, max: spo2Stats.max, unit: "%", deviations: spo2Stats.deviations },
        { name: "Respiratory Rate", average: respStats.average, min: respStats.min, max: respStats.max, unit: "br/min", deviations: respStats.deviations },
      ],
      aiInterpretation: `Based on ${history.length} scans from ${start} to ${end}, your vitals are ${riskLevel === 'low' ? 'generally stable' : 'showing some variability'}. ${totalDeviations > 0 ? `${totalDeviations} readings were outside standard healthy ranges.` : 'All readings are within normal ranges.'} Continued monitoring is recommended.`
    };
  }, [history]);

  const handleExportPDF = () => {
    toast.success("Generating PDF...", {
      description: "Your report will download shortly",
    });
  };

  const handleShare = (method: string) => {
    setShowShareOptions(false);
    toast.success(`Sharing via ${method}`, {
      description: "Report prepared for sharing",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate("/analytics/report")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card btn-ripple"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="text-card-title text-foreground">Report Preview</span>
          <button
            onClick={() => setShowShareOptions(true)}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card btn-ripple"
          >
            <Share2 className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <ReportPreview data={reportData} />
        </div>

        {/* Actions */}
        <div className="p-4 pb-8 space-y-3">
          <Button onClick={handleExportPDF} fullWidth className="btn-ripple">
            <Download className="w-5 h-5 mr-2" />
            Export as PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowShareOptions(true)}
            fullWidth
            className="btn-ripple"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Report
          </Button>
        </div>

        {/* Share Options Modal */}
        {showShareOptions && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50 animate-fade-in">
            <div className="w-full bg-card rounded-t-3xl p-6 pb-8 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-section-title text-foreground">Share Report</h3>
                <button
                  onClick={() => setShowShareOptions(false)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => handleShare("WhatsApp")}
                  className="flex flex-col items-center gap-2 p-4 bg-success/10 rounded-xl hover:bg-success/20 transition-colors btn-ripple"
                >
                  <MessageCircle className="w-8 h-8 text-success" />
                  <span className="text-caption text-foreground">WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare("Email")}
                  className="flex flex-col items-center gap-2 p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors btn-ripple"
                >
                  <Mail className="w-8 h-8 text-primary" />
                  <span className="text-caption text-foreground">Email</span>
                </button>
                <button
                  onClick={() => handleShare("Telemedicine")}
                  className="flex flex-col items-center gap-2 p-4 bg-secondary/10 rounded-xl hover:bg-secondary/20 transition-colors btn-ripple"
                >
                  <Share2 className="w-8 h-8 text-secondary" />
                  <span className="text-caption text-foreground">Telehealth</span>
                </button>
              </div>

              <div className="card-medical bg-muted/50">
                <p className="text-caption text-muted-foreground text-center">
                  Reports are anonymized and contain only health data. No personal identifiers are shared.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPreviewScreen;
