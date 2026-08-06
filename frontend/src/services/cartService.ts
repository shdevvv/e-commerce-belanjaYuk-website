import { api } from './api';
import type { ApiResponse, CartSummary } from '../types';

export const cartService = {
  async getCart(): Promise<ApiResponse<CartSummary>> {
    const res = await api.get<ApiResponse<CartSummary>>('/cart');
    return res.data;
  },

  async addToCart(idProduct: string, qty: number = 1): Promise<ApiResponse<CartSummary>> {
    const res = await api.post<ApiResponse<CartSummary>>('/cart/items', { idProduct, qty });
    return res.data;
  },

  async updateQuantity(idBuyerCart: string, qty: number): Promise<ApiResponse<CartSummary>> {
    const res = await api.put<ApiResponse<CartSummary>>(`/cart/items/${idBuyerCart}`, { qty });
    return res.data;
  },

  async removeItem(idBuyerCart: string): Promise<ApiResponse<CartSummary>> {
    const res = await api.delete<ApiResponse<CartSummary>>(`/cart/items/${idBuyerCart}`);
    return res.data;
  },

  async clearCart(): Promise<ApiResponse<boolean>> {
    const res = await api.delete<ApiResponse<boolean>>('/cart');
    return res.data;
  },
};
