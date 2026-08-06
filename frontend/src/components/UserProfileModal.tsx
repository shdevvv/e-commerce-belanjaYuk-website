import React from 'react';
import { X, User as UserIcon, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-600/30">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <h3 className="text-xl font-black text-slate-900">{user.fullName}</h3>
          <p className="text-xs text-blue-600 font-bold font-mono mt-0.5">@{user.userName}</p>
        </div>

        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          <div className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-2xs">
            <Mail className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Email / Kontak</p>
              <p className="font-bold text-slate-800">{user.emailOrPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-2xs">
            <UserIcon className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">ID Pengguna (MsUser)</p>
              <p className="font-mono text-slate-700">{user.idUser}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-2xs">
            <Shield className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Status Akun</p>
              <p className="font-bold text-emerald-600">Aktif & Terautentikasi (JWT)</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-full transition shadow-md shadow-blue-600/20 active:scale-95 mt-6 cursor-pointer"
        >
          Tutup Profil
        </button>

      </div>
    </div>
  );
};
