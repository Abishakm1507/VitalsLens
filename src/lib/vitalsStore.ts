import { create } from "zustand"

type VitalsState = {
    heartRate?: number
    spo2?: number
    respirationRate?: number
    signalQuality: "Poor" | "Fair" | "Good"
    setVitals: (v: Partial<VitalsState>) => void
    reset: () => void
}

export const useVitalsStore = create<VitalsState>(set => ({
    signalQuality: "Poor",
    setVitals: v => set(v),
    reset: () => set({ heartRate: undefined, spo2: undefined, respirationRate: undefined, signalQuality: "Poor" }),
}))
