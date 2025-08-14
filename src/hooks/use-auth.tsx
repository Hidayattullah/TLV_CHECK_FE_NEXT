
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Member } from '@/lib/api/types';
import { getMemberById } from '@/lib/repository_mock/members';

interface AuthContextType {
  user: Member | null;
  isLoading: boolean;
  login: (userId: string) => void;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'loggedInUserId';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const userData = await getMemberById(userId);
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch logged in user data", error);
      // If user fetch fails (e.g., user deleted), log them out
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const refetchUser = useCallback(() => {
    const storedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUserId) {
        fetchUser(storedUserId);
    }
  }, [fetchUser]);

  useEffect(() => {
    const storedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUserId) {
      fetchUser(storedUserId);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = (userId: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, userId);
    fetchUser(userId);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
