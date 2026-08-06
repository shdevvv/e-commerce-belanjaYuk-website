import { api } from './api';
import type { ApiResponse, Transaction, PaymentMethod } from '../types';

export const orderService = {
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    const res = await api.get<ApiResponse<PaymentMethod[]>>('/orders/payment-methods');
    return res.data;
  },

  async checkout(idPayment: string): Promise<ApiResponse<Transaction>> {
    const res = await api.post<ApiResponse<Transaction>>('/orders/checkout', { idPayment });
    return res.data;
  },

  async getOrders(): Promise<ApiResponse<Transaction[]>> {
    const res = await api.get<ApiResponse<Transaction[]>>('/orders');
    return res.data;
  },
};
