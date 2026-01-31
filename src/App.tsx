import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import PermissionScreen from "./pages/PermissionScreen";
import DashboardScreen from "./pages/DashboardScreen";
import ScanController from "./pages/Scan/ScanController";
import InsightsScreen from "./pages/InsightsScreen";
import HistoryScreen from "./pages/HistoryScreen";
import AlertsScreen from "./pages/AlertsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SettingsScreen from "./pages/SettingsScreen";
import UserContextScreen from "./pages/UserContextScreen";
import AboutScreen from "./pages/AboutScreen";
import AnalyticsScreen from "./pages/AnalyticsScreen";
import VitalDetailScreen from "./pages/VitalDetailScreen";
import ReportGeneratorScreen from "./pages/ReportGeneratorScreen";
import ReportPreviewScreen from "./pages/ReportPreviewScreen";
import AlertHistoryScreen from "./pages/AlertHistoryScreen";
import CaregiverViewScreen from "./pages/CaregiverViewScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/permission" element={<PermissionScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/scan" element={<ScanController />} />
          <Route path="/insights" element={<InsightsScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/alerts" element={<AlertsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/user-context" element={<UserContextScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          {/* Analytics Routes */}
          <Route path="/analytics" element={<AnalyticsScreen />} />
          <Route path="/analytics/vital/:type" element={<VitalDetailScreen />} />
          <Route path="/analytics/report" element={<ReportGeneratorScreen />} />
          <Route path="/analytics/report/preview" element={<ReportPreviewScreen />} />
          <Route path="/analytics/alerts" element={<AlertHistoryScreen />} />
          <Route path="/analytics/caregiver" element={<CaregiverViewScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
