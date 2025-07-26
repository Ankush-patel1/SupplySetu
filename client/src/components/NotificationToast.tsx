import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationToastProps {
  show: boolean;
  message?: string;
  onHide: () => void;
}

export function NotificationToast({ show, message, onHide }: NotificationToastProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 mr-2" />
        <span>{message || t("successfullySaved")}</span>
        <button
          onClick={onHide}
          className="ml-4 text-white hover:text-neutral-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
