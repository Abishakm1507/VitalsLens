import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import VitalCard from "@/components/VitalCard";
import Button from "@/components/Button";
import { ArrowLeft, CheckCircle, Save, History, Share2 } from "lucide-react";

const ResultsScreen = () => {
  const navigate = useNavigate();
  
  const vitals = [
    { 
      type: "heartRate" as const, 
      value: 74, 
      unit: "BPM", 
      status: "normal" as const,
      description: "Your heart rate is within the healthy resting range of 60-100 BPM."
    },
    { 
      type: "spo2" as const, 
      value: 97, 
      unit: "%", 
      status: "normal" as const,
      description: "Excellent oxygen saturation. Normal range is 95-100%."
    },
    { 
      type: "respiratory" as const, 
      value: 15, 
      unit: "breaths/min", 
      status: "normal" as const,
      description: "Healthy breathing rate. Normal range is 12-20 breaths per minute."
    },
  ];
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="text-card-title text-foreground">Scan Results</span>
          <button className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card">
            <Share2 className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Overall status banner */}
        <div className="mx-4 p-4 rounded-2xl bg-success/10 border border-success/20 flex items-center gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <div>
            <h3 className="text-card-title text-foreground">All Vitals Normal</h3>
            <p className="text-caption text-muted-foreground">Your health looks great today!</p>
          </div>
        </div>
        
        {/* Vital results */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {vitals.map((vital, index) => (
            <div 
              key={vital.type} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <VitalCard 
                type={vital.type}
                value={vital.value}
                unit={vital.unit}
                status={vital.status}
              />
              <p className="text-caption text-muted-foreground mt-2 px-1 leading-relaxed">
                {vital.description}
              </p>
            </div>
          ))}
          
          {/* Time stamp */}
          <p className="text-center text-caption text-muted-foreground pt-4">
            Measured at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Today
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="p-4 pb-8 space-y-3">
          <Button onClick={() => navigate("/dashboard")} fullWidth>
            <Save className="w-5 h-5 mr-2" />
            Save Reading
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/history")} 
            fullWidth
          >
            <History className="w-5 h-5 mr-2" />
            View History
          </Button>
        </div>
      </div>
    </MobileFrame>
  );
};

export default ResultsScreen;
