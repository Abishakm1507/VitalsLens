import { AlertOctagon, Phone, MapPin, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";

interface EmergencyBannerProps {
  onCallEmergency?: () => void;
  onLocateClinic?: () => void;
  onRescan?: () => void;
  onDismiss?: () => void;
}

const EmergencyBanner = ({ 
  onCallEmergency, 
  onLocateClinic, 
  onRescan,
  onDismiss 
}: EmergencyBannerProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[390px] bg-card rounded-t-3xl p-6 space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0 emergency-pulse">
            <AlertOctagon className="w-7 h-7 text-destructive" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-caption font-bold bg-destructive text-destructive-foreground">
                CRITICAL
              </span>
            </div>
            <h2 className="text-section-title text-foreground">Critical Reading Detected</h2>
          </div>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
        
        {/* Message */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
          <p className="text-body text-foreground leading-relaxed">
            This reading may require immediate attention. Please remain calm and consider the options below.
          </p>
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={onCallEmergency}
            fullWidth
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Emergency Contact
          </Button>
          
          <Button 
            variant="outline"
            onClick={onLocateClinic}
            fullWidth
            className="border-destructive/30 text-destructive hover:bg-destructive/5"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Locate Nearest Clinic
          </Button>
          
          <Button 
            variant="ghost"
            onClick={onRescan}
            fullWidth
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Re-scan to Confirm
          </Button>
        </div>
        
        {/* Disclaimer */}
        <p className="text-caption text-muted-foreground text-center leading-relaxed px-4">
          ⚠️ VitalsLens does not replace professional diagnosis. 
          When in doubt, always seek medical attention.
        </p>
      </div>
    </div>
  );
};

export default EmergencyBanner;
