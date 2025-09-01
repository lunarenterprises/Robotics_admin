// src/Authcontext/Authcontext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { User, AuthContextType } from "../types";

const API_BASE = "https://lunarsenterprises.com:7001/robotics";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const [loading, setLoading] = useState(true); // ✅ new

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // ✅ finish loading
  }, []);

  // 🔹 LOGIN
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_BASE}/login`, { email, password });
      if (res.data.result) {
        const loggedUser: User = {
          id: res.data.user?.id || "1",
          email: res.data.user?.email || email,
          name: res.data.user?.name || "Admin",
        };
        setUser(loggedUser);
        localStorage.setItem("adminUser", JSON.stringify(loggedUser));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("adminUser");
  };

  // 🔹 FORGOT PASSWORD
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_BASE}/forgotpassword`, { email });
      if (res.data.result) {
        setResetEmail(email);
        setOtpSent(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Forgot Password failed:", err);
      return false;
    }
  };

  // 🔹 VERIFY OTP
  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_BASE}/verify-otp`, {
        email: resetEmail,
        otp,
      });
      return res.data.result;
    } catch (err) {
      console.error("OTP Verification failed:", err);
      return false;
    }
  };

  // 🔹 RESET PASSWORD
  const resetPassword = async (
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean> => {
    if (newPassword !== confirmPassword) return false;
    try {
      const res = await axios.post(`${API_BASE}/change/password`, {
        email: resetEmail,
        password: newPassword,
      });
      if (res.data.result) {
        setResetEmail("");
        setOtpSent(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Reset Password failed:", err);
      return false;
    }
  };

  // 🔹 CHANGE PASSWORD (when logged in)
  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_BASE}/change/password`, {
        email: user?.email,
        password: newPassword,
        oldPassword,
      });
      return res.data.success;
    } catch (err) {
      console.error("Change Password failed:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        forgotPassword,
        changePassword,
        verifyOTP,
        resetPassword,
        resetEmail,
        otpSent,
      }}
    >
      {/* {children} */}
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
