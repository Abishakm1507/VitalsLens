
export interface WellnessAnalysis {
    stress: {
        score: number; // 0-100, where 100 is high stress
        level: "Low" | "Moderate" | "High";
        label: string;
    };
    energy: {
        score: number; // 0-100, where 100 is high energy
        level: "Low" | "Optimal" | "High";
        label: string;
    };
    resilience: {
        score: number; // 0-100
        label: string;
    };
    risks: string[];
}

export function analyzeWellness(
    heartRate: number,
    spo2: number,
    respirationRate: number
): WellnessAnalysis {
    const risks: string[] = [];

    // --- Stress Calculation ---
    // Heuristic: Higher HR (>90) and Higher RR (>20) => Higher Stress
    // Baseline roughly 70 BPM / 16 RPM
    let stressScore = 30; // Baseline

    if (heartRate > 90) stressScore += 30;
    else if (heartRate > 80) stressScore += 15;

    if (respirationRate > 22) stressScore += 30;
    else if (respirationRate > 18) stressScore += 15;

    // SpO2 drop acts as physical stressor
    if (spo2 < 95) stressScore += 10;

    stressScore = Math.min(100, Math.max(0, stressScore));

    let stressLevel: "Low" | "Moderate" | "High" = "Low";
    if (stressScore > 70) stressLevel = "High";
    else if (stressScore > 40) stressLevel = "Moderate";

    // --- Energy Calculation ---
    // Heuristic: Optimal vitals => High energy potential.
    // Extremes (very low/high HR) => Lower energy availability
    let energyScore = 80;

    if (spo2 < 95) energyScore -= 30; // Oxygen deprivation kills energy
    if (spo2 < 90) energyScore -= 50;

    if (heartRate > 100) energyScore -= 20; // Tachycardia drains energy
    if (heartRate < 50) energyScore -= 20; // Bradycardia (if not athlete) might imply lethargy

    if (stressScore > 70) energyScore -= 20; // High stress depletes energy

    energyScore = Math.min(100, Math.max(0, energyScore));

    let energyLevel: "Low" | "Optimal" | "High" = "Optimal";
    if (energyScore < 40) energyLevel = "Low";
    else if (energyScore > 85) energyLevel = "High";

    // --- Resilience (Immunity/Recovery) ---
    // Heuristic: Stable SpO2 and low resting HR => Good resilience
    let resilienceScore = 60;
    if (spo2 >= 98) resilienceScore += 20;
    if (heartRate >= 55 && heartRate <= 70) resilienceScore += 20;
    if (respirationRate >= 12 && respirationRate <= 18) resilienceScore += 10;
    if (stressLevel === "High") resilienceScore -= 20;

    resilienceScore = Math.min(100, Math.max(0, resilienceScore));

    // --- Risks ---
    if (spo2 < 92) risks.push("Hypoxia Warning: SpO2 levels are critically low.");
    if (heartRate > 120) risks.push("Tachycardia: Resting heart rate is unusually high.");
    if (respirationRate > 25) risks.push("Tachypnea: Breathing rate is elevated.");

    return {
        stress: {
            score: stressScore,
            level: stressLevel,
            label: stressLevel === "High" ? "Elevated Stress" : stressLevel === "Moderate" ? "Mild Strain" : "Calm State"
        },
        energy: {
            score: energyScore,
            level: energyLevel,
            label: energyLevel === "Low" ? "Fatigued" : energyLevel === "High" ? "Energized" : "Balanced"
        },
        resilience: {
            score: resilienceScore,
            label: resilienceScore > 70 ? "Strong" : resilienceScore > 40 ? "Average" : "Vulnerable"
        },
        risks
    };
}
