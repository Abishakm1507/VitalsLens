import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import Button from "@/components/Button";
import { ArrowLeft, User, Heart, Stethoscope, Users, Activity, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type AgeGroup = "18-30" | "31-45" | "46-60" | "60+";
type Purpose = "wellness" | "elderly" | "teleconsult";

interface Condition {
  id: string;
  label: string;
  icon: typeof Heart;
}

const ageGroups: { value: AgeGroup; label: string }[] = [
  { value: "18-30", label: "18-30" },
  { value: "31-45", label: "31-45" },
  { value: "46-60", label: "46-60" },
  { value: "60+", label: "60+" },
];

const purposes: { value: Purpose; label: string; description: string; icon: typeof Activity }[] = [
  { value: "wellness", label: "Daily Wellness", description: "Track your health regularly", icon: Activity },
  { value: "elderly", label: "Elderly Care", description: "Monitor loved ones", icon: Users },
  { value: "teleconsult", label: "Teleconsultation", description: "Share with your doctor", icon: Stethoscope },
];

const conditions: Condition[] = [
  { id: "hypertension", label: "Hypertension", icon: Heart },
  { id: "diabetes", label: "Diabetes", icon: Activity },
  { id: "respiratory", label: "Respiratory condition", icon: Activity },
  { id: "heart", label: "Heart condition", icon: Heart },
];

const UserContextScreen = () => {
  const navigate = useNavigate();
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [purpose, setPurpose] = useState<Purpose | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  
  const toggleCondition = (id: string) => {
    setSelectedConditions(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };
  
  const canContinue = ageGroup && purpose;
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4">
          <button 
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">Personalize</h1>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
          {/* Age group */}
          <div className="space-y-3">
            <h2 className="text-card-title text-foreground">Age Group</h2>
            <div className="flex flex-wrap gap-2">
              {ageGroups.map((age) => (
                <button
                  key={age.value}
                  onClick={() => setAgeGroup(age.value)}
                  className={cn(
                    "px-4 py-2 rounded-xl border-2 transition-all duration-200 text-body font-medium",
                    ageGroup === age.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  )}
                >
                  {age.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Measurement purpose */}
          <div className="space-y-3">
            <h2 className="text-card-title text-foreground">Measurement Purpose</h2>
            <div className="space-y-2">
              {purposes.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.value}
                    onClick={() => setPurpose(p.value)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                      purpose === p.value
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      purpose === p.value ? "bg-primary/20" : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5",
                        purpose === p.value ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={cn(
                        "text-card-title",
                        purpose === p.value ? "text-primary" : "text-foreground"
                      )}>
                        {p.label}
                      </p>
                      <p className="text-caption text-muted-foreground">{p.description}</p>
                    </div>
                    {purpose === p.value && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Known conditions (optional) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-card-title text-foreground">Known Conditions</h2>
              <span className="text-caption text-muted-foreground">Optional</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {conditions.map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => toggleCondition(condition.id)}
                  className={cn(
                    "px-3 py-2 rounded-xl border transition-all duration-200 text-body flex items-center gap-2",
                    selectedConditions.includes(condition.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {selectedConditions.includes(condition.id) && (
                    <Check className="w-4 h-4" />
                  )}
                  {condition.label}
                </button>
              ))}
            </div>
            <p className="text-caption text-muted-foreground">
              This helps personalize your health insights
            </p>
          </div>
        </div>
        
        {/* CTA */}
        <div className="p-4 pb-8">
          <Button 
            onClick={() => navigate("/profile")} 
            fullWidth
            disabled={!canContinue}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </MobileFrame>
  );
};

export default UserContextScreen;
