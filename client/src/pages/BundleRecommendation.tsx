import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Clock, Truck, Plus, Minus, ShoppingCart, TrendingUp, Star, Brain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { NotificationToast } from "@/components/NotificationToast";
import { generateSmartBundles, getSeasonalBundles, BundleRecommendation as AIBundleRecommendation } from "@/lib/aiServices";

export default function BundleRecommendation() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [toast, setToast] = useState({ show: false, message: "" });
  const [recommendations, setRecommendations] = useState<AIBundleRecommendation[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<AIBundleRecommendation | null>(null);
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  if (!user) {
    setLocation("/login");
    return null;
  }

  useEffect(() => {
    // Load AI recommendations based on user's stall type
    const loadRecommendations = async () => {
      setIsLoading(true);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the user's stall type from localStorage or API
      const stallType = localStorage.getItem('selectedStallType') || 'chaat';
      
      // Generate smart bundles
      const smartBundles = generateSmartBundles(stallType);
      const seasonalBundles = getSeasonalBundles(stallType, 'winter'); // Current season
      
      // Combine and deduplicate
      const allBundles = [...smartBundles, ...seasonalBundles.slice(0, 1)];
      setRecommendations(allBundles);
      setIsLoading(false);
    };

    loadRecommendations();
  }, []);

  const adjustQuantity = (productId: string, delta: number) => {
    setCustomQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta)
    }));
  };

  const getCustomTotal = (bundle: AIBundleRecommendation) => {
    if (!selectedBundle || selectedBundle.id !== bundle.id) return bundle.totalPrice;
    
    return bundle.products.reduce((total, product) => {
      const customQty = customQuantities[product.id] || product.quantity;
      const unitPrice = product.estimatedPrice / product.quantity;
      return total + (customQty * unitPrice);
    }, 0);
  };

  const handleSelectBundle = (bundle: AIBundleRecommendation) => {
    setSelectedBundle(bundle);
    // Initialize custom quantities with default values
    const initialQuantities: Record<string, number> = {};
    bundle.products.forEach(product => {
      initialQuantities[product.id] = product.quantity;
    });
    setCustomQuantities(initialQuantities);
  };

  const handleOrderBundle = (bundle: AIBundleRecommendation) => {
    setToast({ 
      show: true, 
      message: `बंडल "${bundle.nameHindi}" ऑर्डर किया गया! आपका आर्डर जल्द ही प्रोसेस होगा।` 
    });
    
    // Here you would normally send the order to the backend
    setTimeout(() => {
      setLocation("/vendor-dashboard");
    }, 2000);
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      daily: 'bg-blue-100 text-blue-800',
      weekly: 'bg-green-100 text-green-800',
      monthly: 'bg-amber-100 text-amber-800'
    };
    
    const labels = {
      daily: 'रोज़ाना',
      weekly: 'साप्ताहिक',
      monthly: 'मासिक'
    };
    
    return (
      <Badge className={colors[frequency as keyof typeof colors]}>
        <Clock className="h-3 w-3 mr-1" />
        {labels[frequency as keyof typeof labels]}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    return category === 'perishable' ? (
      <Badge className="bg-red-100 text-red-800 text-xs">
        <Truck className="h-2 w-2 mr-1" />
        जल्दी खराब
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 text-xs">
        लंबे समय तक
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
        <div className="bg-white shadow-sm border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/vendor-dashboard")}
                  className="mr-4"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-neutral-800">
                  स्मार्ट बंडल सिफारिशें
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-neutral-600 mb-2">
              AI आपके लिए सबसे अच्छे बंडल ढूंढ रहा है...
            </h3>
            <p className="text-neutral-500">
              आपके स्टॉल टाइप और बिज़नेस की ज़रूरतों के आधार पर
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => setLocation("/vendor-dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-neutral-800">
                स्मार्ट बंडल सिफारिशें
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-sm text-neutral-600">AI द्वारा संचालित</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Insights Banner */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Brain className="h-8 w-8 text-blue-600 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">AI स्मार्ट रिकमेंडेशन</h3>
                <p className="text-blue-700 text-sm mb-3">
                  हमारा AI आपके स्टॉल टाइप, मौसम, और बाज़ार के ट्रेंड्स को देखकर ये बंडल सुझा रहा है। 
                  ये बंडल आपकी बिक्री बढ़ाने और कॉस्ट कम करने में मदद करेंगे।
                </p>
                <div className="flex items-center gap-4 text-xs text-blue-600">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    30% ज़्यादा प्रॉफिट
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    बेस्ट सेलिंग आइटम्स
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ऑप्टिमाइज़्ड डिलिवरी
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bundle Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {recommendations.map((bundle) => (
            <Card key={bundle.id} className="shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{bundle.nameHindi}</CardTitle>
                    <p className="text-emerald-100 text-sm">{bundle.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">₹{Math.round(getCustomTotal(bundle))}</div>
                    {getFrequencyBadge(bundle.deliveryFrequency)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* AI Reasoning */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <h4 className="font-semibold text-amber-800 text-sm mb-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI सुझाव:
                  </h4>
                  <p className="text-amber-700 text-sm">{bundle.reasoningHindi}</p>
                </div>
                
                {/* Products List */}
                <div className="space-y-3 mb-6">
                  {bundle.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-neutral-800">{product.nameHindi}</span>
                          {getCategoryBadge(product.category)}
                        </div>
                        <p className="text-sm text-neutral-600">{product.name}</p>
                        <p className="text-xs text-neutral-500">
                          ₹{product.estimatedPrice} / {product.quantity} {product.unit}
                        </p>
                      </div>
                      
                      {/* Quantity Adjuster (only for selected bundle) */}
                      {selectedBundle?.id === bundle.id && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustQuantity(product.id, -1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {customQuantities[product.id] || product.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustQuantity(product.id, 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedBundle?.id === bundle.id ? (
                    <>
                      <Button
                        onClick={() => setSelectedBundle(null)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleOrderBundle(bundle)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        ऑर्डर करें
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleSelectBundle(bundle)}
                        variant="outline"
                        className="flex-1"
                      >
                        कस्टमाइज़ करें
                      </Button>
                      <Button
                        onClick={() => handleOrderBundle(bundle)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        ऑर्डर करें
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {recommendations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Brain className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                कोई सिफारिश उपलब्ध नहीं
              </h3>
              <p className="text-neutral-500 mb-6">
                अपनी प्रोफाइल को कंप्लीट करें ताकि AI बेहतर सुझाव दे सके।
              </p>
              <Button onClick={() => setLocation("/onboarding")}>
                प्रोफाइल अपडेट करें
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <NotificationToast
        show={toast.show}
        message={toast.message}
        onHide={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}