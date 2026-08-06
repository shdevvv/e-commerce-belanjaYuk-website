import { api } from './api';
import type { ApiResponse, AuthResponse } from '../types';

export interface RegisterPayload {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  dob?: string;
  genderName?: string;
  provinsi?: string;
  kotaKabupaten?: string;
  kecamatan?: string;
  kodePos?: string;
  alamatLengkap?: string;
}

export const authService = {
  async login(emailOrPhone: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { emailOrPhone, password });
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return res.data;
  },
};
