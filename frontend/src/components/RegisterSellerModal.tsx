import React, { useState, useEffect } from 'react';
import { X, Store, MapPin, Phone, FileText, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sellerService } from '../services/sellerService';
import type { SellerDto } from '../services/sellerService';

interface RegisterSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onShowToast: (message: string) => void;
}

export const RegisterSellerModal: React.FC<RegisterSellerModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onShowToast,
}) => {
  const { isAuthenticated } = useAuth();
  const [existingSeller, setExistingSeller] = useState<SellerDto | null>(null);
  const [isFetchingSeller, setIsFetchingSeller] = useState(false);

  // Form state
  const [sellerName, setSellerName] = useState('');
  const [sellerDesc, setSellerDesc] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchMySeller();
    }
  }, [isOpen, isAuthenticated]);

  const fetchMySeller = async () => {
    setIsFetchingSeller(true);
    try {
      const res = await sellerService.getMySeller();
      if (res.success && res.data) {
        setExistingSeller(res.data);
      } else {
        setExistingSeller(null);
      }
    } catch {
      setExistingSeller(null);
    } finally {
      setIsFetchingSeller(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    const errors: Record<string, string> = {};

    if (!sellerName.trim()) {
      errors.sellerName = 'Nama toko/penjual wajib diisi.';
    } else if (sellerName.trim().length < 3) {
      errors.sellerName = 'Nama toko minimal 3 karakter.';
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Nomor telepon operasional toko wajib diisi.';
    } else if (!/^(\+62|08)[0-9]{8,13}$/.test(phoneNumber.trim())) {
      errors.phoneNumber = 'Nomor telepon tidak valid (contoh: 081234567890).';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await sellerService.registerSeller({
        sellerName: sellerName.trim(),
        sellerDesc: sellerDesc.trim() || undefined,
        address: address.trim() || undefined,
        phoneNumber: phoneNumber.trim(),
      });

      setIsLoading(false);

      if (res.success && res.data) {
        setExistingSeller(res.data);
        onShowToast(`🎉 Selamat! Toko "${res.data.sellerName}" berhasil didaftarkan.`);
      } else {
        setGeneralError(res.message || 'Gagal mendaftarkan toko.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setGeneralError(err.response?.data?.message || 'Terjadi kesalahan sistem saat mendaftar.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Modal Card */}
      <div className="bg-white rounded-[32px] max-w-xl w-full my-8 overflow-hidden shadow-2xl relative border border-slate-100 p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
            <Store className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Daftar Penjual BelanjaYuk</h2>
            <p className="text-xs text-slate-500">Mulai jualan dan bangun tokomu di BelanjaYuk</p>
          </div>
        </div>

        {/* Condition 1: Not Authenticated */}
        {!isAuthenticated ? (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-4 my-2">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Belum Login</h3>
              <p className="text-xs text-slate-500 mt-1">
                Anda perlu masuk atau mendaftar akun pembeli terlebih dahulu sebelum membuka Toko Penjual di BelanjaYuk.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-full transition shadow-md shadow-blue-600/20 active:scale-95"
            >
              Masuk / Buat Akun
            </button>
          </div>
        ) : isFetchingSeller ? (
          /* Loading indicator */
          <div className="py-12 text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent mx-auto" />
            <p className="text-xs font-semibold text-slate-400">Memuat status toko Anda...</p>
          </div>
        ) : existingSeller ? (
          /* Condition 2: Already Has Store */
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-yellow-300">
                  <ShieldCheck className="w-3.5 h-3.5" /> Toko Resmi Terdaftar
                </span>
                <span className="text-[10px] text-white/70 font-mono">Kode: {existingSeller.sellerCode}</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{existingSeller.sellerName}</h3>
                <p className="text-xs text-blue-100 mt-1 line-clamp-2">
                  {existingSeller.sellerDesc || 'Toko Resmi BelanjaYuk Indonesia'}
                </p>
              </div>

              <div className="pt-2 border-t border-white/20 text-xs space-y-1.5 text-blue-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{existingSeller.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{existingSeller.address || 'Jakarta Pusat, Indonesia'}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-900 p-4 rounded-2xl border border-blue-200 text-xs flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span>Toko Anda telah terdaftar. Fitur kelola inventaris &amp; penjualan produk akan segera hadir pada pembaruan mendatang.</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-full transition shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        ) : (
          /* Condition 3: Form Registration */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {generalError && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-200 animate-in fade-in">
                {generalError}
              </div>
            )}

            {/* Nama Toko */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Toko / Penjual *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: Toko Berkah Jaya / BelanjaYuk Official"
                  value={sellerName}
                  onChange={(e) => {
                    setSellerName(e.target.value);
                    if (fieldErrors.sellerName) setFieldErrors({ ...fieldErrors, sellerName: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-2xl text-xs focus:outline-none transition ${
                    fieldErrors.sellerName ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'
                  }`}
                />
                <Store className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              </div>
              {fieldErrors.sellerName && (
                <p className="text-red-500 text-[11px] font-semibold mt-1">{fieldErrors.sellerName}</p>
              )}
            </div>

            {/* No HP Operasional Toko */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">No. HP / WhatsApp Operasional Toko *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (fieldErrors.phoneNumber) setFieldErrors({ ...fieldErrors, phoneNumber: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-2xl text-xs focus:outline-none transition ${
                    fieldErrors.phoneNumber ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'
                  }`}
                />
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              </div>
              {fieldErrors.phoneNumber && (
                <p className="text-red-500 text-[11px] font-semibold mt-1">{fieldErrors.phoneNumber}</p>
              )}
            </div>

            {/* Deskripsi Toko */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat Toko (Opsional)</label>
              <div className="relative">
                <textarea
                  rows={2}
                  placeholder="Menjual berbagai produk elektronik berkualitas..."
                  value={sellerDesc}
                  onChange={(e) => setSellerDesc(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Alamat Operasional Toko */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Gudang / Operasional Toko (Opsional)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Jl. Sudirman No. 12, Jakarta Pusat"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-full transition shadow-lg shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                'Buka Toko Sekarang'
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
