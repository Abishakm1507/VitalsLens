import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import DemoModeBanner from "@/components/DemoModeBanner";
import {
  User, Settings, Shield, Bell, HelpCircle, Info,
  ChevronRight, LogOut, Moon, Play, Sliders
} from "lucide-react";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState("");

  const startDemoMode = () => {
    setDemoMode(true);
    setDemoStep("Starting demo...");

    // Simulate demo flow
    const steps = [
      { step: "Pre-scan check", delay: 1000 },
      { step: "Scanning vitals", delay: 3000 },
      { step: "AI Analysis", delay: 5000 },
      { step: "Results ready", delay: 7000 },
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => setDemoStep(step), delay);
    });

    setTimeout(() => {
      navigate("/pre-scan");
    }, 1500);
  };

  const menuItems = [
    { icon: Sliders, label: "Personalization", description: "Age, purpose, conditions", onClick: () => navigate("/user-context") },
    { icon: Bell, label: "Notifications", description: "Manage alert preferences" },
    { icon: Settings, label: "Settings", description: "Connectivity & preferences", onClick: () => navigate("/settings") },
    { icon: Shield, label: "Privacy & Security", description: "Data and permissions" },
    { icon: HelpCircle, label: "Help & Support", description: "FAQs and contact us" },
    { icon: Info, label: "About VitalsLens", description: "Version and trust info", onClick: () => navigate("/about") },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col">
        {/* Demo Mode Banner - NEW */}
        <DemoModeBanner
          isActive={demoMode}
          currentStep={demoStep}
          onStop={() => setDemoMode(false)}
        />

        <div className={`h-full flex flex-col ${demoMode ? 'pt-10' : ''}`}>
          {/* Header */}
          <div className="p-4">
            <h1 className="text-section-title text-foreground">Profile</h1>
          </div>

          {/* Profile card */}
          <div className="mx-4 p-4 card-medical mb-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-card-title text-foreground">Guest User</h3>
                <p className="text-caption text-muted-foreground">Tap to add profile details</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          {/* Stats */}
          <div className="mx-4 grid grid-cols-3 gap-3 mb-6">
            {[
              { value: "24", label: "Scans" },
              { value: "7", label: "Day streak" },
              { value: "98%", label: "Avg SpO₂" },
            ].map((stat, index) => (
              <div key={index} className="card-medical text-center hover-lift">
                <p className="text-section-title text-primary count-up">{stat.value}</p>
                <p className="text-caption text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Demo Mode Toggle - NEW */}
          <div className="mx-4 mb-4">
            <button
              onClick={startDemoMode}
              className="w-full flex items-center gap-4 p-4 bg-primary/5 border-2 border-primary/20 rounded-xl hover:bg-primary/10 transition-colors btn-ripple"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-card-title text-primary font-medium">Demo Mode</p>
                <p className="text-caption text-muted-foreground">Auto-play full user journey</p>
              </div>
              <span className="px-2 py-1 bg-primary/10 rounded-full text-[10px] font-semibold text-primary uppercase">
                For Judges
              </span>
            </button>
          </div>

          {/* Menu items */}
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-muted/50 transition-colors btn-ripple"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-card-title text-foreground">{item.label}</p>
                    <p className="text-caption text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>

            {/* Logout */}
            <button className="w-full flex items-center gap-4 p-4 mt-4 text-destructive hover:bg-destructive/5 rounded-xl transition-colors btn-ripple">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-card-title">Sign Out</span>
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default ProfileScreen;
