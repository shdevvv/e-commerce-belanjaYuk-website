import React, { useEffect } from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Transaction } from '../types';

interface CheckoutSuccessModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const CheckoutSuccessModal: React.FC<CheckoutSuccessModalProps> = ({
  transaction,
  onClose,
}) => {
  useEffect(() => {
    if (transaction) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [transaction]);

  if (!transaction) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border border-gray-100 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
          Checkout Berhasil!
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Terima kasih telah berbelanja di BelanjaYuk. Pesanan Anda sedang diproses.
        </p>

        {/* Transaction Summary Box */}
        <div className="my-6 p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-left space-y-2 text-xs text-gray-700">
          <div className="flex justify-between font-mono border-b border-blue-200/60 pb-2">
            <span className="text-gray-500">ID Transaksi:</span>
            <span className="font-bold text-blue-900">{transaction.idBuyerTransaction.substring(0, 8).toUpperCase()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Metode Pembayaran:</span>
            <span className="font-bold text-gray-800">{transaction.paymentName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Waktu Transaksi:</span>
            <span className="font-medium text-gray-800">
              {new Date(transaction.dateIn).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between pt-2 border-t border-blue-200/60 text-sm font-extrabold">
            <span>Total Akhir Bayar:</span>
            <span className="text-blue-700">{formatRupiah(transaction.finalPrice)}</span>
          </div>
        </div>

        {/* Item List Summary */}
        <div className="max-h-36 overflow-y-auto space-y-2 text-left pr-1 mb-6">
          {transaction.details.map((item) => (
            <div key={item.idBuyerTransactionDetail} className="flex justify-between text-xs py-1 border-b border-gray-100">
              <span className="text-gray-800 font-medium line-clamp-1">
                {item.qty}x {item.productName}
              </span>
              <span className="font-bold text-gray-900">{formatRupiah(item.totalPrice)}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Lanjut Belanja
        </button>

      </div>
    </div>
  );
};
