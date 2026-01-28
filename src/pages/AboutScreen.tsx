import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import TrustBadges from "@/components/TrustBadges";
import { ArrowLeft, Activity, Shield, Lock, Camera, Heart, ExternalLink } from "lucide-react";

const AboutScreen = () => {
  const navigate = useNavigate();
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4">
          <button 
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card btn-ripple"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">About VitalsLens</h1>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {/* Logo */}
          <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-button mb-4">
              <Activity className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-section-title text-foreground">VitalsLens</h2>
            <p className="text-caption text-muted-foreground">Version 1.0.0</p>
          </div>
          
          {/* How it works */}
          <div className="card-medical mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-card-title text-foreground mb-2">How It Works</h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  VitalsLens uses advanced remote photoplethysmography (rPPG) technology. 
                  By analyzing subtle color changes in your face captured by your camera, 
                  our AI can estimate your vital signs non-invasively.
                </p>
              </div>
            </div>
          </div>
          
          {/* Trust & Compliance Section - EXPANDED */}
          <div className="mb-4">
            <h3 className="text-card-title text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              Trust & Privacy
            </h3>
            <TrustBadges />
          </div>
          
          {/* Disclaimer */}
          <div className="card-medical border border-warning/20 bg-warning/5 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="text-card-title text-foreground mb-2">Medical Disclaimer</h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  VitalsLens is designed for wellness and informational purposes only. 
                  It is not a medical device and should not be used for diagnosis or treatment. 
                  Always consult healthcare professionals for medical concerns.
                </p>
              </div>
            </div>
          </div>
          
          {/* Compliance note */}
          <div className="bg-muted/30 rounded-xl p-4 mb-4">
            <p className="text-caption text-muted-foreground text-center leading-relaxed">
              Aligned with telehealth privacy principles • GDPR-conscious design • No third-party data sharing
            </p>
          </div>
          
          {/* Footer */}
          <div className="text-center">
            <p className="text-caption text-muted-foreground">
              Made with ❤️ for accessible health monitoring
            </p>
            <p className="text-caption text-muted-foreground mt-1">
              © 2024 VitalsLens. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default AboutScreen;
