import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { initialSeedData } from '../data/seedData';
import { apiService, checkBackendHealth } from '../services/api';

export interface AuthResponse {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBackendConnected: boolean;
  login: (email: string, password?: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<AuthResponse>;
  logout: () => void;
  toggleWishlist: (itemId: string, type: 'rooms' | 'food') => void;
  isWishlisted: (itemId: string, type: 'rooms' | 'food') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start logged out by default on website load
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  useEffect(() => {
    // Clear any residual demo auto-login session on load
    localStorage.removeItem('gona_user');
    localStorage.removeItem('gona_token');
    checkBackendHealth().then((connected) => {
      setIsBackendConnected(connected);
    });
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('gona_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gona_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('gona_token', token);
    } else {
      localStorage.removeItem('gona_token');
    }
  }, [token]);

  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    try {
      const res = await apiService.login(email, password || 'admin123');
      if ((res.status === 200 || res.status === 201) && res.data?.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        setIsBackendConnected(true);
        return { success: true, message: res.data.message || 'Login successful' };
      }
      if (res.status >= 400 && res.data?.message) {
        return { success: false, message: res.data.message };
      }
    } catch (err: any) {
      console.warn('Backend server connection error, using local fallback:', err);
    }

    if (email.toLowerCase().includes('admin')) {
      const adminData = initialSeedData.users[0];
      const adminUser: User = {
        id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone,
        role: 'admin',
        avatar: adminData.avatar,
        wishlist: adminData.wishlist
      };
      setUser(adminUser);
      setToken('mock_jwt_token_admin_2026');
      return { success: true, message: 'Signed in as Admin (Local Mode)' };
    }

    const guestData = initialSeedData.users[1];
    const normalUser: User = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0].replace('.', ' '),
      email,
      phone: '+91 98765 00000',
      role: 'user',
      avatar: guestData.avatar,
      wishlist: { rooms: [], food: [] }
    };
    setUser(normalUser);
    setToken('mock_jwt_token_' + Date.now());
    return { success: true, message: 'Signed in successfully (Local Mode)' };
  };

  const register = async (name: string, email: string, password?: string, phone?: string): Promise<AuthResponse> => {
    try {
      const res = await apiService.register(name, email, password || 'guest123', phone);
      if ((res.status === 200 || res.status === 201) && res.data?.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        setIsBackendConnected(true);
        return { success: true, message: res.data.message || 'Registration successful' };
      }
      if (res.status >= 400 && res.data?.message) {
        return { success: false, message: res.data.message };
      }
    } catch (err: any) {
      console.warn('Backend server connection error, using local fallback:', err);
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      phone: phone || '+91 98765 43210',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      wishlist: { rooms: [], food: [] }
    };
    setUser(newUser);
    setToken('mock_jwt_token_' + Date.now());
    return { success: true, message: 'Registration successful (Local Mode)' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gona_user');
    localStorage.removeItem('gona_token');
  };

  const toggleWishlist = (itemId: string, type: 'rooms' | 'food') => {
    if (!user) return;
    const list = type === 'rooms' ? [...user.wishlist.rooms] : [...user.wishlist.food];
    const exists = list.includes(itemId);
    const updatedList = exists ? list.filter(id => id !== itemId) : [...list, itemId];

    const updatedUser = {
      ...user,
      wishlist: {
        ...user.wishlist,
        [type]: updatedList
      }
    };
    setUser(updatedUser);
  };

  const isWishlisted = (itemId: string, type: 'rooms' | 'food') => {
    if (!user) return false;
    return type === 'rooms' ? user.wishlist.rooms.includes(itemId) : user.wishlist.food.includes(itemId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isBackendConnected,
        login,
        register,
        logout,
        toggleWishlist,
        isWishlisted
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
