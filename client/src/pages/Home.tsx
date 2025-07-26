import { Truck, Store, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleStartAsVendor = () => {
    if (user) {
      if (user.role === "vendor") {
        setLocation("/vendor-dashboard");
      } else {
        setLocation("/onboarding");
      }
    } else {
      setLocation("/login");
    }
  };

  const handleBecomeSupplier = () => {
    if (user) {
      if (user.role === "supplier") {
        setLocation("/supplier-dashboard");
      } else {
        setLocation("/onboarding");
      }
    } else {
      setLocation("/login");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 rounded-lg p-3 mr-3">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">SupplySetu</h1>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              {t("smartSupplyChain")}
              <br />
              {t("forStreetFood")}
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 text-emerald-100">
              {t("aiPoweredSupply")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartAsVendor}
                className="bg-white text-primary px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all hover:bg-white/95"
                size="lg"
              >
                <Store className="mr-2 h-5 w-5" />
                {t("startAsVendor")}
              </Button>
              
              <Button
                onClick={handleBecomeSupplier}
                variant="secondary"
                className="bg-emerald-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all hover:bg-emerald-800"
                size="lg"
              >
                <Package className="mr-2 h-5 w-5" />
                {t("becomeSupplier")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-neutral-800 mb-4">
              {t("keyFeatures")}
            </h3>
            <p className="text-lg text-neutral-600">
              {t("supplySetuHelps")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {t("aiBundleSuggestions")}
                </h4>
                <p className="text-sm text-neutral-600">
                  {t("smartTechnology")}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {t("freshnessDetector")}
                </h4>
                <p className="text-sm text-neutral-600">
                  {t("qualityCheck")}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {t("onTimeDelivery")}
                </h4>
                <p className="text-sm text-neutral-600">
                  {t("weeklyMonthlySchedule")}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <div className="bg-emerald-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 2v2h3a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h3V2h2v2h6V2h2zM4 7v14h16V7H4zm2 2h2v2H6V9zm0 4h2v2H6v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {t("mobileFirst")}
                </h4>
                <p className="text-sm text-neutral-600">
                  {t("mobileAppEasy")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
