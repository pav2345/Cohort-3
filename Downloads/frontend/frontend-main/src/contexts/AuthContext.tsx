import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import { AuthState, User, FoodPartner, LoginData, RegisterUserData, RegisterPartnerData, UserRole } from '@/types';

interface AuthContextType extends AuthState {
  loginUser: (data: LoginData) => Promise<void>;
  loginPartner: (data: LoginData) => Promise<void>;
  registerUser: (data: RegisterUserData) => Promise<void>;
  registerPartner: (data: RegisterPartnerData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    user: null,
    partner: null,
  });

  const loginUser = useCallback(async (data: LoginData) => {
    const response = await api.post('/api/auth/user/login', data);
    setState({
      isAuthenticated: true,
      role: 'user',
      user: response.data.user,
      partner: null,
    });
  }, []);

  const loginPartner = useCallback(async (data: LoginData) => {
    const response = await api.post('/api/auth/food-partner/login', data);
    setState({
      isAuthenticated: true,
      role: 'foodPartner',
      user: null,
      partner: response.data.partner,
      isLoading: false,
    });
  }, []);

  const registerUser = useCallback(async (data: RegisterUserData) => {
    const response = await api.post('/api/auth/user/register', data);
    setState({
      isAuthenticated: true,
      role: 'user',
      user: response.data.user,
      partner: null,
      isLoading: false,
    });
  }, []);

  const registerPartner = useCallback(async (data: RegisterPartnerData) => {
    const response = await api.post('/api/auth/food-partner/register', data);
    setState({
      isAuthenticated: true,
      role: 'foodPartner',
      user: null,
      partner: response.data.partner,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    const role = state.role;
    try {
      if (role === 'user') {
        await api.get('/api/auth/user/logout');
      } else if (role === 'foodPartner') {
        await api.get('/api/auth/food-partner/logout');
      }
    } finally {
      setState({
        isAuthenticated: false,
        role: null,
        user: null,
        partner: null,
        isLoading: false,
      });
    }
  }, [state.role]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        loginPartner,
        registerUser,
        registerPartner,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
