import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import { ArrowLeft, Heart, Droplets, Wind, CheckCircle, AlertCircle, XCircle } from "lucide-react";

const CaregiverViewScreen = () => {
  const navigate = useNavigate();

  // Mock data - simplified for caregiver view
  const vitals = [
    { 
      type: "heartRate", 
      label: "Heart Rate", 
      value: 72, 
      unit: "BPM", 
      status: "normal" as const,
      icon: Heart,
      color: "text-[hsl(var(--heart-rate))]",
      bgColor: "bg-[hsl(var(--heart-rate)/0.1)]",
    },
    { 
      type: "spo2", 
      label: "Oxygen Level", 
      value: 96, 
      unit: "%", 
      status: "normal" as const,
      icon: Droplets,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    { 
      type: "respiratory", 
      label: "Breathing", 
      value: 15, 
      unit: "per min", 
      status: "normal" as const,
      icon: Wind,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  const getStatusInfo = (status: "normal" | "borderline" | "abnormal") => {
    switch (status) {
      case "normal":
        return { icon: CheckCircle, color: "text-success", bg: "bg-success", label: "Normal" };
      case "borderline":
        return { icon: AlertCircle, color: "text-warning", bg: "bg-warning", label: "Watch" };
      case "abnormal":
        return { icon: XCircle, color: "text-destructive", bg: "bg-destructive", label: "Alert" };
    }
  };

  const weeklySummary = {
    scansCompleted: 14,
    averageHR: 71,
    alerts: 2,
    overallStatus: "normal" as const,
  };

  return (
    <MobileFrame>
      <div className="h-full flex flex-col bg-muted/30">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-card">
          <button 
            onClick={() => navigate("/analytics")}
            className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center btn-ripple"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Caregiver View</h1>
            <p className="text-body text-muted-foreground">Simplified health overview</p>
          </div>
        </div>

        {/* Overall Status - Large and Clear */}
        <div className="p-6">
          <div className="card-medical text-center py-8">
            <CheckCircle className="w-20 h-20 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-success mb-2">All Normal</h2>
            <p className="text-lg text-muted-foreground">This Week's Health Status</p>
          </div>
        </div>

        {/* Vitals - Large Cards */}
        <div className="px-6 space-y-4 flex-1">
          {vitals.map((vital) => {
            const statusInfo = getStatusInfo(vital.status);
            const StatusIcon = statusInfo.icon;
            const VitalIcon = vital.icon;

            return (
              <div 
                key={vital.type}
                className="card-medical flex items-center gap-4 py-5"
              >
                <div className={`w-16 h-16 rounded-2xl ${vital.bgColor} flex items-center justify-center`}>
                  <VitalIcon className={`w-8 h-8 ${vital.color}`} />
                </div>
                
                <div className="flex-1">
                  <p className="text-lg font-medium text-muted-foreground">{vital.label}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {vital.value} <span className="text-lg font-normal text-muted-foreground">{vital.unit}</span>
                  </p>
                </div>

                <div className={`w-14 h-14 rounded-full ${statusInfo.bg} flex items-center justify-center`}>
                  <StatusIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Summary */}
        <div className="p-6">
          <div className="card-medical">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">This Week</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{weeklySummary.scansCompleted}</p>
                <p className="text-body text-muted-foreground">Scans Done</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[hsl(var(--heart-rate))]">{weeklySummary.averageHR}</p>
                <p className="text-body text-muted-foreground">Avg HR</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-warning">{weeklySummary.alerts}</p>
                <p className="text-body text-muted-foreground">Alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Large Action Button */}
        <div className="p-6 pb-8">
          <button
            onClick={() => navigate("/pre-scan")}
            className="w-full py-5 bg-primary text-primary-foreground rounded-2xl text-xl font-semibold shadow-button btn-ripple"
          >
            Start New Scan
          </button>
        </div>
      </div>
    </MobileFrame>
  );
};

export default CaregiverViewScreen;
