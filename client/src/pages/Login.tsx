import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { NotificationToast } from "@/components/NotificationToast";

export default function Login() {
  const { t } = useLanguage();
  const { login, verifyOTP } = useAuth();
  const [, setLocation] = useLocation();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setIsLoading(true);
    const result = await login(phoneNumber);
    setIsLoading(false);

    if (result.success) {
      if (result.isTestNumber) {
        setToast({ show: true, message: result.message });
        setTimeout(() => setLocation("/onboarding"), 1500);
      } else {
        setStep("otp");
        setToast({ show: true, message: result.message });
      }
    } else {
      setToast({ show: true, message: result.message });
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    const result = await verifyOTP(phoneNumber, otp);
    setIsLoading(false);

    if (result.success) {
      setToast({ show: true, message: t("success") });
      setTimeout(() => setLocation("/onboarding"), 1500);
    } else {
      setToast({ show: true, message: "Invalid OTP" });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            {t("quickLogin")}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <Label htmlFor="phone">{t("mobileNumber")}</Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-3 text-neutral-500">+91</span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="1122334455"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-12"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {t("testNumbers")}
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !phoneNumber}
              >
                {isLoading ? t("loading") : t("sendOTP")}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="mt-2"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  OTP sent to +91{phoneNumber}
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !otp}
                >
                  {isLoading ? t("loading") : t("verifyOTP")}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep("phone")}
                >
                  {t("back")}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <NotificationToast
        show={toast.show}
        message={toast.message}
        onHide={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}
