import { Home, Scan, BarChart3, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Scan, label: "Scan", path: "/pre-scan" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if current path starts with the nav item path (for nested routes)
  const isActive = (path: string) => {
    if (path === "/analytics") {
      return location.pathname.startsWith("/analytics");
    }
    return location.pathname === path;
  };
  
  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-full px-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 min-w-[64px] py-2 px-3 rounded-xl transition-all duration-200 ${
                active 
                  ? "text-primary bg-accent" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`w-6 h-6 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="text-caption font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
