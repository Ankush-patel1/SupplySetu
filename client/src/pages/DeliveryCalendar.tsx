import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Package, Truck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

export default function DeliveryCalendar() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!user) {
    setLocation("/login");
    return null;
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthNamesHindi = [
    "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayNamesHindi = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  // Mock delivery data
  const deliveries = {
    3: [{ type: "perishable", status: "confirmed", supplier: "राम सप्लायर्स" }],
    10: [{ type: "perishable", status: "confirmed", supplier: "राम सप्लायर्स" }],
    15: [{ type: "non-perishable", status: "pending", supplier: "श्याम स्टोर्स" }],
    17: [{ type: "perishable", status: "confirmed", supplier: "राम सप्लायर्स" }],
    24: [{ type: "perishable", status: "confirmed", supplier: "राम सप्लायर्स" }],
    31: [{ type: "perishable", status: "in-transit", supplier: "राम सप्लायर्स" }],
  };

  const getDeliveryForDay = (day: number) => {
    return deliveries[day as keyof typeof deliveries] || [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-neutral-100 text-neutral-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "perishable" ? "🥬" : "📦";
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => setLocation(user.role === "vendor" ? "/vendor-dashboard" : "/supplier-dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-neutral-800">
              {t("deliveryCalendar")}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Header */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-6 w-6 text-primary" />
                <span>
                  {monthNamesHindi[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Legend */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Delivery Types:</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <span className="mr-2">🥬</span>
                <span>Perishables (Weekly)</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📦</span>
                <span>Non-Perishables (Monthly)</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm mt-3">
              <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
              <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
              <Badge className="bg-neutral-100 text-neutral-800">Delivered</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNamesHindi.map((day, index) => (
                <div key={index} className="text-center font-semibold text-neutral-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before the first day of month */}
              {Array.from({ length: firstDay }, (_, index) => (
                <div key={`empty-${index}`} className="h-24 md:h-32"></div>
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const deliveriesForDay = getDeliveryForDay(day);
                const isToday = new Date().getDate() === day && 
                               new Date().getMonth() === currentDate.getMonth() && 
                               new Date().getFullYear() === currentDate.getFullYear();

                return (
                  <div
                    key={day}
                    className={`h-24 md:h-32 border border-neutral-200 rounded-lg p-2 ${
                      isToday ? 'bg-primary/10 border-primary' : 'bg-white'
                    }`}
                  >
                    <div className={`font-semibold text-sm mb-1 ${
                      isToday ? 'text-primary' : 'text-neutral-800'
                    }`}>
                      {day}
                    </div>
                    
                    <div className="space-y-1">
                      {deliveriesForDay.map((delivery, deliveryIndex) => (
                        <div
                          key={deliveryIndex}
                          className="text-xs p-1 rounded flex items-center gap-1"
                        >
                          <span>{getTypeIcon(delivery.type)}</span>
                          <Badge className={`${getStatusColor(delivery.status)} text-xs px-1 py-0`}>
                            {delivery.status === "confirmed" ? "✓" : 
                             delivery.status === "pending" ? "⏳" : 
                             delivery.status === "in-transit" ? "🚛" : "✅"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deliveries */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5 text-primary" />
              Upcoming Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🥬</span>
                  <div>
                    <h4 className="font-semibold text-green-800">Tomorrow - Vegetables</h4>
                    <p className="text-sm text-green-600">राम सप्लायर्स</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📦</span>
                  <div>
                    <h4 className="font-semibold text-amber-800">15th - Spices & Grains</h4>
                    <p className="text-sm text-amber-600">श्याम स्टोर्स</p>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🥬</span>
                  <div>
                    <h4 className="font-semibold text-blue-800">31st - Fresh Produce</h4>
                    <p className="text-sm text-blue-600">राम सप्लायर्स</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
