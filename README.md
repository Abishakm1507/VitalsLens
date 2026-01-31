# 🏥 VitalsLens AI Scan

**Touchless vital sign monitoring powered by AI.**

VitalsLens is a medical-grade health monitoring application that leverages advanced AI and smartphone camera technology to measure vital signs without any physical contact. Designed for students, the elderly, rural populations, and telemedicine users, it provides a seamless and trustworthy way to track health metrics.

---

## 🌟 Key Features

### 🛡️ Core Technology
- **Touchless Vitals Measurement**: Uses camera-based Photoplethysmography (PPG) to measure Heart Rate, SpO₂, and Respiratory Rate in just 30 seconds.
- **AI-Driven Analysis**: Advanced algorithms process subtle color changes in skin to extract cardiac and respiratory signals.
- **Signal Quality Monitoring**: Real-time feedback on lighting and positioning to ensure measurement accuracy.

### 📊 Health Management
- **Interactive Dashboard**: A centralized view of your latest readings, health trends, and upcoming check-ups.
- **Advanced Analytics**: Deep dive into your health history with interactive charts powered by Recharts.
- **AI Health Insights**: Personalized, context-aware insights based on your age, gender, and recent activity levels.

### 📋 Reporting & Care
- **Smart Report Generation**: Export comprehensive PDF-style health reports for personal tracking or sharing with medical professionals.
- **Caregiver View**: Monitor the health of loved ones remotely with a dedicated view and shared access.
- **Intelligent Alerts**: Automated notifications for abnormal readings or missed check-ups.

### 📱 User Experience
- **Personalized Onboarding**: Tailored experience based on user demographics and health goals.
- **Modern UI/UX**: A premium, "medical-grade" interface designed for trust and ease of use.
- **Responsive Design**: Optimized for mobile-first interaction with smooth transitions and micro-animations.

---

## 🛠️ Tech Stack

### Frontend Core
- **React 18**: Component-based UI library with efficient rendering.
- **TypeScript**: Full type safety for health-critical logical operations.
- **Vite**: Modern build tooling for lightning-fast development.
- **Zustand**: Lightweight, high-performance state management for real-time vitals and flow control.

### AI & Signal Processing
- **MediaPipe FaceMesh**: Real-time facial landmark tracking and ROI selection.
- **rPPG Engine**: Custom signal processing pipeline using Fast Fourier Transform (FFT) for heart and respiration rate extraction.
- **TensorFlow.js**: Backend acceleration for AI-driven detection.

### Styling & UI
- **Tailwind CSS**: Utility-first CSS for a responsive, medical-grade aesthetic.
- **Shadcn UI**: Accessible, high-quality components built on Radix UI primitives.
- **Lucide React**: Professional health and utility iconography.

---

## 📂 Project Structure

```bash
src/
├── components/     # UI Components
│   ├── camera/     # Camera & Face detection UI (FaceOverlay, CameraFeed)
│   ├── analytics/  # Health charts and reports (TrendGraph, ReportPreview)
│   └── ui/         # Base Shadcn components
├── hooks/          # Custom Hooks
│   ├── useRPPG.ts  # Signal processing & FFT logic
│   ├── useCamera.ts# Hardware access & stream management
│   └── useFaceMesh.ts# MediaPipe orchestration
├── lib/            # Shared logic & State
│   ├── vitalsStore.ts # Real-time vital data
│   └── scanFlowStore.ts # Unified flow state machine
├── pages/          # Full-screen pages
└── App.tsx          # Router configuration
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (Optional, but recommended for faster installs)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abishakm1507/VitalsLens.git
   cd VitalsLens
   ```

2. **Install dependencies**
   ```bash
   # Using Bun
   bun install

   # Using NPM
   npm install
   ```

### Running the App

1. **Start the development server**
   ```bash
   bun dev
   # OR
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

---

## 🔬 How It Works (Conceptual)

VitalsLens utilizes **Remote Photoplethysmography (rPPG)**. When your heart beats, blood volume in your face changes subtly. This change causes microscopic variations in skin color that are invisible to the naked eye but detectable by high-resolution smartphone cameras. 

1. **Real-time Face Tracking**: Using MediaPipe, the app identifies the facial mesh and isolates the forehead and cheek areas (ROI) where capillary blood flow is most visible.
2. **Chrominance Signal Extraction**: It tracks microscopic color variations in the G and R channels, which correlate with the cardiac cycle.
3. **Filtering & Spectral Analysis**: The raw signal is filtered to remove noise and motion artifacts. A spectral analysis (DFT/FFT) is then performed to identify the peak frequency corresponding to the heart rate (BPM) and respiratory rate (RPM).

---

## 📜 License & Credits

- **Project Lead**: [Abishakm1507](https://github.com/Abishakm1507)
- **Design Inspiration**: Medical-grade health interfaces and modern glassmorphism.
- **License**: MIT

> [!NOTE]
> This application is currently a **Proof of Concept (MVP)**. Measurements shown in the prototype are simulated for demonstration purposes and should not be used for medical diagnosis.
