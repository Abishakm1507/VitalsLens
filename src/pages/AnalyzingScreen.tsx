import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import { Activity, Heart, Droplets, Wind } from "lucide-react";

const AnalyzingScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Heart, label: "Detecting heart rate...", color: "text-heartRate" },
    { icon: Droplets, label: "Measuring blood oxygen...", color: "text-spo2" },
    { icon: Wind, label: "Analyzing breathing...", color: "text-respiratory" },
    { icon: Activity, label: "Generating results...", color: "text-primary" },
  ];
  
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 800);
    
    const timeout = setTimeout(() => {
      navigate("/results");
    }, 3500);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, [navigate]);
  
  const CurrentIcon = steps[currentStep].icon;
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col items-center justify-center px-8">
        {/* Animated icon */}
        <div className="relative mb-12">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
            <CurrentIcon className={`w-16 h-16 ${steps[currentStep].color} transition-all duration-300`} />
          </div>
          
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 pulse-ring" />
          <div className="absolute inset-[-8px] rounded-full border-2 border-primary/10 pulse-ring" style={{ animationDelay: '0.5s' }} />
          <div className="absolute inset-[-16px] rounded-full border-2 border-primary/5 pulse-ring" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Status text */}
        <h2 className="text-section-title text-foreground text-center mb-2">
          Analyzing Your Vitals
        </h2>
        <p className={`text-body ${steps[currentStep].color} text-center mb-8 h-5 transition-all duration-300`}>
          {steps[currentStep].label}
        </p>
        
        {/* Progress bar */}
        <div className="w-full max-w-[240px]">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-caption text-muted-foreground text-center mt-3">
            {Math.round(progress)}% complete
          </p>
        </div>
        
        {/* Analyzing dots */}
        <div className="flex gap-2 mt-12">
          <div className="w-3 h-3 rounded-full bg-primary analyzing-dot" />
          <div className="w-3 h-3 rounded-full bg-primary analyzing-dot" />
          <div className="w-3 h-3 rounded-full bg-primary analyzing-dot" />
        </div>
      </div>
    </MobileFrame>
  );
};

export default AnalyzingScreen;
