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
- **React 18**: Component-based UI library.
- **TypeScript**: Typed JavaScript for robust development.
- **Vite**: Ultra-fast frontend build tool.
- **React Router 6**: For seamless navigation between app screens.

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework for modern design.
- **Shadcn UI**: High-quality, accessible UI components built on Radix UI.
- **Lucide React**: Clean and consistent iconography.
- **Framer Motion**: (via tailwind-animate) Smooth transitions and interactive elements.

### Data & Logic
- **TanStack Query (React Query)**: Efficient data fetching and state management.
- **Recharts**: Responsive and interactive health data visualizations.
- **React Hook Form & Zod**: Schema-driven form validation and management.
- **Sonner**: High-quality toast notifications.

---

## � Project Structure

```bash
src/
├── components/     # Reusable UI components (MobileFrame, Button, Charts, etc.)
├── hooks/          # Custom React hooks for logic reuse
├── lib/            # Utility functions and library configurations (utils.ts)
├── pages/          # Full-screen page components (Dashboard, Scan, Analytics, etc.)
│   ├── Onboarding/ # Initial setup flow
│   ├── Scan/       # Core measurement logic and UI
│   ├── Reports/    # PDF generation and preview
│   └── ...
├── App.tsx          # Main routing and application layout
└── main.tsx        # Entry point
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
   cd remix-of-vitalslens-ai-scan
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

1. **Face Detection**: The app identifies your face and selects relevant regions of interest (ROI).
2. **Signal Extraction**: It tracks color changes in the R, G, and B channels over 30 seconds.
3. **Filtering & FFT**: AI filters out noise (movement, lighting changes) and applies Fast Fourier Transform to identify the heart rate and respiratory rate frequencies.

---

## 📜 License & Credits

- **Project Lead**: [Abishakm1507](https://github.com/Abishakm1507)
- **Design Inspiration**: Medical-grade health interfaces and modern glassmorphism.
- **License**: MIT

> [!NOTE]
> This application is currently a **Proof of Concept (MVP)**. Measurements shown in the prototype are simulated for demonstration purposes and should not be used for medical diagnosis.
