import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  login: (phoneNumber: string) => Promise<{ success: boolean; isTestNumber: boolean; message: string }>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<{ success: boolean }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("supplysetu_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("supplysetu_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (phoneNumber: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.isTestNumber) {
          setUser(data.user);
          localStorage.setItem("supplysetu_user", JSON.stringify(data.user));
        }
        return { success: true, isTestNumber: data.isTestNumber, message: data.message };
      }
      
      return { success: false, isTestNumber: false, message: data.message };
    } catch (error) {
      return { success: false, isTestNumber: false, message: "Login failed" };
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("supplysetu_user", JSON.stringify(data.user));
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("supplysetu_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, verifyOTP, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
