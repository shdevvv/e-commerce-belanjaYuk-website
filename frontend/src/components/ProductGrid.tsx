import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SearchX, Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onOpenAuth: () => void;
  onShowToast: (message: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  onOpenAuth,
  onShowToast,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-blue-600 fill-blue-600" />
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Barang Rekomendasi <span className="text-xs font-semibold text-slate-400 font-normal">+ default barang</span>
        </h2>
      </div>

      {/* Grid Content (5 columns on xl matching mockup) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm animate-pulse space-y-3">
              <div className="bg-slate-200 aspect-square rounded-2xl w-full" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-8 bg-slate-200 rounded-full w-full mt-2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Produk Tidak Ditemukan</h3>
          <p className="text-slate-500 text-xs mt-1">
            Tidak ada barang yang sesuai dengan kata kunci atau kategori yang Anda pilih.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.idProduct}
              product={product}
              onOpenAuth={onOpenAuth}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      )}

    </section>
  );
};
