import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import Button from "@/components/Button";
import { ArrowLeft, Sun, User } from "lucide-react";

const ScanScreen = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  
  const handleStartScan = () => {
    navigate("/analyzing");
  };
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col bg-foreground/95 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-white text-card-title">Face Scan</span>
          <div className="w-10" />
        </div>
        
        {/* Camera view simulation */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          
          {/* Face oval */}
          <div className="relative">
            <div className="w-56 h-72 rounded-[50%] border-4 border-white/50 face-oval flex items-center justify-center">
              <User className="w-20 h-20 text-white/30" />
            </div>
            
            {/* Corner guides */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl" />
          </div>
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 space-y-6">
          {/* Tips */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <span className="text-caption text-white/70">Good lighting</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="text-caption text-white/70">Face the camera</span>
            </div>
          </div>
          
          {/* Instruction text */}
          <p className="text-center text-white/80 text-body">
            Position your face within the oval and keep still during the scan
          </p>
          
          {/* Start button */}
          <Button onClick={handleStartScan} fullWidth>
            Start 30-Second Scan
          </Button>
        </div>
      </div>
    </MobileFrame>
  );
};

export default ScanScreen;
