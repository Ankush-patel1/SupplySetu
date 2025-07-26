import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, PauseCircle, AlertTriangle, Bot, Plus, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Vendor, Bundle, Order, Complaint, DeliveryPause } from "@shared/schema";

export default function VendorDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "potatoes": 10,
    "onions": 5,
    "greenChili": 1,
    "semolina": 5,
    "chaatMasala": 500,
    "oil": 2,
  });

  const { data: vendor } = useQuery<Vendor>({
    queryKey: ["/api/vendors/user", user?.id],
    enabled: !!user?.id,
  });

  const { data: bundles } = useQuery<Bundle[]>({
    queryKey: ["/api/bundles/stall-type", vendor?.stallTypeId],
    enabled: !!vendor?.stallTypeId,
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders/vendor", vendor?.id],
    enabled: !!vendor?.id,
  });

  const { data: complaints } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints/vendor", vendor?.id],
    enabled: !!vendor?.id,
  });

  const { data: deliveryPause } = useQuery<DeliveryPause>({
    queryKey: ["/api/delivery-pauses/vendor", vendor?.id, "active"],
    enabled: !!vendor?.id,
  });

  if (!user || user.role !== "vendor") {
    setLocation("/login");
    return null;
  }

  const adjustQuantity = (product: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [product]: Math.max(0, (prev[product] || 0) + delta)
    }));
  };

  const bundleItems = [
    { key: "potatoes", nameHi: "आलू", nameEn: "Potatoes", unit: "kg", category: "perishable" },
    { key: "onions", nameHi: "प्याज", nameEn: "Onions", unit: "kg", category: "perishable" },
    { key: "greenChili", nameHi: "हरी मिर्च", nameEn: "Green Chili", unit: "kg", category: "perishable" },
    { key: "semolina", nameHi: "सूजी", nameEn: "Semolina", unit: "kg", category: "non-perishable" },
    { key: "chaatMasala", nameHi: "चाट मसाला", nameEn: "Chaat Masala", unit: "g", category: "non-perishable" },
    { key: "oil", nameHi: "तेल", nameEn: "Oil", unit: "L", category: "non-perishable" },
  ];

  const perishableItems = bundleItems.filter(item => item.category === "perishable");
  const nonPerishableItems = bundleItems.filter(item => item.category === "non-perishable");

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-neutral-800">
              {t("vendorDashboard")}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Smart Bundle Recommendation */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-3 mr-4">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{t("aiSmartBundle")}</h3>
                <p className="text-neutral-600 text-sm">{t("monthlyMaterials")}</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Perishables */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {t("perishablesWeekly")}
                </h4>
                <div className="space-y-3">
                  {perishableItems.map((item) => (
                    <div key={item.key} className="flex justify-between items-center">
                      <span className="text-green-800">
                        {item.nameHi}
                      </span>
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
                  ))}
                </div>
              </div>

              {/* Non-Perishables */}
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-4 flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  {t("nonPerishablesMonthly")}
                </h4>
                <div className="space-y-3">
                  {nonPerishableItems.map((item) => (
                    <div key={item.key} className="flex justify-between items-center">
                      <span className="text-amber-800">
                        {item.nameHi}
                      </span>
                      <div className="flex items-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 hover:bg-amber-300 border-amber-300"
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
                          className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 hover:bg-amber-300 border-amber-300"
                          onClick={() => adjustQuantity(item.key, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-neutral-800">
                {t("totalEstimatedCost")}{" "}
                <span className="text-primary">₹2,450</span>
              </span>
              <Button className="bg-primary hover:bg-emerald-600">
                {t("customizeBundle")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Delivery Calendar */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-3 mr-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <span>{t("deliveryCalendar")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-800">{t("tomorrow")}</div>
                    <div className="text-sm text-green-600">{t("vegetables")}</div>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    {t("confirmed")}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <div>
                    <div className="font-medium text-amber-800">15 जन</div>
                    <div className="text-sm text-amber-600">{t("spices")}</div>
                  </div>
                  <Badge className="bg-amber-600 text-white">
                    {t("pending")}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="link" 
                className="w-full mt-4 text-blue-600 hover:text-blue-700"
                onClick={() => setLocation("/calendar")}
              >
                {t("viewFullCalendar")}
              </Button>
            </CardContent>
          </Card>

          {/* Pause Delivery */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="bg-orange-100 rounded-lg p-3 mr-3">
                  <PauseCircle className="h-5 w-5 text-orange-600" />
                </div>
                <span>{t("pauseDelivery")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4 text-sm">
                {t("pauseDescription")}
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  {t("oneDay")}
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  {t("threeDays")}
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  {t("oneWeek")}
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm text-blue-600">
                  {t("customDuration")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Complaint Center */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="bg-red-100 rounded-lg p-3 mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <span>{t("complaintCenter")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4 text-sm">
                {t("reportDeliveryIssues")}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="text-sm text-red-800">#C001</span>
                  <Badge className="bg-red-200 text-red-800">
                    {t("open")}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm text-green-800">#C002</span>
                  <Badge className="bg-green-200 text-green-800">
                    {t("resolved")}
                  </Badge>
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-red-600 hover:bg-red-700"
                onClick={() => setLocation("/complaints")}
              >
                {t("newComplaint")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
