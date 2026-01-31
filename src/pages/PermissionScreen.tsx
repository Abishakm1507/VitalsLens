import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { Camera, Shield, Lock } from "lucide-react";

const PermissionScreen = () => {
  const navigate = useNavigate();

  const handleAllowCamera = () => {
    // In a real app, this would request camera permissions
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col">
        {/* Status bar placeholder */}
        <div className="h-11" />

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Camera icon */}
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-8 animate-fade-in">
            <Camera className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h2 className="text-section-title text-foreground text-center mb-4">
            Camera Access Required
          </h2>

          {/* Description */}
          <p className="text-body text-muted-foreground text-center leading-relaxed max-w-[280px] mb-8">
            VitalsLens needs camera access to analyze your face and measure your vital signs using AI.
          </p>

          {/* Privacy features */}
          <div className="w-full space-y-3 mb-12">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-card-title text-foreground">Real-time Processing</p>
                <p className="text-caption text-muted-foreground">Video never stored or uploaded</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-card-title text-foreground">On-Device Only</p>
                <p className="text-caption text-muted-foreground">All analysis happens on your phone</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-8 pb-12">
          <Button onClick={handleAllowCamera} fullWidth>
            Allow Camera Access
          </Button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mt-4 py-3 text-muted-foreground text-body hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionScreen;
