import React, { useEffect, useState } from 'react';
import { X, Package, Calendar, CreditCard } from 'lucide-react';
import { orderService } from '../services/orderService';
import type { Transaction } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      orderService.getOrders().then((res) => {
        setIsLoading(false);
        if (res.success && res.data) {
          setOrders(res.data);
        }
      }).catch(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[85vh] flex flex-col">
        
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Riwayat Pesanan Saya</h3>
              <p className="text-xs text-gray-500">Data transaksi tercatat di database TrBuyerTransaction</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-bold text-gray-600">Belum ada riwayat pesanan.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.idBuyerTransaction} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 gap-2 pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      #{order.idBuyerTransaction.substring(0, 8).toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.dateIn).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 font-semibold text-gray-700 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" /> {order.paymentName}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {order.details.map((det) => (
                    <div key={det.idBuyerTransactionDetail} className="flex justify-between text-xs">
                      <span className="text-gray-800 font-medium">
                        {det.qty}x {det.productName}
                      </span>
                      <span className="font-bold text-gray-900">{formatRupiah(det.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-extrabold">
                  <span className="text-gray-600">Total Transaksi:</span>
                  <span className="text-blue-700 text-base">{formatRupiah(order.finalPrice)}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
