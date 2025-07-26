import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bot, Calendar, Package, Plus, Minus, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { NotificationToast } from "@/components/NotificationToast";

export default function BundleRecommendation() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [toast, setToast] = useState({ show: false, message: "" });
  
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "potatoes": 10,
    "onions": 5,
    "greenChili": 1,
    "semolina": 5,
    "chaatMasala": 500,
    "oil": 2,
  });

  const adjustQuantity = (product: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [product]: Math.max(0, (prev[product] || 0) + delta)
    }));
  };

  const calculateTotal = () => {
    const prices = {
      "potatoes": 20,
      "onions": 30,
      "greenChili": 80,
      "semolina": 40,
      "chaatMasala": 300,
      "oil": 120,
    };
    
    return Object.entries(quantities).reduce((total, [product, quantity]) => {
      const price = prices[product as keyof typeof prices] || 0;
      const multiplier = product === "chaatMasala" ? quantity / 1000 : quantity; // Convert grams to kg for calculation
      return total + (price * multiplier);
    }, 0);
  };

  const handleSaveBundle = () => {
    setToast({ show: true, message: t("successfullySaved") });
    setTimeout(() => {
      setLocation("/vendor-dashboard");
    }, 1500);
  };

  const bundleItems = [
    { key: "potatoes", nameHi: "आलू", nameEn: "Potatoes", unit: "kg", category: "perishable", price: 20 },
    { key: "onions", nameHi: "प्याज", nameEn: "Onions", unit: "kg", category: "perishable", price: 30 },
    { key: "greenChili", nameHi: "हरी मिर्च", nameEn: "Green Chili", unit: "kg", category: "perishable", price: 80 },
    { key: "semolina", nameHi: "सूजी", nameEn: "Semolina", unit: "kg", category: "non-perishable", price: 40 },
    { key: "chaatMasala", nameHi: "चाट मसाला", nameEn: "Chaat Masala", unit: "g", category: "non-perishable", price: 300 },
    { key: "oil", nameHi: "तेल", nameEn: "Oil", unit: "L", category: "non-perishable", price: 120 },
  ];

  const perishableItems = bundleItems.filter(item => item.category === "perishable");
  const nonPerishableItems = bundleItems.filter(item => item.category === "non-perishable");

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => setLocation("/vendor-dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-neutral-800">
              {t("aiSmartBundle")}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Recommendation Header */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-blue-600">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-3 mr-4">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t("aiSmartBundle")}</h2>
                <p className="text-neutral-600 text-sm font-normal">{t("monthlyMaterials")}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                🤖 Based on your Chaat Stall type and market analysis, we've recommended the optimal quantities for monthly operations. Adjust quantities as needed for your specific requirements.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bundle Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Perishables */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Calendar className="mr-2 h-5 w-5" />
                {t("perishablesWeekly")}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-green-50">
              <div className="space-y-4">
                {perishableItems.map((item) => (
                  <div key={item.key} className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-semibold text-green-800">{item.nameHi}</h4>
                        <p className="text-sm text-green-600">₹{item.price}/{item.unit}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Weekly</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Quantity:</span>
                      <div className="flex items-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 rounded-full bg-green-200 text-green-800 hover:bg-green-300 border-green-300"
                          onClick={() => adjustQuantity(item.key, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 font-medium min-w-[60px] text-center">
                          {quantities[item.key]} {item.unit}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 rounded-full bg-green-200 text-green-800 hover:bg-green-300 border-green-300"
                          onClick={() => adjustQuantity(item.key, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="text-sm font-medium text-green-800">
                        Subtotal: ₹{(item.price * quantities[item.key]).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Non-Perishables */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-800">
                <Package className="mr-2 h-5 w-5" />
                {t("nonPerishablesMonthly")}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-amber-50">
              <div className="space-y-4">
                {nonPerishableItems.map((item) => (
                  <div key={item.key} className="bg-white rounded-lg p-4 border border-amber-200">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-semibold text-amber-800">{item.nameHi}</h4>
                        <p className="text-sm text-amber-600">
                          ₹{item.price}/{item.unit === "g" ? "kg" : item.unit}
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">Monthly</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Quantity:</span>
                      <div className="flex items-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 hover:bg-amber-300 border-amber-300"
                          onClick={() => adjustQuantity(item.key, item.unit === "g" ? -100 : -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 font-medium min-w-[60px] text-center">
                          {quantities[item.key]} {item.unit}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 hover:bg-amber-300 border-amber-300"
                          onClick={() => adjustQuantity(item.key, item.unit === "g" ? 100 : 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-amber-200">
                      <p className="text-sm font-medium text-amber-800">
                        Subtotal: ₹{(item.price * (item.unit === "g" ? quantities[item.key] / 1000 : quantities[item.key])).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Total and Actions */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                  {t("totalEstimatedCost")}
                </h3>
                <p className="text-3xl font-bold text-primary">
                  ₹{calculateTotal().toFixed(2)}
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  Per month (including weekly deliveries)
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation("/vendor-dashboard")}
                  className="w-full sm:w-auto"
                >
                  {t("cancel")}
                </Button>
                <Button 
                  onClick={handleSaveBundle}
                  className="bg-primary hover:bg-emerald-600 w-full sm:w-auto"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t("customizeBundle")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Schedule Info */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Delivery Schedule</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700">Perishables:</span>
                <p className="text-blue-600">Every Monday (Weekly)</p>
              </div>
              <div>
                <span className="font-medium text-blue-700">Non-Perishables:</span>
                <p className="text-blue-600">1st of every month (Monthly)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NotificationToast
        show={toast.show}
        message={toast.message}
        onHide={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}
