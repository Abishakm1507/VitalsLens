import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import PermissionScreen from "./pages/PermissionScreen";
import DashboardScreen from "./pages/DashboardScreen";
import PreScanScreen from "./pages/PreScanScreen";
import ScanScreen from "./pages/ScanScreen";
import AnalyzingScreen from "./pages/AnalyzingScreen";
import ResultsScreen from "./pages/ResultsScreen";
import InsightsScreen from "./pages/InsightsScreen";
import HistoryScreen from "./pages/HistoryScreen";
import AlertsScreen from "./pages/AlertsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SettingsScreen from "./pages/SettingsScreen";
import UserContextScreen from "./pages/UserContextScreen";
import AboutScreen from "./pages/AboutScreen";
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
          <Route path="/pre-scan" element={<PreScanScreen />} />
          <Route path="/scan" element={<ScanScreen />} />
          <Route path="/analyzing" element={<AnalyzingScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="/insights" element={<InsightsScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/alerts" element={<AlertsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/user-context" element={<UserContextScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
