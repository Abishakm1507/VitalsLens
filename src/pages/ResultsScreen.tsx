import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import VitalCard from "@/components/VitalCard";
import Button from "@/components/Button";
import RiskBanner from "@/components/RiskBanner";
import NextStepsCard from "@/components/NextStepsCard";
import ConfidenceIndicator from "@/components/ConfidenceIndicator";
import ShareModal from "@/components/ShareModal";
import EmergencyBanner from "@/components/EmergencyBanner";
import { ArrowLeft, CheckCircle, Save, History, Share2 } from "lucide-react";

const ResultsScreen = () => {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  
  type VitalStatus = "normal" | "warning" | "critical";
  
  // Simulated vitals - in production this would come from the scan
  const vitals: Array<{
    type: "heartRate" | "spo2" | "respiratory";
    value: number;
    unit: string;
    status: VitalStatus;
    confidence: number;
    description: string;
  }> = [
    { 
      type: "heartRate", 
      value: 74, 
      unit: "BPM", 
      status: "normal",
      confidence: 96,
      description: "Your heart rate is within the healthy resting range of 60-100 BPM."
    },
    { 
      type: "spo2", 
      value: 97, 
      unit: "%", 
      status: "normal",
      confidence: 94,
      description: "Excellent oxygen saturation. Normal range is 95-100%."
    },
    { 
      type: "respiratory", 
      value: 15, 
      unit: "breaths/min", 
      status: "normal",
      confidence: 91,
      description: "Healthy breathing rate. Normal range is 12-20 breaths per minute."
    },
  ];
  
  // Calculate overall risk level based on vitals
  const getRiskLevel = () => {
    const hasWarning = vitals.some(v => v.status === "warning");
    const hasCritical = vitals.some(v => v.status === "critical");
    if (hasCritical) return "high";
    if (hasWarning) return "moderate";
    return "low";
  };
  
  const riskLevel = getRiskLevel();
  
  const reading = {
    heartRate: 74,
    spo2: 97,
    respiratory: 15,
    riskLevel: riskLevel as "low" | "moderate" | "high",
    timestamp: new Date(),
  };
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card btn-ripple"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="text-card-title text-foreground">Scan Results</span>
          <button 
            onClick={() => setShowShareModal(true)}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card btn-ripple"
          >
            <Share2 className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Risk Banner - NEW */}
        <div className="px-4 mb-4">
          <RiskBanner 
            level={riskLevel}
            explanation="Based on WHO reference ranges and your recent trends"
          />
        </div>
        
        {/* Vital results with confidence indicators */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
          {vitals.map((vital, index) => (
            <div 
              key={vital.type} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <VitalCard 
                type={vital.type}
                value={vital.value}
                unit={vital.unit}
                status={vital.status}
              />
              {/* Confidence Indicator - NEW */}
              <div className="mt-2 px-1">
                <ConfidenceIndicator confidence={vital.confidence} size="sm" />
              </div>
              <p className="text-caption text-muted-foreground mt-1 px-1 leading-relaxed">
                {vital.description}
              </p>
            </div>
          ))}
          
          {/* Time stamp */}
          <p className="text-center text-caption text-muted-foreground pt-2">
            Measured at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Today
          </p>
          
          {/* What Should I Do Next? - NEW */}
          <NextStepsCard 
            riskLevel={riskLevel}
            onSave={() => navigate("/dashboard")}
            onShare={() => setShowShareModal(true)}
            onRescan={() => navigate("/pre-scan")}
          />
        </div>
        
        {/* Action buttons */}
        <div className="p-4 pb-8 space-y-3">
          <Button onClick={() => navigate("/dashboard")} fullWidth className="btn-ripple">
            <Save className="w-5 h-5 mr-2" />
            Save Reading
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/history")} 
            fullWidth
            className="btn-ripple"
          >
            <History className="w-5 h-5 mr-2" />
            View History
          </Button>
        </div>
      </div>
      
      {/* Share Modal - NEW */}
      {showShareModal && (
        <ShareModal 
          reading={reading}
          onClose={() => setShowShareModal(false)}
          onShareWhatsApp={() => {
            // Would open WhatsApp share
            setShowShareModal(false);
          }}
          onExportPDF={() => {
            // Would generate PDF
            setShowShareModal(false);
          }}
          onSendTelemedicine={() => {
            // Would send to telemedicine
            setShowShareModal(false);
          }}
        />
      )}
      
      {/* Emergency Banner - NEW (demo: triggered on critical readings) */}
      {showEmergency && (
        <EmergencyBanner 
          onCallEmergency={() => {
            // Would open dialer
            setShowEmergency(false);
          }}
          onLocateClinic={() => {
            // Would open maps
            setShowEmergency(false);
          }}
          onRescan={() => {
            navigate("/pre-scan");
            setShowEmergency(false);
          }}
          onDismiss={() => setShowEmergency(false)}
        />
      )}
    </MobileFrame>
  );
};

export default ResultsScreen;
