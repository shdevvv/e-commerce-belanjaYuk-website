import React from 'react';
import { Tag, ShieldCheck, Truck, Zap } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-12 px-6 sm:px-12 rounded-3xl shadow-2xl my-6 mx-4 sm:mx-8 border border-blue-700/50">
      
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 fill-yellow-300" /> Super Flash Sale BelanjaYuk
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Belanja Gadget & Lifestyle <br />
            <span className="bg-gradient-to-r from-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Diskon Produk Spesial
            </span>
          </h1>

          <p className="text-blue-100 text-sm sm:text-base max-w-xl">
            Sistem e-Commerce modern terintegrasi 12 Tabel ERD (.NET 8 & React SPA): Pencarian produk, perhitungan diskon otomatis, serta checkout Transfer Bank & COD.
          </p>

          {/* Badges */}
          <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start text-xs font-medium text-blue-200">
            <span className="flex items-center gap-1.5 bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-700/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Produk Original
            </span>
            <span className="flex items-center gap-1.5 bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-700/40">
              <Truck className="w-4 h-4 text-yellow-300" /> Bebas Ongkir Seluruh Indonesia
            </span>
            <span className="flex items-center gap-1.5 bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-700/40">
              <Tag className="w-4 h-4 text-blue-300" /> Diskon Otomatis Terkalkulasi
            </span>
          </div>
        </div>

        {/* Promo Box */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center shadow-xl min-w-[240px]">
          <span className="text-xs uppercase font-bold text-yellow-300 tracking-wider block mb-1">
            Kode Promo Testing
          </span>
          <div className="text-2xl font-black tracking-widest bg-yellow-400 text-blue-950 py-2 px-4 rounded-xl shadow-inner font-mono my-2">
            BELANJAYUK88
          </div>
          <span className="text-[11px] text-blue-200">
            Kalkulasi diskon otomatis dari MsProduct & TrBuyerCart
          </span>
        </div>
      </div>

    </div>
  );
};
