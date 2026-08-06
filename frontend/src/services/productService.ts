import { api } from './api';
import type { ApiResponse, Product } from '../types';

export const productService = {
  async getProducts(search?: string, category?: string): Promise<ApiResponse<Product[]>> {
    const params: Record<string, string> = {};
    if (search) params.q = search;
    if (category) params.category = category;

    const res = await api.get<ApiResponse<Product[]>>('/products', { params });
    return res.data;
  },

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const res = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return res.data;
  },
};
