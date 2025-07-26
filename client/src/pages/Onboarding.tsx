import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { StallType } from "@shared/schema";

export default function Onboarding() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"vendor" | "supplier">("vendor");
  const [businessName, setBusinessName] = useState("");
  const [stallType, setStallType] = useState("");
  const [location, setLocationValue] = useState("");

  const { data: stallTypes } = useQuery<StallType[]>({
    queryKey: ["/api/stall-types"],
    enabled: role === "vendor",
  });

  const createVendorMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/vendors", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      setLocation("/vendor-dashboard");
    },
  });

  const createSupplierMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/suppliers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      setLocation("/supplier-dashboard");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/users/${user?.id}`, data);
      return response.json();
    },
  });

  const handleRoleSelection = () => {
    setStep(2);
  };

  const handleComplete = async () => {
    if (!user) return;

    // Update user role and business name
    await updateUserMutation.mutateAsync({
      role,
      businessName,
    });

    if (role === "vendor") {
      await createVendorMutation.mutateAsync({
        userId: user.id,
        stallTypeId: stallType,
        location,
        isOnboarded: true,
      });
    } else {
      await createSupplierMutation.mutateAsync({
        userId: user.id,
        deliveryZones: [location],
        isVerified: false,
      });
    }
  };

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Welcome to SupplySetu
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Choose your role:</Label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(value: "vendor" | "supplier") => setRole(value)}
                  className="mt-3"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="vendor" id="vendor" />
                    <Label htmlFor="vendor" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">{t("vendor")}</div>
                        <div className="text-sm text-neutral-600">Street food seller</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="supplier" id="supplier" />
                    <Label htmlFor="supplier" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">{t("supplier")}</div>
                        <div className="text-sm text-neutral-600">Raw material provider</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button onClick={handleRoleSelection} className="w-full">
                {t("next")}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocationValue(e.target.value)}
                  placeholder="Enter your location"
                  className="mt-2"
                />
              </div>

              {role === "vendor" && stallTypes && (
                <div>
                  <Label className="text-base font-medium">{t("chooseStallType")}</Label>
                  <RadioGroup 
                    value={stallType} 
                    onValueChange={setStallType}
                    className="mt-3"
                  >
                    {stallTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={type.id} id={type.id} />
                        <Label htmlFor={type.id} className="flex-1 cursor-pointer">
                          <div>
                            <div className="font-medium">{type.nameHindi}</div>
                            <div className="text-sm text-neutral-600">{type.descriptionHindi}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  {t("back")}
                </Button>
                <Button 
                  onClick={handleComplete} 
                  className="flex-1"
                  disabled={!businessName || !location || (role === "vendor" && !stallType)}
                >
                  Complete Setup
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
