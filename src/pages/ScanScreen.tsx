import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import Button from "@/components/Button";
import SignalQualityChip from "@/components/SignalQualityChip";
import { ArrowLeft, Sun, User } from "lucide-react";

type SignalQuality = "excellent" | "good" | "fair" | "poor";

const ScanScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [signalQuality, setSignalQuality] = useState<SignalQuality>("good");
  
  // Simulate signal quality changes during scan
  useEffect(() => {
    if (!isScanning) return;
    
    const qualityInterval = setInterval(() => {
      const qualities: SignalQuality[] = ["excellent", "good", "good", "fair"];
      const random = qualities[Math.floor(Math.random() * qualities.length)];
      setSignalQuality(random);
    }, 2000);
    
    return () => clearInterval(qualityInterval);
  }, [isScanning]);
  
  // Progress during scan
  useEffect(() => {
    if (!isScanning) return;
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          navigate("/analyzing");
          return 100;
        }
        return prev + (100 / 30); // 30 seconds
      });
    }, 1000);
    
    return () => clearInterval(progressInterval);
  }, [isScanning, navigate]);
  
  const handleStartScan = () => {
    setIsScanning(true);
    setProgress(0);
  };
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col bg-foreground/95 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm btn-ripple"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-white text-card-title">Face Scan</span>
          <div className="w-10" />
        </div>
        
        {/* Signal Quality Chip - NEW */}
        {isScanning && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 animate-fade-in">
            <SignalQualityChip quality={signalQuality} />
          </div>
        )}
        
        {/* Camera view simulation */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          
          {/* Face oval with progress ring */}
          <div className="relative">
            {/* Progress ring - NEW */}
            {isScanning && (
              <svg 
                className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90"
                viewBox="0 0 100 130"
              >
                <ellipse
                  cx="50"
                  cy="65"
                  rx="45"
                  ry="58"
                  fill="none"
                  stroke="hsl(var(--primary) / 0.2)"
                  strokeWidth="3"
                />
                <ellipse
                  cx="50"
                  cy="65"
                  rx="45"
                  ry="58"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeDasharray={`${progress * 3.5} 350`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
            )}
            
            <div className={`w-56 h-72 rounded-[50%] border-4 ${isScanning ? 'border-primary' : 'border-white/50'} face-oval flex items-center justify-center transition-colors duration-300`}>
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
          {/* Progress indicator during scan */}
          {isScanning && (
            <div className="space-y-2 animate-fade-in">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-white/80 text-caption">
                {Math.round(30 - (progress * 0.3))}s remaining • Stay still
              </p>
            </div>
          )}
          
          {/* Tips */}
          {!isScanning && (
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
          )}
          
          {/* Instruction text */}
          {!isScanning && (
            <p className="text-center text-white/80 text-body">
              Position your face within the oval and keep still during the scan
            </p>
          )}
          
          {/* Start button */}
          {!isScanning && (
            <Button onClick={handleStartScan} fullWidth className="btn-ripple">
              Start 30-Second Scan
            </Button>
          )}
        </div>
      </div>
    </MobileFrame>
  );
};

export default ScanScreen;
