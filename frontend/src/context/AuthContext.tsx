import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
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
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('gona_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('gona_token') || null;
  });

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  useEffect(() => {
    checkBackendHealth().then((connected) => {
      setIsBackendConnected(connected);
    });
  }, []);

  // Fetch real profile on load if token exists
  useEffect(() => {
    if (token) {
      apiService.getProfile().then(res => {
        if (res.status === 200 && res.data?.id) {
          setUser(res.data);
          setIsBackendConnected(true);
        } else if (res.status === 401 || res.status === 403) {
          // Token expired or invalid
          setUser(null);
          setToken(null);
          localStorage.removeItem('gona_user');
          localStorage.removeItem('gona_token');
        }
      }).catch(() => {});
    }
  }, [token]);

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
      const res = await apiService.login(email, password || '');
      if ((res.status === 200 || res.status === 201) && res.data?.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        setIsBackendConnected(true);
        return { success: true, message: res.data.message || 'Login successful' };
      }
      return { 
        success: false, 
        message: res.data?.message || 'Invalid email or password' 
      };
    } catch (err: any) {
      return { 
        success: false, 
        message: 'Unable to connect to authentication server. Please try again later.' 
      };
    }
  };

  const register = async (name: string, email: string, password?: string, phone?: string): Promise<AuthResponse> => {
    try {
      const res = await apiService.register(name, email, password || '', phone);
      if ((res.status === 200 || res.status === 201) && res.data?.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        setIsBackendConnected(true);
        return { success: true, message: res.data.message || 'Registration successful' };
      }
      return { 
        success: false, 
        message: res.data?.message || 'Registration failed' 
      };
    } catch (err: any) {
      return { 
        success: false, 
        message: 'Unable to connect to authentication server. Please try again later.' 
      };
    }
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
