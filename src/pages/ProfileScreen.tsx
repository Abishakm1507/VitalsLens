import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import BottomNav from "@/components/BottomNav";
import { 
  User, Settings, Shield, Bell, HelpCircle, Info, 
  ChevronRight, LogOut, Moon
} from "lucide-react";

const ProfileScreen = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: Bell, label: "Notifications", description: "Manage alert preferences" },
    { icon: Shield, label: "Privacy & Security", description: "Data and permissions" },
    { icon: Moon, label: "Appearance", description: "Dark mode and display" },
    { icon: Settings, label: "Preferences", description: "Measurement units, language" },
    { icon: HelpCircle, label: "Help & Support", description: "FAQs and contact us" },
    { icon: Info, label: "About VitalsLens", description: "Version and trust info", onClick: () => navigate("/about") },
  ];
  
  return (
    <MobileFrame showNav>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4">
          <h1 className="text-section-title text-foreground">Profile</h1>
        </div>
        
        {/* Profile card */}
        <div className="mx-4 p-4 card-medical mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-card-title text-foreground">Guest User</h3>
              <p className="text-caption text-muted-foreground">Tap to add profile details</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        
        {/* Stats */}
        <div className="mx-4 grid grid-cols-3 gap-3 mb-6">
          {[
            { value: "24", label: "Scans" },
            { value: "7", label: "Day streak" },
            { value: "98%", label: "Avg SpO₂" },
          ].map((stat, index) => (
            <div key={index} className="card-medical text-center">
              <p className="text-section-title text-primary">{stat.value}</p>
              <p className="text-caption text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Menu items */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-card-title text-foreground">{item.label}</p>
                  <p className="text-caption text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
          
          {/* Logout */}
          <button className="w-full flex items-center gap-4 p-4 mt-4 text-destructive hover:bg-destructive/5 rounded-xl transition-colors">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-card-title">Sign Out</span>
          </button>
        </div>
      </div>
      
      <BottomNav />
    </MobileFrame>
  );
};

export default ProfileScreen;
