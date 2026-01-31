import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { Heart, Camera, Shield } from "lucide-react";

const slides = [
  {
    icon: Heart,
    title: "Monitor Your Vitals",
    description: "Track your heart rate, blood oxygen, and respiratory rate — all from your smartphone camera.",
    color: "text-heartRate",
    bg: "bg-heartRate/10",
  },
  {
    icon: Camera,
    title: "Just Look at the Camera",
    description: "Our AI uses advanced rPPG technology to measure your health signals touchlessly in seconds.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your health data never leaves your device. We prioritize your privacy above everything else.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
];

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/permission");
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col">
        {/* Skip button */}
        <div className="h-11 flex items-center justify-end px-6 pt-4">
          <button
            onClick={() => navigate("/permission")}
            className="text-muted-foreground text-body hover:text-foreground transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Illustration area */}
        <div className="h-[320px] flex items-center justify-center animate-fade-in" key={currentSlide}>
          <div className={`w-48 h-48 rounded-full ${slide.bg} flex items-center justify-center`}>
            <Icon className={`w-24 h-24 ${slide.color}`} strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-between px-8 pb-12">
          <div className="text-center animate-slide-up" key={`text-${currentSlide}`}>
            <h2 className="text-section-title text-foreground mb-4">{slide.title}</h2>
            <p className="text-body text-muted-foreground leading-relaxed max-w-[280px]">{slide.description}</p>
          </div>

          {/* Pagination */}
          <div className="flex gap-2 py-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted"
                  }`}
              />
            ))}
          </div>

          {/* CTA */}
          <Button onClick={handleNext} fullWidth>
            {currentSlide < slides.length - 1 ? "Next" : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
