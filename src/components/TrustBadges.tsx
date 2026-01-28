import { 
  Camera, Cpu, Shield, Lock, Wifi, Eye, 
  CheckCircle, Smartphone 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadge {
  icon: typeof Camera;
  title: string;
  description: string;
}

const badges: TrustBadge[] = [
  {
    icon: Camera,
    title: "No Face Images Stored",
    description: "Camera feed is processed in real-time and never saved"
  },
  {
    icon: Cpu,
    title: "On-Device Processing",
    description: "All AI analysis happens locally on your phone"
  },
  {
    icon: Lock,
    title: "Data Encrypted",
    description: "Health readings are encrypted with industry standards"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Aligned with telehealth privacy principles"
  },
  {
    icon: Wifi,
    title: "Offline Capable",
    description: "Works without internet connection"
  },
  {
    icon: Eye,
    title: "Transparent AI",
    description: "Confidence scores show measurement reliability"
  }
];

interface TrustBadgesProps {
  compact?: boolean;
}

const TrustBadges = ({ compact = false }: TrustBadgesProps) => {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.slice(0, 4).map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div 
              key={index}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-success/5 border border-success/20 rounded-full"
            >
              <Icon className="w-3.5 h-3.5 text-success" />
              <span className="text-[11px] font-medium text-success">{badge.title}</span>
            </div>
          );
        })}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 bg-success/5 border border-success/10 rounded-xl animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-card-title text-foreground">{badge.title}</h4>
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <p className="text-caption text-muted-foreground">{badge.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrustBadges;
