import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import BottomNav from "@/components/BottomNav";
import AlertCard from "@/components/AlertCard";
import { ArrowLeft, BellOff } from "lucide-react";

const AlertsScreen = () => {
  const navigate = useNavigate();
  
  const alerts = [
    {
      severity: "warning" as const,
      title: "Elevated Heart Rate",
      message: "Your heart rate was 95 BPM during your last scan. This may be due to physical activity or stress. Consider resting and scanning again.",
      time: "2h ago",
    },
    {
      severity: "info" as const,
      title: "Weekly Summary Ready",
      message: "Your weekly health summary is available. All vitals remained within normal ranges this week.",
      time: "1d ago",
    },
    {
      severity: "critical" as const,
      title: "Low SpO₂ Detected",
      message: "Blood oxygen dropped to 94% briefly. If symptoms persist, consider consulting a healthcare provider.",
      time: "3d ago",
    },
  ];
  
  return (
    <MobileFrame showNav>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">Alerts</h1>
          <button className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card">
            <BellOff className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <p className="text-body text-muted-foreground mb-6">
            Health notifications and important updates about your vitals.
          </p>
          
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AlertCard {...alert} />
              </div>
            ))}
          </div>
          
          {/* Disclaimer */}
          <div className="mt-8 p-4 rounded-xl bg-muted/50">
            <p className="text-caption text-muted-foreground text-center leading-relaxed">
              These alerts are for informational purposes only and do not constitute medical advice. 
              Consult a healthcare professional for medical concerns.
            </p>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </MobileFrame>
  );
};

export default AlertsScreen;
