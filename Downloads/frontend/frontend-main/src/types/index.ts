export interface Food {
  _id: string;
  name: string;
  description: string;
  videoUrl: string;
  likes: number;
  saves: number;
  foodPartner: {
    _id: string;
    name: string;
  };
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
}

export interface FoodPartner {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactName?: string;
}

export type UserRole = 'user' | 'foodPartner' | null;

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  user: User | null;
  partner: FoodPartner | null;
}

export interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterPartnerData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  contactName: string;
}

export interface LoginData {
  email: string;
  password: string;
}
