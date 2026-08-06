import React from 'react';
import { Flame, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BerandaHeroProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenOrders: () => void;
  onOpenProfile: () => void;
}

const categories = ['Semua', 'Elektronik', 'Fashion', 'Rumah Tangga', 'Olahraga', 'Makanan'];

export const BerandaHero: React.FC<BerandaHeroProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenOrders,
  onOpenProfile,
}) => {
  const { user, isAuthenticated } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'AK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  const getUserFirstName = (fullName?: string) => {
    if (!fullName) return 'Andi';
    return fullName.trim().split(' ')[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Card: Promo Banner & Category Chips (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-200/60 px-3 py-1 rounded-full text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-orange-500" /> Promo awal bulan
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Belanja jadi mudah, cepat, dan hemat
            </h1>

            <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
              Nikmati pengiriman cepat dan banyak pilihan produk favorit.
            </p>
          </div>

          {/* Filter Kategori Chips (Single Active, Default: "Semua") */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white border border-blue-600 shadow-sm shadow-blue-600/30'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Card: Kartu Profil Pengguna (Matching Mockup) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-600/20 flex-shrink-0">
              {getInitials(user?.fullName)}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Halo, {getUserFirstName(user?.fullName)} 👋
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                {isAuthenticated ? (user?.emailOrPhone || 'Pembeli BelanjaYuk') : 'Pengunjung (Belum Login)'}
              </p>
            </div>
          </div>

          {/* Buttons: Profil & Lihat Pesanan */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onOpenProfile}
              className="flex-1 py-2.5 px-4 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition text-center"
            >
              Profil
            </button>
            <button
              onClick={onOpenOrders}
              className="flex-1 py-2.5 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 active:scale-95 text-center flex items-center justify-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" /> Lihat Pesanan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
