import React, { createContext, useContext, useState, useCallback } from "react";
import api from "@/lib/axios";
import {
  AuthState,
  LoginData,
  RegisterUserData,
  RegisterPartnerData
} from "@/types";

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
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    user: null,
    partner: null
  });

  // USER LOGIN
  const loginUser = useCallback(async (data: LoginData) => {
    const res = await api.post("/api/auth/user/login", data);

    setState({
      isAuthenticated: true,
      role: "user",
      user: res.data.user,
      partner: null
    });
  }, []);

  // FOOD PARTNER LOGIN
  const loginPartner = useCallback(async (data: LoginData) => {
    const res = await api.post("/api/auth/food-partner/login", data);

    setState({
      isAuthenticated: true,
      role: "foodPartner",
      user: null,
      partner: res.data.foodPartner
    });
  }, []);

  // USER REGISTER
  const registerUser = useCallback(async (data: RegisterUserData) => {
    const res = await api.post("/api/auth/user/register", data);

    setState({
      isAuthenticated: true,
      role: "user",
      user: res.data.user,
      partner: null
    });
  }, []);

  // FOOD PARTNER REGISTER
  const registerPartner = useCallback(async (data: RegisterPartnerData) => {
    const res = await api.post("/api/auth/food-partner/register", data);

    setState({
      isAuthenticated: true,
      role: "foodPartner",
      user: null,
      partner: res.data.foodPartner
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    try {
      if (state.role === "user") {
        await api.get("/api/auth/user/logout");
      } else if (state.role === "foodPartner") {
        await api.get("/api/auth/food-partner/logout");
      }
    } finally {
      setState({
        isAuthenticated: false,
        role: null,
        user: null,
        partner: null
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
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
