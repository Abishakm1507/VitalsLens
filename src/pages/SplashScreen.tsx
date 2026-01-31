import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2000);
    const timer2 = setTimeout(() => navigate("/onboarding"), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col items-center justify-center">
        <div className={`flex flex-col items-center gap-6 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          {/* Logo */}
          <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-button">
            <Activity className="w-12 h-12 text-primary-foreground" strokeWidth={2.5} />
          </div>

          {/* App name */}
          <div className="text-center">
            <h1 className="text-app-title text-foreground tracking-tight">VitalsLens</h1>
            <p className="text-body text-muted-foreground mt-2">Touchless Health Monitoring using AI</p>
          </div>

          {/* Loading indicator */}
          <div className="flex gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-primary analyzing-dot" />
            <div className="w-2 h-2 rounded-full bg-primary analyzing-dot" />
            <div className="w-2 h-2 rounded-full bg-primary analyzing-dot" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
