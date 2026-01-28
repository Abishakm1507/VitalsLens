import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoModeBannerProps {
  isActive: boolean;
  currentStep?: string;
  onStop?: () => void;
}

const DemoModeBanner = ({ isActive, currentStep, onStop }: DemoModeBannerProps) => {
  if (!isActive) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary/95 text-primary-foreground py-2 px-4 flex items-center justify-between demo-mode-pulse">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Play className="w-3 h-3 fill-current" />
        </div>
        <div>
          <span className="text-caption font-semibold">Demo Mode</span>
          {currentStep && (
            <span className="text-caption opacity-80 ml-2">– {currentStep}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] opacity-70 uppercase tracking-wide">Simulated Readings</span>
        {onStop && (
          <button 
            onClick={onStop}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DemoModeBanner;
