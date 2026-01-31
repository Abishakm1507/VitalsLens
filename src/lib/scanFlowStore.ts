import { create } from "zustand";

export type ScanStage = "pre" | "scanning" | "done";

interface ScanFlowState {
    stage: ScanStage;
    setStage: (stage: ScanStage) => void;
    resetScan: () => void;
}

export const useScanFlowStore = create<ScanFlowState>((set) => ({
    stage: "pre",
    setStage: (stage) => set({ stage }),
    resetScan: () => set({ stage: "pre" }),
}));
