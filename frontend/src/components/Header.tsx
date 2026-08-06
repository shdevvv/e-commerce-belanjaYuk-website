import React, { useState } from 'react';
import { ShoppingBag, Search, Store, ShoppingCart, LogOut, Package, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  searchTerm: string;
  onSearchSubmit: (term: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenOrders: () => void;
  onOpenProfile: () => void;
  onOpenSeller: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchSubmit,
  onOpenAuth,
  onOpenOrders,
  onOpenProfile,
  onOpenSeller,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const [inputVal, setInputVal] = useState(searchTerm);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Search input validation: Disallow only spaces and invalid symbols (<>/{})
  const validateSearch = (val: string): boolean => {
    if (!val.trim()) return false;
    const invalidSymbolRegex = /[<>{}/]/;
    if (invalidSymbolRegex.test(val)) return false;
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    const invalidSymbolRegex = /[<>{}/]/;
    if (invalidSymbolRegex.test(val)) {
      setSearchError('Pencarian tidak boleh mengandung simbol < > / { }');
    } else {
      setSearchError(null);
    }
  };

  const handleSearchClick = () => {
    if (validateSearch(inputVal)) {
      setSearchError(null);
      onSearchSubmit(inputVal.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && validateSearch(inputVal)) {
      handleSearchClick();
    }
  };

  const isSearchValid = validateSearch(inputVal);

  const getInitials = (name?: string) => {
    if (!name) return 'BY';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo BelanjaYuk */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
            onClick={() => {
              setInputVal('');
              onSearchSubmit('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition">
              <ShoppingBag className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Belanja<span className="text-blue-600">Yuk</span>
            </span>
          </div>

          {/* Kolom Pencarian + Tombol Cari (Matching Mockup) */}
          <div className="flex-1 max-w-2xl mx-2 relative">
            <div className="flex items-center bg-slate-100/80 rounded-full border border-slate-200/80 p-1.5 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition">
              <div className="pl-3.5 pr-2 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Cari barang apa? (misal: sepatu, headset, kopi)"
                value={inputVal}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              
              {/* Tombol "Cari" (Aktif jika valid) */}
              <button
                type="button"
                onClick={handleSearchClick}
                disabled={!isSearchValid}
                className={`px-5 py-2 rounded-full text-xs font-bold transition shadow-sm flex-shrink-0 ${
                  isSearchValid
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95 cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                Cari
              </button>
            </div>

            {searchError && (
              <p className="absolute left-4 -bottom-5 text-[11px] font-semibold text-red-500 bg-white px-2 py-0.5 rounded shadow">
                {searchError}
              </p>
            )}
          </div>

          {/* Right Section: Daftar Penjual & User Profile Pill */}
          <div className="flex items-center gap-3 flex-shrink-0">
            
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              {cart.totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-yellow-400 text-blue-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cart.totalItems}
                </span>
              )}
            </button>

            {/* Tombol Daftar Penjual */}
            <button
              onClick={onOpenSeller}
              className="hidden lg:flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-full text-xs font-bold transition cursor-pointer"
            >
              <Store className="w-4 h-4 text-blue-600" /> Daftar Penjual
            </button>

            {/* Kartu / Pill Profil Pengguna */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full border border-slate-200 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                    {getInitials(user?.fullName)}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline truncate max-w-[110px]">
                    {user?.fullName}
                  </span>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-xl py-2 border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-blue-50/50 rounded-t-2xl">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Pengguna Terautentikasi</p>
                      <p className="text-xs font-bold text-blue-950 truncate">{user?.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.emailOrPhone}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-blue-600" /> Profil Saya
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenOrders();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-blue-600" /> Lihat Pesanan
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-red-500" /> Keluar (Logout)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-xs font-bold px-3 py-2 text-slate-700 hover:text-blue-600 transition"
                >
                  Masuk
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition shadow-md shadow-blue-600/20 active:scale-95"
                >
                  Daftar
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
