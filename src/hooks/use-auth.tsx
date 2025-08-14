
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Member } from '@/lib/api/types';
import { getMemberById } from '@/lib/repository_mock/members';

/**
 * @fileoverview Hook dan Provider untuk Manajemen Autentikasi Pengguna.
 *
 * File ini bertanggung jawab untuk:
 * - Membuat React Context untuk status autentikasi.
 * - Menyediakan AuthProvider yang mengelola sesi pengguna menggunakan JSON Web Token (JWT).
 * - Mengekspos hook `useAuth` untuk mengakses data pengguna dan fungsi autentikasi di seluruh aplikasi.
 * - Menangani penyimpanan dan pengambilan token dari localStorage.
 * - Mendekode token untuk mendapatkan ID pengguna dan mengambil data pengguna terkait.
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

/**
 * Fungsi untuk mendekode payload dari sebuah JWT.
 * @param {string} token - JSON Web Token.
 * @returns {any | null} Payload yang telah didekode, atau null jika token tidak valid.
 */
const decodeJwtPayload = (token: string): { sub: string, [key: string]: any } | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Gagal mendekode JWT:", error);
    return null;
  }
};


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
   * Mengambil data pengguna dari server berdasarkan ID.
   * @param {string} userId - ID pengguna.
   * @returns {Promise<void>}
   */
  const fetchUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const userData = await getMemberById(userId);
      setUser(userData);
    } catch (error) {
      console.error("Gagal mengambil data pengguna yang login:", error);
      logout(); // Logout jika pengguna tidak ditemukan (misalnya, dihapus)
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Memuat ulang data pengguna saat ini. Berguna setelah profil diperbarui.
   */
  const refetchUser = useCallback(() => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (token) {
        const payload = decodeJwtPayload(token);
        if (payload && payload.sub) {
            fetchUser(payload.sub);
        }
    }
  }, [fetchUser]);

  /**
   * Efek untuk memeriksa sesi login saat komponen dimuat pertama kali.
   */
  useEffect(() => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload && payload.sub) {
        fetchUser(payload.sub);
      } else {
        // Token tidak valid atau tidak memiliki 'sub'
        logout();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  /**
   * Memulai sesi login pengguna.
   * Menyimpan token ke localStorage dan mengambil data pengguna.
   * @param {string} token - JSON Web Token yang diterima dari backend.
   */
  const login = (token: string) => {
    const payload = decodeJwtPayload(token);
    if (payload && payload.sub) {
      localStorage.setItem(AUTH_STORAGE_KEY, token);
      fetchUser(payload.sub);
    } else {
      console.error("Login gagal: Token JWT tidak valid atau tidak memiliki 'sub' (user ID).");
    }
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
