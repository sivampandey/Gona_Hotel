import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { initialSeedData } from '../data/seedData';
import { apiService, checkBackendHealth } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBackendConnected: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  toggleWishlist: (itemId: string, type: 'rooms' | 'food') => void;
  isWishlisted: (itemId: string, type: 'rooms' | 'food') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gona_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    const defaultGuest = initialSeedData.users[1];
    return {
      id: defaultGuest.id,
      name: defaultGuest.name,
      email: defaultGuest.email,
      phone: defaultGuest.phone,
      role: 'user',
      avatar: defaultGuest.avatar,
      wishlist: defaultGuest.wishlist
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('gona_token') || 'mock_jwt_token_guest_2026';
  });

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  useEffect(() => {
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

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await apiService.login(email, password || 'admin123');
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        setIsBackendConnected(true);
        return true;
      }
    } catch (err) {
      // Backend fallback for local demo
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
      return true;
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
    return true;
  };

  const register = async (name: string, email: string, password?: string, phone?: string): Promise<boolean> => {
    try {
      const res = await apiService.register(name, email, password || 'guest123', phone);
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        setIsBackendConnected(true);
        return true;
      }
    } catch (err) {
      // Fallback
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
    return true;
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
