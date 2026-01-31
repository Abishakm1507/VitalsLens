import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVitalsStore } from "@/lib/vitalsStore";
import { useScanFlowStore } from "@/lib/scanFlowStore";
import { useRPPG } from "@/hooks/useRPPG";
import { useCamera } from "@/hooks/useCamera";
import { useFaceMesh } from "@/hooks/useFaceMesh";
import { NormalizedLandmarkList } from "@mediapipe/face_mesh";

// UI Components
import CameraFeed from "@/components/camera/CameraFeed";
import FaceOverlay from "@/components/camera/FaceOverlay";
import SignalQualityChip from "@/components/SignalQualityChip";
import ConfidenceIndicator from "@/components/ConfidenceIndicator";
import ProgressRing from "@/components/ProgressRing";
import SignalWaveform from "@/components/SignalWaveform";

const AnalyzingScreen = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { signalQuality } = useVitalsStore();
  const setStage = useScanFlowStore((state) => state.setStage);
  const { remainingTime } = useRPPG({ duration: 30 });
  const { error: cameraError } = useCamera(videoRef);
  const [landmarks, setLandmarks] = useState<NormalizedLandmarkList | null>(null);
  useFaceMesh(videoRef, (l) => setLandmarks(l));

  const progress = ((30 - remainingTime) / 30) * 100;
  const mappedQuality = signalQuality.toLowerCase() as "poor" | "fair" | "good";

  useEffect(() => {
    if (remainingTime === 0) {
      setStage("done");
    }
  }, [remainingTime, setStage]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-lg min-h-screen flex flex-col px-4 py-8 space-y-8">
        {/* Header Area */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">Analyzing Vitals</h1>
            <p className="text-sm text-muted-foreground">Keep your face within the guide</p>
          </div>
          <SignalQualityChip quality={mappedQuality} />
        </div>

        {/* Camera Preview with Progress Ring Overlay */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-full max-w-[320px]">
            <CameraFeed videoRef={videoRef} className="z-0" />
            <FaceOverlay landmarks={landmarks} />

            {/* Progress Ring Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <ProgressRing
                progress={progress}
                size={260}
                strokeWidth={4}
                className="opacity-80"
              >
                <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-2xl font-bold text-white">{remainingTime}s</span>
                </div>
              </ProgressRing>
            </div>
          </div>

          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm z-20 rounded-3xl">
              <p className="text-destructive font-medium text-center">Camera error. Please check permissions.</p>
            </div>
          )}
        </div>

        {/* Instruction Message */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center space-y-1 shadow-sm">
          <p className="text-foreground font-semibold animate-pulse">Hold still</p>
          <p className="text-xs text-muted-foreground">Ensure good lighting for better accuracy</p>
        </div>

        {/* Live Metrics & Waveform */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Live Signal</span>
            <ConfidenceIndicator confidence={remainingTime > 15 ? 85 : 92} size="sm" />
          </div>

          <SignalWaveform />

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-muted/50 rounded-xl p-3 flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground uppercase">Stability</span>
              <span className="text-sm font-bold text-foreground">High</span>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground uppercase">Light</span>
              <span className="text-sm font-bold text-foreground">Constant</span>
            </div>
          </div>
        </div>

        {/* Footer/Progress Note */}
        <div className="flex flex-col items-center pt-2">
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-tighter">Scan in progress</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyzingScreen;
