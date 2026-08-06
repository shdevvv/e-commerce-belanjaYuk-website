import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import type { Transaction, PaymentMethod } from '../types';

interface CartDrawerProps {
  onCheckoutSuccess: (transaction: Transaction) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckoutSuccess }) => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeItem } = useCart();
  
  // Payment methods fetched from API (LtPayment)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch payment methods from API on open
  useEffect(() => {
    if (isCartOpen) {
      orderService.getPaymentMethods().then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setPaymentMethods(res.data);
          setSelectedPaymentId(res.data[0].idPayment);
        }
      }).catch(console.error);
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Quantity handlers validating 1 to 99 range
  const handleQuantityChange = (cartItemId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty >= 1 && newQty <= 99) {
      updateQuantity(cartItemId, newQty);
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0 || !selectedPaymentId) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await orderService.checkout(selectedPaymentId);
      setIsSubmitting(false);

      if (res.success && res.data) {
        setIsCartOpen(false);
        onCheckoutSuccess(res.data);
      } else {
        setErrorMsg(res.message || 'Gagal memproses pembelian. Silakan coba lagi.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan saat memproses pesanan.');
    }
  };

  // Validation: Button active if (1) >= 1 item in cart AND (2) payment method selected
  const isBuyButtonActive = cart.items.length > 0 && !!selectedPaymentId && !isSubmitting;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 flex items-center justify-center p-4 sm:p-6">
      
      {/* Background Backdrop Overlay */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Main Cart Modal (Matching Mockup Dual Card Layout) */}
      <div className="relative z-10 bg-slate-50 rounded-[32px] max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsCartOpen(false)}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Outer Split 2-Column Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* ======================================================== */}
          {/* BAGIAN KIRI: KERANJANG (DAFTAR PRODUK)                   */}
          {/* ======================================================== */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Keranjang</h2>
              <p className="text-xs text-slate-400 mt-1">
                Atur kuantitas, cek diskon, lalu lanjutkan pembayaran.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Cart Item List */}
            {cart.items.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-700 text-base">Keranjang kosong.</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Belum ada produk di keranjang. Yuk pilih produk impianmu di beranda BelanjaYuk!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const discountPct = item.discountProduct > 0 && item.price > 0
                    ? Math.round((item.discountProduct / item.price) * 100)
                    : 0;

                  return (
                    <div
                      key={item.idBuyerCart}
                      className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200 flex-shrink-0 bg-white"
                        />
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                              {item.productName}
                            </h4>
                            {discountPct > 0 && (
                              <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                                Diskon {discountPct}%
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            {item.discountProduct > 0 ? (
                              <>
                                <span className="text-slate-400 line-through">{formatRupiah(item.price)}</span>
                                <span className="font-black text-slate-900">{formatRupiah(item.discountedPrice)}</span>
                                <span className="text-slate-400 font-medium">(- {formatRupiah(item.discountProduct)})</span>
                              </>
                            ) : (
                              <span className="font-black text-slate-900">{formatRupiah(item.price)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                        
                        <div className="flex flex-col items-center gap-1">
                          {/* Trash Icon */}
                          <button
                            onClick={() => removeItem(item.idBuyerCart)}
                            className="text-slate-400 hover:text-red-500 transition p-1"
                            title="Hapus produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Controls - 1 + */}
                          <div className="flex items-center border border-slate-200 rounded-full bg-white px-2 py-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.idBuyerCart, item.qty, -1)}
                              className="text-slate-500 hover:text-blue-600 px-1.5 py-0.5 text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800">{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.idBuyerCart, item.qty, 1)}
                              className="text-slate-500 hover:text-blue-600 px-1.5 py-0.5 text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Subtotal Item */}
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Subtotal</p>
                          <p className="text-sm font-black text-slate-900">
                            {formatRupiah(item.subtotalDiscounted)}
                          </p>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* ======================================================== */}
          {/* BAGIAN KANAN: RINGKASAN PEMBAYARAN                       */}
          {/* ======================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Ringkasan</h3>

            {/* Price Summary Breakdown */}
            <div className="space-y-3 text-xs text-slate-600 pb-4 border-b border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">{formatRupiah(cart.totalOriginalAmount)}</span>
              </div>

              <div className="flex justify-between text-red-500">
                <span>Diskon</span>
                <span className="font-bold">
                  {cart.totalDiscountAmount > 0 ? `- ${formatRupiah(cart.totalDiscountAmount)}` : 'Rp 0'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Biaya Pengiriman</span>
                <span className="font-bold text-slate-800">Rp 0</span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>Total</span>
                <span className="text-blue-600">{formatRupiah(cart.totalFinalAmount)}</span>
              </div>
            </div>

            {/* Metode Pembayaran (Wajib dari API LtPayment) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Metode Pembayaran (LtPayment)</label>
              
              <div className="space-y-2">
                {paymentMethods.map((pm) => {
                  const isSelected = selectedPaymentId === pm.idPayment;
                  return (
                    <label
                      key={pm.idPayment}
                      onClick={() => setSelectedPaymentId(pm.idPayment)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer text-xs font-bold transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 text-blue-950 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.idPayment}
                        checked={isSelected}
                        onChange={() => setSelectedPaymentId(pm.idPayment)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{pm.paymentName}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Tombol "Beli Barang" */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={!isBuyButtonActive}
              className={`w-full py-3.5 px-4 rounded-full font-black text-sm transition shadow-lg flex items-center justify-center gap-2 ${
                isBuyButtonActive
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 active:scale-95 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                'Beli Barang'
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
