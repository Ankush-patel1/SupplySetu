import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Supplier, Product, Order } from "@shared/schema";

export default function SupplierDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: supplier } = useQuery<Supplier>({
    queryKey: ["/api/suppliers/user", user?.id],
    enabled: !!user?.id,
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products/supplier", supplier?.id],
    enabled: !!supplier?.id,
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders/supplier", supplier?.id],
    enabled: !!supplier?.id,
  });

  if (!user || user.role !== "supplier") {
    setLocation("/login");
    return null;
  }

  // Mock product data for display
  const mockProducts = [
    {
      id: "1",
      name: "Potatoes",
      nameHindi: "आलू",
      price: "20.00",
      stockLevel: 100,
      unit: "kg",
      freshnessStatus: "fresh" as const,
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop"
    },
    {
      id: "2",
      name: "Green Chili",
      nameHindi: "हरी मिर्च",
      price: "80.00",
      stockLevel: 25,
      unit: "kg",
      freshnessStatus: "fresh" as const,
      imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop"
    },
    {
      id: "3",
      name: "Chaat Masala",
      nameHindi: "चाट मसाला",
      price: "150.00",
      stockLevel: 50,
      unit: "500g",
      freshnessStatus: "blurred" as const,
      imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop"
    }
  ];

  const getFreshnessColor = (status: string) => {
    switch (status) {
      case "fresh":
        return "bg-green-100 text-green-800";
      case "blurred":
        return "bg-amber-100 text-amber-800";
      case "low_quality":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getFreshnessIcon = (status: string) => {
    switch (status) {
      case "fresh":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "blurred":
      case "low_quality":
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-neutral-800">
              {t("supplierDashboard")}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Management */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t("productManagement")}</CardTitle>
              <Button 
                className="bg-primary hover:bg-emerald-600"
                onClick={() => setLocation("/products/add")}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("addProduct")}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <Card key={product.id} className="border border-neutral-200">
                  <CardContent className="p-6">
                    <img 
                      src={product.imageUrl} 
                      alt={product.nameHindi}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-neutral-800">
                        {product.nameHindi}
                      </h5>
                      <Badge 
                        className={`${getFreshnessColor(product.freshnessStatus)} flex items-center text-xs font-medium`}
                      >
                        {getFreshnessIcon(product.freshnessStatus)}
                        {product.freshnessStatus === "fresh" ? t("fresh") : 
                         product.freshnessStatus === "blurred" ? t("blurred") : 
                         t("lowQuality")}
                      </Badge>
                    </div>
                    <p className="text-neutral-600 text-sm mb-3">₹{product.price}/{product.unit}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-500">
                        {t("stock")}: {product.stockLevel}{product.unit}
                      </span>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders and Delivery Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Incoming Orders */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t("incomingOrders")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-neutral-800">राज चाट स्टॉल</h5>
                    <Badge className="bg-blue-100 text-blue-800">
                      {t("new")}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    आलू 10kg, प्याज 5kg
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary">₹350</span>
                    <div className="space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        {t("accept")}
                      </Button>
                      <Button size="sm" variant="destructive">
                        {t("decline")}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-neutral-800">सुरेश जूस कॉर्नर</h5>
                    <Badge className="bg-amber-100 text-amber-800">
                      {t("pending")}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    संतरे 25kg, नींबू 10kg
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary">₹850</span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      {t("update")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Schedule */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t("deliverySchedule")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-green-800">{t("today")}</span>
                    <span className="text-sm text-green-600">3 {t("deliveries")}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">09:00 AM</span> - राज चाट स्टॉल
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">11:30 AM</span> - सुमन डोसा हाउस
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">02:00 PM</span> - अमित फास्ट फूड
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-800">कल</span>
                    <span className="text-sm text-blue-600">5 {t("deliveries")}</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    {t("clickToViewSchedule")}
                  </p>
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
        </div>
      </div>
    </div>
  );
}
