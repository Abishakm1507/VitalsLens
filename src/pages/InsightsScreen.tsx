import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import BottomNav from "@/components/BottomNav";
import InsightCard from "@/components/InsightCard";
import { ArrowLeft, Droplets, Moon, Activity, Apple, Brain, Heart } from "lucide-react";

const InsightsScreen = () => {
  const navigate = useNavigate();
  
  const insights = [
    {
      icon: Droplets,
      title: "Stay Hydrated",
      description: "Drinking water helps maintain optimal blood oxygen levels. Aim for 8 glasses daily.",
      variant: "info" as const,
    },
    {
      icon: Moon,
      title: "Sleep Well",
      description: "Quality sleep helps regulate your heart rate. Try to get 7-9 hours each night.",
      variant: "success" as const,
    },
    {
      icon: Activity,
      title: "Stay Active",
      description: "Regular exercise strengthens your heart and improves respiratory health.",
      variant: "default" as const,
    },
    {
      icon: Apple,
      title: "Eat Heart-Healthy",
      description: "Foods rich in omega-3 and fiber support cardiovascular health.",
      variant: "success" as const,
    },
    {
      icon: Brain,
      title: "Manage Stress",
      description: "Practice deep breathing or meditation to help lower your resting heart rate.",
      variant: "warning" as const,
    },
    {
      icon: Heart,
      title: "Know Your Baseline",
      description: "Regular monitoring helps you understand your normal vital ranges.",
      variant: "info" as const,
    },
  ];
  
  return (
    <MobileFrame showNav>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">Health Insights</h1>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <p className="text-body text-muted-foreground mb-6">
            Simple tips to help you maintain healthy vitals. These are general wellness suggestions, not medical advice.
          </p>
          
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <InsightCard {...insight} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </MobileFrame>
  );
};

export default InsightsScreen;
