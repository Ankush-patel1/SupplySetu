import { Home, Package, Calendar, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

export function MobileBottomNav() {
  const { t } = useLanguage();
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: t("home") },
    { path: "/orders", icon: Package, label: t("orders") },
    { path: "/calendar", icon: Calendar, label: t("calendar") },
    { path: "/profile", icon: User, label: t("profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden z-40">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center py-2 px-4 transition-colors ${
                isActive ? "text-primary" : "text-neutral-600"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
