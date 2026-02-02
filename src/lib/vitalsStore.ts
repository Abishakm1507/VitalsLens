import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ScanResult = {
    id: string
    timestamp: number
    heartRate: number
    spo2: number
    respirationRate: number
    signalQuality: "Poor" | "Fair" | "Good"
}

type VitalsState = {
    // Current Scan State
    heartRate?: number
    spo2?: number
    respirationRate?: number
    signalQuality: "Poor" | "Fair" | "Good"

    // History State
    history: ScanResult[]

    // Actions
    setVitals: (v: Partial<VitalsState>) => void
    addReading: (result: Omit<ScanResult, "id" | "timestamp">) => void
    reset: () => void
    clearHistory: () => void
}

export const useVitalsStore = create<VitalsState>()(
    persist(
        (set) => ({
            signalQuality: "Poor",
            history: [],

            setVitals: (v) => set((state) => ({ ...state, ...v })),

            addReading: (result) => set((state) => ({
                history: [
                    {
                        id: crypto.randomUUID(),
                        timestamp: Date.now(),
                        ...result
                    },
                    ...state.history
                ]
            })),

            reset: () => set({
                heartRate: undefined,
                spo2: undefined,
                respirationRate: undefined,
                signalQuality: "Poor"
            }),

            clearHistory: () => set({ history: [] })
        }),
        {
            name: "vitals-storage",
            partialize: (state) => ({ history: state.history }), // Only persist history
        }
    )
)
