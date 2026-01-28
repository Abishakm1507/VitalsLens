import { useState } from "react";
import { 
  X, Share2, MessageCircle, FileText, Send, Heart, 
  Droplets, Wind, Calendar, Clock, Copy, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";

interface VitalReading {
  heartRate: number;
  spo2: number;
  respiratory: number;
  riskLevel: "low" | "moderate" | "high";
  timestamp: Date;
}

interface ShareModalProps {
  reading: VitalReading;
  onClose: () => void;
  onShareWhatsApp?: () => void;
  onExportPDF?: () => void;
  onSendTelemedicine?: () => void;
}

const riskLabels = {
  low: { text: "Low Risk", color: "text-success", bg: "bg-success/10" },
  moderate: { text: "Monitor Closely", color: "text-warning", bg: "bg-warning/10" },
  high: { text: "Seek Attention", color: "text-destructive", bg: "bg-destructive/10" },
};

const ShareModal = ({ 
  reading, 
  onClose,
  onShareWhatsApp,
  onExportPDF,
  onSendTelemedicine
}: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const risk = riskLabels[reading.riskLevel];
  
  const copyToClipboard = () => {
    const text = `VitalsLens Health Report
Date: ${reading.timestamp.toLocaleDateString()}
Time: ${reading.timestamp.toLocaleTimeString()}

Heart Rate: ${reading.heartRate} BPM
SpO₂: ${reading.spo2}%
Respiratory: ${reading.respiratory} breaths/min

Status: ${risk.text}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-[358px] bg-card rounded-2xl shadow-elevated overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h2 className="text-card-title font-semibold text-foreground">Share Report</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Report Preview */}
        <div className="p-4 bg-muted/30">
          <div className="bg-card rounded-xl p-4 space-y-3 border border-border">
            {/* Date & Time */}
            <div className="flex items-center gap-4 text-caption text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{reading.timestamp.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{reading.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            
            {/* Vitals snapshot */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-heartRate/5 rounded-lg">
                <Heart className="w-4 h-4 text-heartRate mx-auto mb-1" />
                <p className="text-card-title font-bold text-foreground">{reading.heartRate}</p>
                <p className="text-[10px] text-muted-foreground">BPM</p>
              </div>
              <div className="text-center p-2 bg-spo2/5 rounded-lg">
                <Droplets className="w-4 h-4 text-spo2 mx-auto mb-1" />
                <p className="text-card-title font-bold text-foreground">{reading.spo2}%</p>
                <p className="text-[10px] text-muted-foreground">SpO₂</p>
              </div>
              <div className="text-center p-2 bg-respiratory/5 rounded-lg">
                <Wind className="w-4 h-4 text-respiratory mx-auto mb-1" />
                <p className="text-card-title font-bold text-foreground">{reading.respiratory}</p>
                <p className="text-[10px] text-muted-foreground">Resp</p>
              </div>
            </div>
            
            {/* Risk label */}
            <div className={cn("text-center py-2 rounded-lg", risk.bg)}>
              <span className={cn("text-body font-semibold", risk.color)}>
                {risk.text}
              </span>
            </div>
          </div>
        </div>
        
        {/* Share Options */}
        <div className="p-4 space-y-2">
          <button 
            onClick={onShareWhatsApp}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </div>
            <span className="text-card-title text-foreground flex-1 text-left">Share via WhatsApp</span>
          </button>
          
          <button 
            onClick={onExportPDF}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-card-title text-foreground flex-1 text-left">Export as PDF</span>
          </button>
          
          <button 
            onClick={onSendTelemedicine}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-primary" />
            </div>
            <span className="text-card-title text-foreground flex-1 text-left">Send to Telemedicine App</span>
          </button>
          
          <button 
            onClick={copyToClipboard}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              {copied ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                <Copy className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <span className="text-card-title text-foreground flex-1 text-left">
              {copied ? "Copied!" : "Copy to Clipboard"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
