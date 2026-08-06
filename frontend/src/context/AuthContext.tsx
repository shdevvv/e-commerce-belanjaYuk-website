import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthResponse } from '../types';
import { authService } from '../services/authService';
import type { RegisterPayload } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const expiry = localStorage.getItem('belanjayuk_expiry');
    if (expiry && new Date().getTime() > parseInt(expiry, 10)) {
      localStorage.removeItem('belanjayuk_token');
      localStorage.removeItem('belanjayuk_user');
      localStorage.removeItem('belanjayuk_expiry');
      return null;
    }
    const saved = localStorage.getItem('belanjayuk_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('belanjayuk_token'));

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('belanjayuk_token');
      localStorage.removeItem('belanjayuk_user');
      localStorage.removeItem('belanjayuk_expiry');
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const handleAuthSuccess = (data: AuthResponse, rememberMe: boolean = false) => {
    const u: User = {
      idUser: data.idUser,
      userName: data.userName,
      emailOrPhone: data.emailOrPhone,
      fullName: data.fullName,
    };
    setUser(u);
    setToken(data.token);
    localStorage.setItem('belanjayuk_token', data.token);
    localStorage.setItem('belanjayuk_user', JSON.stringify(u));

    if (rememberMe) {
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      const expiryTimestamp = (new Date().getTime() + thirtyDaysMs).toString();
      localStorage.setItem('belanjayuk_expiry', expiryTimestamp);
    } else {
      localStorage.removeItem('belanjayuk_expiry');
    }
  };

  const login = async (emailOrPhone: string, password: string, rememberMe: boolean = false) => {
    try {
      const res = await authService.login(emailOrPhone, password);
      if (res.success && res.data) {
        handleAuthSuccess(res.data, rememberMe);
        return { success: true, message: res.message || 'Login berhasil' };
      }
      return { success: false, message: res.message || 'Login gagal' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Email atau nomor HP tidak terdaftar.',
      };
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const res = await authService.register(payload);
      if (res.success && res.data) {
        handleAuthSuccess(res.data, false);
        return { success: true, message: res.message || 'Registrasi berhasil' };
      }
      return { success: false, message: res.message || 'Registrasi gagal' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registrasi gagal. Coba lagi.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('belanjayuk_token');
    localStorage.removeItem('belanjayuk_user');
    localStorage.removeItem('belanjayuk_expiry');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
