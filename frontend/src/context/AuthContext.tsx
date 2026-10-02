import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, UserRole } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  demoLogin: (role: 'patient' | 'doctor') => Promise<void>;
  registerPatient: (data: any) => Promise<void>;
  registerDoctor: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isPatient: boolean;
  isDoctor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('glucoguard_token');
    const savedUser = localStorage.getItem('glucoguard_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('glucoguard_token');
        localStorage.removeItem('glucoguard_user');
      }
    }
    setIsLoading(false);
  }, []);

  const saveAuth = (authData: AuthResponse) => {
    setUser(authData);
    setToken(authData.access_token);
    localStorage.setItem('glucoguard_token', authData.access_token);
    localStorage.setItem('glucoguard_user', JSON.stringify(authData));
  };

  const login = async (email: string, pass: string) => {
    const data = await authAPI.login(email, pass);
    saveAuth(data);
  };

  const demoLogin = async (role: 'patient' | 'doctor') => {
    const data = await authAPI.demoLogin(role);
    saveAuth(data);
  };

  const registerPatient = async (patientData: any) => {
    const data = await authAPI.registerPatient(patientData);
    saveAuth(data);
  };

  const registerDoctor = async (doctorData: any) => {
    const data = await authAPI.registerDoctor(doctorData);
    saveAuth(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('glucoguard_token');
    localStorage.removeItem('glucoguard_user');
  };

  const isAuthenticated = !!token && !!user;
  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        demoLogin,
        registerPatient,
        registerDoctor,
        logout,
        isAuthenticated,
        isPatient,
        isDoctor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
