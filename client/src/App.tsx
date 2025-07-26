import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useAuth } from "@/contexts/AuthContext";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import VendorDashboard from "@/pages/VendorDashboard";
import SupplierDashboard from "@/pages/SupplierDashboard";
import BundleRecommendation from "@/pages/BundleRecommendation";
import DeliveryCalendar from "@/pages/DeliveryCalendar";
import ComplaintCenter from "@/pages/ComplaintCenter";
import ProductManagement from "@/pages/ProductManagement";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      <LanguageToggle />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/vendor-dashboard" component={VendorDashboard} />
        <Route path="/supplier-dashboard" component={SupplierDashboard} />
        <Route path="/bundle-recommendation" component={BundleRecommendation} />
        <Route path="/calendar" component={DeliveryCalendar} />
        <Route path="/complaints" component={ComplaintCenter} />
        <Route path="/products" component={ProductManagement} />
        <Route path="/products/add" component={ProductManagement} />
        <Route path="/orders" component={() => <div className="p-8 text-center">Orders page coming soon</div>} />
        <Route path="/profile" component={() => <div className="p-8 text-center">Profile page coming soon</div>} />
        <Route component={NotFound} />
      </Switch>
      {user && <MobileBottomNav />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <AppContent />
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
