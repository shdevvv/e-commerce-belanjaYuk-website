import React, { useState } from 'react';
import { Star } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onOpenAuth: () => void;
  onShowToast: (message: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenAuth,
  onShowToast,
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    setIsAdding(true);
    const res = await addToCart(product.idProduct, 1);
    setIsAdding(false);

    if (res.success) {
      onShowToast('Barang ditambahkan ke keranjang.');
    }
  };

  // Mock ratings & sold counts matching mockup aesthetics
  const getRating = (id: string) => {
    const ratings: Record<string, string> = {
      'prd-01': '4.7 • Terjual 120',
      'prd-02': '4.5 • Terjual 80',
      'prd-03': '4.8 • Terjual 210',
      'prd-04': '4.6 • Terjual 95',
      'prd-05': '4.9 • Terjual 350',
      'prd-06': '4.7 • Terjual 60',
      'prd-07': '4.4 • Terjual 40',
      'prd-08': '4.5 • Terjual 33',
      'prd-09': '4.6 • Terjual 120',
      'prd-10': '4.3 • Terjual 420',
    };
    return ratings[id] || '4.8 • Terjual 100+';
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
      
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-2">
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm border border-slate-100">
            {product.categoryName}
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.productName}
          </h3>
          <div className="text-base font-black text-slate-900 mt-1">
            {formatRupiah(product.price)}
          </div>
        </div>

        {/* Rating & Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{getRating(product.idProduct)}</span>
          </div>

          {/* Tombol "Tambah" */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="py-1.5 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition shadow-md shadow-blue-600/20 active:scale-95 flex items-center gap-1"
          >
            {isAdding ? (
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : (
              'Tambah'
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
