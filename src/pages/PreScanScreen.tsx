import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import Button from "@/components/Button";
import ReadinessCheck from "@/components/ReadinessCheck";
import { ArrowLeft, Scan, Sun, User, Hand } from "lucide-react";
import { LucideIcon } from "lucide-react";

type CheckStatus = "ready" | "warning" | "pending";

interface CheckItem {
  id: string;
  label: string;
  status: CheckStatus;
  icon: LucideIcon;
}

const PreScanScreen = () => {
  const navigate = useNavigate();
  const [checks, setChecks] = useState<CheckItem[]>([
    { id: "lighting", label: "Good lighting detected", status: "pending", icon: Sun },
    { id: "face", label: "Face fully visible", status: "pending", icon: User },
    { id: "movement", label: "Minimal movement", status: "pending", icon: Hand },
  ]);
  
  // Simulate readiness check progression
  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setChecks(prev => prev.map(c => 
          c.id === "lighting" ? { ...c, status: "ready" as CheckStatus } : c
        ));
      }, 800),
      setTimeout(() => {
        setChecks(prev => prev.map(c => 
          c.id === "face" ? { ...c, status: "ready" as CheckStatus } : c
        ));
      }, 1600),
      setTimeout(() => {
        setChecks(prev => prev.map(c => 
          c.id === "movement" ? { ...c, status: "warning" as CheckStatus } : c
        ));
      }, 2400),
      setTimeout(() => {
        setChecks(prev => prev.map(c => 
          c.id === "movement" ? { ...c, status: "ready" as CheckStatus } : c
        ));
      }, 3500),
    ];
    
    return () => timers.forEach(t => clearTimeout(t));
  }, []);
  
  const allReady = checks.every(c => c.status === "ready");
  const tips = ["Sit still", "Remove glasses if possible", "Face natural light"];
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">Pre-Scan Check</h1>
        </div>
        
        {/* Content */}
        <div className="flex-1 px-4 pb-8 flex flex-col">
          {/* Camera preview placeholder */}
          <div className="relative aspect-[4/3] bg-foreground/95 rounded-2xl mb-6 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-52 rounded-[50%] border-2 border-white/30 border-dashed flex items-center justify-center">
                <User className="w-16 h-16 text-white/30" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                <p className="text-caption text-white/80">
                  Position your face in the center
                </p>
              </div>
            </div>
          </div>
          
          {/* Readiness checklist */}
          <div className="flex-1">
            <h2 className="text-card-title text-foreground mb-4">Environment Check</h2>
            <ReadinessCheck checks={checks} tips={tips} />
          </div>
          
          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              onClick={() => navigate("/scan")} 
              fullWidth
              disabled={!allReady}
              className={!allReady ? "opacity-50" : ""}
            >
              <Scan className="w-5 h-5 mr-2" />
              Begin AI Scan
            </Button>
            {!allReady && (
              <p className="text-caption text-muted-foreground text-center mt-2">
                Waiting for optimal conditions...
              </p>
            )}
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default PreScanScreen;
