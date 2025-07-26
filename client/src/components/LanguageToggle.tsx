import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "hi" ? "en" : "hi");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 bg-white shadow-lg border border-neutral-200"
    >
      <Languages className="h-4 w-4 mr-1" />
      <span className="text-sm font-medium">
        {language === "hi" ? "EN" : "हिं"}
      </span>
    </Button>
  );
}
