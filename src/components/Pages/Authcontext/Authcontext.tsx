import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo login - in production, this would be an API call
    if (email === 'admin@example.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User'
      };
      setUser(adminUser);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Demo forgot password - in production, this would send OTP to email
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'admin@example.com') {
      setResetEmail(email);
      setOtpSent(true);
      return true;
    }
    return false;
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    // Demo OTP verification - in production, this would verify with backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    return otp === '123456'; // Demo OTP
  };

  const resetPassword = async (newPassword: string, confirmPassword: string): Promise<boolean> => {
    // Demo password reset - in production, this would update password in backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (newPassword === confirmPassword && newPassword.length >= 6) {
      setResetEmail('');
      setOtpSent(false);
      return true;
    }
    return false;
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    // Demo change password - in production, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return oldPassword === 'admin123' && newPassword.length >= 6;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      forgotPassword, 
      changePassword, 
      verifyOTP, 
      resetPassword, 
      resetEmail, 
      otpSent 
    }}>
      {children}
    </AuthContext.Provider>
  );
};