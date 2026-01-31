import { useEffect, useRef, useState, RefObject } from "react";

export const useCamera = (videoRef: RefObject<HTMLVideoElement>) => {
    const [error, setError] = useState<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            if (streamRef.current) return;

            const constraints = {
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    aspectRatio: { ideal: 1.7777777778 }
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setError(null);
        } catch (err) {
            console.error("Camera access error:", err);
            setError("Failed to access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    return { error, stopCamera, restartCamera: startCamera };
};
