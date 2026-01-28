import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import BottomNav from "@/components/BottomNav";
import VitalCard from "@/components/VitalCard";
import Button from "@/components/Button";
import TrustBadges from "@/components/TrustBadges";
import { Scan, TrendingUp, Bell, Shield } from "lucide-react";

const DashboardScreen = () => {
  const navigate = useNavigate();
  
  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? "Good morning" : currentTime < 18 ? "Good afternoon" : "Good evening";
  
  return (
    <MobileFrame showNav>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <p className="text-body text-muted-foreground">{greeting}</p>
            <h1 className="text-section-title text-foreground">Your Health</h1>
          </div>
          <button 
            onClick={() => navigate("/alerts")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card relative btn-ripple"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-[10px] text-destructive-foreground font-bold">2</span>
            </span>
          </button>
        </div>
        
        {/* Last scan info */}
        <div className="card-medical animate-slide-up hover-lift" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-muted-foreground">Last scan</p>
              <p className="text-card-title text-foreground">Today, 9:30 AM</p>
            </div>
            <div className="flex items-center gap-1 text-success">
              <TrendingUp className="w-4 h-4" />
              <span className="text-caption font-medium">All Normal</span>
            </div>
          </div>
        </div>
        
        {/* Vital cards grid */}
        <div className="space-y-4">
          <h2 className="text-card-title text-foreground">Current Vitals</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="hover-lift">
              <VitalCard 
                type="heartRate" 
                value={72} 
                unit="BPM" 
                status="normal"
                onClick={() => navigate("/history")}
              />
            </div>
            <div className="hover-lift">
              <VitalCard 
                type="spo2" 
                value={98} 
                unit="%" 
                status="normal"
                onClick={() => navigate("/history")}
              />
            </div>
          </div>
          <div className="hover-lift">
            <VitalCard 
              type="respiratory" 
              value={16} 
              unit="breaths/min" 
              status="normal"
              onClick={() => navigate("/history")}
            />
          </div>
        </div>
        
        {/* Scan CTA - Updated to go to pre-scan */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button onClick={() => navigate("/pre-scan")} fullWidth className="btn-ripple">
            <Scan className="w-5 h-5 mr-2" />
            Start New Scan
          </Button>
        </div>
        
        {/* Trust badges - compact version */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-caption text-muted-foreground">Your data is protected</span>
          </div>
          <TrustBadges compact />
        </div>
        
        {/* Quick insights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-card-title text-foreground">Health Tips</h2>
            <button 
              onClick={() => navigate("/insights")}
              className="text-primary text-caption font-medium"
            >
              View All
            </button>
          </div>
          <div className="card-medical border border-success/20 bg-success/5 hover-lift">
            <p className="text-body text-foreground leading-relaxed">
              💪 Your resting heart rate is optimal. Keep up your healthy lifestyle!
            </p>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </MobileFrame>
  );
};

export default DashboardScreen;
