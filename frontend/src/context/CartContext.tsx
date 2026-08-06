import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartSummary } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartSummary;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  loadCart: () => Promise<void>;
  addToCart: (idProduct: string, qty?: number) => Promise<{ success: boolean; message: string }>;
  updateQuantity: (idBuyerCart: string, qty: number) => Promise<void>;
  removeItem: (idBuyerCart: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const emptyCart: CartSummary = {
  items: [],
  totalItems: 0,
  totalOriginalAmount: 0,
  totalDiscountAmount: 0,
  totalFinalAmount: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartSummary>(emptyCart);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(emptyCart);
      return;
    }
    try {
      const res = await cartService.getCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (idProduct: string, qty: number = 1) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.' };
    }
    try {
      const res = await cartService.addToCart(idProduct, qty);
      if (res.success && res.data) {
        setCart(res.data);
        return { success: true, message: 'Berhasil ditambahkan ke keranjang.' };
      }
      return { success: false, message: res.message || 'Gagal menambahkan produk.' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Gagal menambahkan produk.' };
    }
  };

  const updateQuantity = async (idBuyerCart: string, qty: number) => {
    try {
      const res = await cartService.updateQuantity(idBuyerCart, qty);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeItem = async (idBuyerCart: string) => {
    try {
      const res = await cartService.removeItem(idBuyerCart);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(emptyCart);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        loadCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
