import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Wifi, WifiOff, Globe, Moon, Bell,
  Database, Cloud, Shield, ChevronRight, Check
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const SettingsScreen = () => {
  const navigate = useNavigate();
  const [lowDataMode, setLowDataMode] = useState(false);
  const [offlineStorage, setOfflineStorage] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">Settings</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
          {/* Connectivity section */}
          <div className="space-y-3">
            <h2 className="text-caption text-muted-foreground uppercase tracking-wide px-1">
              Connectivity
            </h2>

            {/* Low Data Mode - Featured */}
            <div className={cn(
              "rounded-2xl border-2 p-4 space-y-3 transition-all duration-300",
              lowDataMode
                ? "border-secondary bg-secondary/5"
                : "border-border bg-card"
            )}>
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  lowDataMode ? "bg-secondary/20" : "bg-muted"
                )}>
                  {lowDataMode ? (
                    <WifiOff className="w-6 h-6 text-secondary" />
                  ) : (
                    <Wifi className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-card-title text-foreground font-medium">Low Data Mode</h3>
                    {lowDataMode && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/20 text-secondary">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-caption text-muted-foreground leading-relaxed">
                    Designed for rural and low-connectivity areas. Reduces data usage and enables offline features.
                  </p>
                </div>
                <Switch
                  checked={lowDataMode}
                  onCheckedChange={setLowDataMode}
                />
              </div>

              {lowDataMode && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-secondary/20">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary/10 rounded-lg">
                    <Database className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-caption text-secondary">Offline storage</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary/10 rounded-lg">
                    <Cloud className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-caption text-secondary">Deferred sync</span>
                  </div>
                </div>
              )}
            </div>

            {/* Offline storage */}
            <div className="flex items-center justify-between p-4 bg-card rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Database className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-card-title text-foreground">Offline History</p>
                  <p className="text-caption text-muted-foreground">Store readings locally</p>
                </div>
              </div>
              <Switch
                checked={offlineStorage}
                onCheckedChange={setOfflineStorage}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <h2 className="text-caption text-muted-foreground uppercase tracking-wide px-1">
              Preferences
            </h2>

            <div className="flex items-center justify-between p-4 bg-card rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-card-title text-foreground">Notifications</p>
                  <p className="text-caption text-muted-foreground">Daily reminders</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-card rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-card-title text-foreground">Dark Mode</p>
                  <p className="text-caption text-muted-foreground">Reduce eye strain</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <button
              onClick={() => navigate("/user-context")}
              className="w-full flex items-center justify-between p-4 bg-card rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-card-title text-foreground">Personalization</p>
                  <p className="text-caption text-muted-foreground">Age, purpose, conditions</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Security */}
          <div className="space-y-3">
            <h2 className="text-caption text-muted-foreground uppercase tracking-wide px-1">
              Security
            </h2>

            <button
              onClick={() => navigate("/about")}
              className="w-full flex items-center justify-between p-4 bg-card rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <p className="text-card-title text-foreground">Privacy & Trust</p>
                  <p className="text-caption text-muted-foreground">How we protect your data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Social impact note */}
          <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4">
            <p className="text-caption text-muted-foreground leading-relaxed text-center">
              🌍 VitalsLens is designed for accessibility — works offline for rural and underserved communities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
