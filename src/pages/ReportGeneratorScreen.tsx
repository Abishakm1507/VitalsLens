import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { ArrowLeft, Calendar, Heart, Droplets, Wind, Sparkles, BarChart3, FileText } from "lucide-react";

const ReportGeneratorScreen = () => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<"7d" | "14d" | "30d">("7d");
  const [selectedVitals, setSelectedVitals] = useState({
    heartRate: true,
    spo2: true,
    respiratory: true,
  });
  const [includeOptions, setIncludeOptions] = useState({
    aiSummary: true,
    trendCharts: true,
    riskAnalysis: true,
  });

  const toggleVital = (vital: keyof typeof selectedVitals) => {
    setSelectedVitals(prev => ({ ...prev, [vital]: !prev[vital] }));
  };

  const toggleOption = (option: keyof typeof includeOptions) => {
    setIncludeOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const handleGenerate = () => {
    navigate("/analytics/report/preview", {
      state: { dateRange, selectedVitals, includeOptions }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate("/analytics")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card btn-ripple"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">Generate Report</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
          {/* Date Range */}
          <div>
            <h3 className="text-card-title text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Date Range
            </h3>
            <div className="flex gap-2">
              {([
                { value: "7d", label: "Last 7 Days" },
                { value: "14d", label: "Last 14 Days" },
                { value: "30d", label: "Last 30 Days" },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`flex-1 py-3 px-4 rounded-xl text-caption font-medium transition-all btn-ripple ${dateRange === option.value
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "bg-card text-foreground hover:bg-muted"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vitals Selection */}
          <div>
            <h3 className="text-card-title text-foreground mb-3">Include Vitals</h3>
            <div className="space-y-2">
              {[
                { key: "heartRate" as const, label: "Heart Rate", icon: Heart, color: "text-[hsl(var(--heart-rate))]" },
                { key: "spo2" as const, label: "SpO₂", icon: Droplets, color: "text-primary" },
                { key: "respiratory" as const, label: "Respiratory Rate", icon: Wind, color: "text-secondary" },
              ].map((vital) => (
                <button
                  key={vital.key}
                  onClick={() => toggleVital(vital.key)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all btn-ripple ${selectedVitals[vital.key]
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-card border-2 border-transparent hover:bg-muted"
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${selectedVitals[vital.key] ? "bg-primary/20" : "bg-muted"} flex items-center justify-center`}>
                    <vital.icon className={`w-5 h-5 ${vital.color}`} />
                  </div>
                  <span className="text-card-title text-foreground">{vital.label}</span>
                  <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedVitals[vital.key]
                    ? "bg-primary border-primary"
                    : "border-muted-foreground"
                    }`}>
                    {selectedVitals[vital.key] && (
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <h3 className="text-card-title text-foreground mb-3">Include in Report</h3>
            <div className="space-y-2">
              {[
                { key: "aiSummary" as const, label: "AI Health Summary", icon: Sparkles, description: "AI-generated interpretation" },
                { key: "trendCharts" as const, label: "Trend Charts", icon: BarChart3, description: "Visual trend graphs" },
                { key: "riskAnalysis" as const, label: "Risk Analysis", icon: FileText, description: "Risk timeline & alerts" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => toggleOption(option.key)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all btn-ripple ${includeOptions[option.key]
                    ? "bg-accent border-2 border-primary/30"
                    : "bg-card border-2 border-transparent hover:bg-muted"
                    }`}
                >
                  <option.icon className={`w-5 h-5 ${includeOptions[option.key] ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <p className="text-card-title text-foreground">{option.label}</p>
                    <p className="text-caption text-muted-foreground">{option.description}</p>
                  </div>
                  <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${includeOptions[option.key]
                    ? "bg-primary border-primary"
                    : "border-muted-foreground"
                    }`}>
                    {includeOptions[option.key] && (
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview info */}
          <div className="card-medical bg-muted/50">
            <p className="text-caption text-muted-foreground leading-relaxed">
              Your report will be generated with the selected options and can be exported as PDF or shared directly with healthcare providers.
            </p>
          </div>
        </div>

        {/* Generate Button */}
        <div className="p-4 pb-8">
          <Button onClick={handleGenerate} fullWidth className="btn-ripple">
            <FileText className="w-5 h-5 mr-2" />
            Generate Health Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneratorScreen;
