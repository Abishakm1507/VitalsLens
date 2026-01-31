import { useEffect, useRef, RefObject } from "react";
import { FaceMesh, Results, NormalizedLandmarkList } from "@mediapipe/face_mesh";

export const useFaceMesh = (
    videoRef: RefObject<HTMLVideoElement>,
    onLandmarks: (landmarks: NormalizedLandmarkList) => void
) => {
    const faceMeshRef = useRef<FaceMesh | null>(null);
    const requestRef = useRef<number>();

    useEffect(() => {
        // 1. Initialize FaceMesh
        const faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            }
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            selfieMode: true,
        });

        faceMesh.onResults((results: Results) => {
            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                onLandmarks(results.multiFaceLandmarks[0]);
            }
        });

        faceMeshRef.current = faceMesh;

        // 2. Detection Loop
        const detect = async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
                await faceMesh.send({ image: videoRef.current });
            }
            requestRef.current = requestAnimationFrame(detect);
        };

        detect();

        // 3. Cleanup
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (faceMeshRef.current) {
                faceMeshRef.current.close();
            }
        };
    }, [videoRef, onLandmarks]);

    return { faceMesh: faceMeshRef.current };
};
