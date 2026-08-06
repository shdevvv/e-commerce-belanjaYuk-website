import { api } from './api';
import type { ApiResponse } from '../types';

export interface SellerDto {
  idUserSeller: string;
  idUser: string;
  sellerName: string;
  sellerDesc: string;
  address: string;
  sellerCode: string;
  phoneNumber: string;
  isActive: boolean;
  dateIn: string;
}

export interface RegisterSellerPayload {
  sellerName: string;
  sellerDesc?: string;
  address?: string;
  phoneNumber: string;
}

export const sellerService = {
  async getMySeller(): Promise<ApiResponse<SellerDto | null>> {
    const res = await api.get<ApiResponse<SellerDto | null>>('/sellers/me');
    return res.data;
  },

  async registerSeller(payload: RegisterSellerPayload): Promise<ApiResponse<SellerDto>> {
    const res = await api.post<ApiResponse<SellerDto>>('/sellers/register', payload);
    return res.data;
  },
};
