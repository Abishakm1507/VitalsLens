import { Shield, Lock, Smartphone, FileCheck } from "lucide-react";

interface ComplianceFooterProps {
  compact?: boolean;
}

const ComplianceFooter = ({ compact = false }: ComplianceFooterProps) => {
  const badges = [
    { icon: Shield, label: "No face images stored" },
    { icon: Smartphone, label: "On-device processing" },
    { icon: Lock, label: "Data encrypted" },
    { icon: FileCheck, label: "Telehealth aligned" },
  ];

  if (compact) {
    return (
      <div className="px-4 py-3 bg-muted/30 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          VitalsLens does not provide medical diagnosis. Insights are generated using AI models based on reference ranges and trends.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-muted/30 border-t border-border">
      {/* Badges */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {badges.map((badge) => (
          <div key={badge.label} className="flex items-center gap-2">
            <badge.icon className="w-3.5 h-3.5 text-success" />
            <span className="text-[11px] text-muted-foreground">{badge.label}</span>
          </div>
        ))}
      </div>
      
      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground text-center leading-relaxed pt-3 border-t border-border">
        VitalsLens does not provide medical diagnosis. Insights are generated using AI models based on reference ranges and trends.
      </p>
    </div>
  );
};

export default ComplianceFooter;
