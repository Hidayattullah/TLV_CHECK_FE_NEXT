
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Member } from '@/lib/api/types';
import { getProfile } from '@/lib/repository/members'; // Updated to use getProfile

/**
 * @fileoverview Hook dan Provider untuk Manajemen Autentikasi Pengguna.
 *
 * File ini bertanggung jawab untuk:
 * - Membuat React Context untuk status autentikasi.
 * - Menyediakan AuthProvider yang mengelola sesi pengguna menggunakan JSON Web Token (JWT).
 * - Mengekspos hook `useAuth` untuk mengakses data pengguna dan fungsi autentikasi di seluruh aplikasi.
 * - Menangani penyimpanan dan pengambilan token dari localStorage.
 * - Mengambil data profil pengguna yang sedang login dari backend.
 */

/**
 * @typedef {object} AuthContextType
 * @property {Member | null} user - Objek data pengguna yang sedang login, atau null jika tidak ada.
 * @property {boolean} isLoading - Status loading untuk menandakan proses pengambilan data pengguna.
 * @property {(token: string) => void} login - Fungsi untuk memulai sesi login dengan menyimpan JWT.
 * @property {() => void} logout - Fungsi untuk mengakhiri sesi login dengan menghapus JWT.
 * @property {() => void} refetchUser - Fungsi untuk memuat ulang data pengguna dari server.
 */
interface AuthContextType {
  user: Member | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refetchUser: () => void;
}

/**
 * Kunci yang digunakan untuk menyimpan JWT di localStorage.
 * @const {string}
 */
const AUTH_STORAGE_KEY = 'authToken';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Komponen Provider yang membungkus aplikasi dan menyediakan state autentikasi.
 * @param {{ children: React.ReactNode }} props - Props komponen.
 * @returns {React.ReactElement}
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Mengambil data profil pengguna yang sedang terautentikasi dari server.
   * @returns {Promise<void>}
   */
  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!token) {
        setIsLoading(false);
        return;
    }
    
    try {
      const userData = await getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Gagal mengambil data profil:", error);
      logout(); // Logout jika token tidak valid atau ada error
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Memuat ulang data pengguna saat ini. Berguna setelah profil diperbarui.
   */
  const refetchUser = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  /**
   * Efek untuk memeriksa sesi login saat komponen dimuat pertama kali.
   */
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /**
   * Memulai sesi login pengguna.
   * Menyimpan token ke localStorage dan mengambil data pengguna.
   * @param {string} token - JSON Web Token yang diterima dari backend.
   */
  const login = (token: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    fetchUser();
  };

  /**
   * Mengakhiri sesi login pengguna.
   * Menghapus token dari localStorage dan mereset state pengguna.
   */
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

/**
 * Hook kustom untuk menggunakan konteks autentikasi.
 * @returns {AuthContextType} Konteks autentikasi.
 * @throws {Error} Jika digunakan di luar AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
