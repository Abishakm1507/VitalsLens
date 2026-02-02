import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, ShieldCheck, Sun, Info } from "lucide-react";
import { useVitalsStore } from "@/lib/vitalsStore";
import { useScanFlowStore } from "@/lib/scanFlowStore";
import { useCamera } from "@/hooks/useCamera";
import { useFaceMesh } from "@/hooks/useFaceMesh";
import { useSignalQuality } from "@/hooks/useSignalQuality";

// UI Components
import Button from "@/components/Button";
import ReadinessCheck from "@/components/ReadinessCheck";
import SignalQualityChip from "@/components/SignalQualityChip";
import CameraFeed from "@/components/camera/CameraFeed";
import FaceOverlay from "@/components/camera/FaceOverlay";
import { NormalizedLandmarkList } from "@mediapipe/face_mesh";

const PreScanScreen = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const signalQuality = useVitalsStore((state) => state.signalQuality);
  const reset = useVitalsStore((state) => state.reset);
  const setStage = useScanFlowStore((state) => state.setStage);

  // Reset vitals on mount
  useEffect(() => {
    reset();
  }, [reset]);

  // Initialize hooks
  const { error: cameraError } = useCamera(videoRef);
  const [landmarks, setLandmarks] = useState<NormalizedLandmarkList | null>(null);
  useFaceMesh(videoRef, (l) => setLandmarks(l));

  // Start monitoring signal quality
  useSignalQuality();

  // Map store signal quality to component quality types
  const mappedQuality = signalQuality.toLowerCase() as "poor" | "fair" | "good";

  // Readiness checks status
  const checks = [
    {
      id: "lighting",
      label: "Lighting Conditions",
      status: mappedQuality === "good" ? "ready" : mappedQuality === "fair" ? "warning" : "pending",
      icon: Sun
    },
    {
      id: "face",
      label: "Face Visibility",
      status: mappedQuality === "good" ? "ready" : "pending",
      icon: ShieldCheck
    },
    {
      id: "position",
      label: "Stable Positioning",
      status: mappedQuality !== "poor" ? "ready" : "pending",
      icon: Video
    },
  ] as const;

  const isReady = signalQuality === "Good";
  const buttonText = isReady ? "Start Scan" : "Adjust lighting / position";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-lg min-h-screen flex flex-col bg-background px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Prepare for Scan</h1>
            <p className="text-sm text-muted-foreground">Ensure optimal conditions for accuracy</p>
          </div>
        </div>

        {/* Camera Preview Section */}
        <div className="relative mb-8 px-4 flex justify-center">
          <CameraFeed videoRef={videoRef} className="w-full max-w-[320px]" />
          <FaceOverlay landmarks={landmarks} />

          <div className="absolute top-4 right-8">
            <SignalQualityChip quality={mappedQuality} />
          </div>

          {cameraError && (
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 bg-destructive/10 border border-destructive/20 backdrop-blur-md p-4 rounded-2xl text-center">
              <p className="text-sm text-destructive font-medium">Camera Error</p>
              <p className="text-xs text-destructive/80 mt-1">Please ensure camera permissions are granted.</p>
            </div>
          )}
        </div>

        {/* Instructions & Readiness Section */}
        <div className="flex-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Readiness Check</h2>
            </div>

            <ReadinessCheck
              checks={checks as any}
              tips={[
                "Face natural light source",
                "Ensure your face is fully within the oval",
                "Sit still and avoid talking",
                "Remove glasses or masks if possible"
              ]}
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 pb-4">
          <Button
            onClick={() => setStage("scanning")}
            fullWidth
            disabled={!isReady}
            size="lg"
            className={`shadow-lg transition-all duration-300 ${isReady
              ? "bg-primary hover:scale-[1.02]"
              : "bg-muted text-muted-foreground grayscale cursor-not-allowed"
              }`}
          >
            {buttonText}
          </Button>
          {!isReady && (
            <p className="text-center text-xs text-muted-foreground mt-3 animate-pulse">
              Waiting for optimal signal quality...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreScanScreen;
