import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportPreview from "@/components/analytics/ReportPreview";
import Button from "@/components/Button";
import { ArrowLeft, Download, Share2, MessageCircle, Mail, X } from "lucide-react";
import { toast } from "sonner";

const ReportPreviewScreen = () => {
  const navigate = useNavigate();
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Mock report data
  const reportData = {
    dateRange: { start: "Jan 20, 2026", end: "Jan 27, 2026" },
    overallStatus: "stable" as const,
    riskLevel: "low" as const,
    confidence: 94,
    vitals: [
      { name: "Heart Rate", average: 72, min: 65, max: 85, unit: "BPM", deviations: 2 },
      { name: "SpO₂", average: 96, min: 94, max: 99, unit: "%", deviations: 3 },
      { name: "Respiratory Rate", average: 15, min: 12, max: 18, unit: "br/min", deviations: 1 },
    ],
    aiInterpretation: "Your vital signs have remained largely stable over the past week. Heart rate shows normal variability consistent with daily activities. Two instances of SpO₂ readings below the normal range were observed, possibly related to body position or temporary breathing patterns. Overall health indicators suggest no immediate concerns, but continued monitoring is recommended for optimal health awareness.",
  };

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
          <ReportPreview />
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
