import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Mail, Eye, EyeOff, ShoppingBag, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { RegisterPayload } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onShowToast?: (message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onShowToast,
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const switchMode = (targetMode: 'login' | 'register') => {
    setMode(targetMode);
    setFieldErrors({});
    setGeneralError(null);
    const targetPath = targetMode === 'register' ? '/register' : '/login';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  // Synchronize modal mode whenever initialMode or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFieldErrors({});
      setGeneralError(null);
      const targetPath = initialMode === 'register' ? '/register' : '/login';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
  }, [isOpen, initialMode]);

  // LOGIN Form State
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // REGISTER Form State
  const [fullName, setFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dob, setDob] = useState('');
  const [genderName, setGenderName] = useState('');

  // Address (Optional) Accordion State
  const [showAddressAccordion, setShowAddressAccordion] = useState(false);
  const [provinsi, setProvinsi] = useState('');
  const [kotaKabupaten, setKotaKabupaten] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kodePos, setKodePos] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Validation Error States
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    const errors: Record<string, string> = {};

    if (!loginEmailOrPhone.trim()) {
      errors.loginEmailOrPhone = 'Email atau nomor HP wajib diisi.';
    }
    if (!loginPassword) {
      errors.loginPassword = 'Kata sandi wajib diisi.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      formContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    const res = await login(loginEmailOrPhone.trim(), loginPassword, rememberMe);
    setIsLoading(false);

    if (res.success) {
      if (onShowToast) {
        onShowToast('🎉 Login berhasil! Selamat datang kembali.');
      }
      onClose();
    } else {
      setGeneralError(res.message);
      formContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    const errors: Record<string, string> = {};

    // 1. Nama Lengkap
    if (!fullName.trim()) {
      errors.fullName = 'Nama lengkap wajib diisi.';
    }

    // 2. Username
    const trimmedUsername = regUsername.trim();
    if (!trimmedUsername) {
      errors.regUsername = 'Username wajib diisi.';
    } else if (trimmedUsername.length < 5 || trimmedUsername.length > 30) {
      errors.regUsername = 'Username harus 5–30 karakter.';
    }

    // 3. Email
    const trimmedEmail = regEmail.trim();
    if (!trimmedEmail) {
      errors.regEmail = 'Email wajib diisi.';
    } else if (!trimmedEmail.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.regEmail = 'Format email tidak valid.';
    }

    // 4. No. HP
    const trimmedPhone = regPhone.trim();
    if (!trimmedPhone) {
      errors.regPhone = 'Nomor HP wajib diisi.';
    } else if (!/^(\+62|08)[0-9]{8,13}$/.test(trimmedPhone)) {
      errors.regPhone = 'Nomor HP tidak valid (contoh: 081234567890).';
    }

    // 5. Kata Sandi
    if (!regPassword) {
      errors.regPassword = 'Kata sandi wajib diisi.';
    } else if (regPassword.length < 8) {
      errors.regPassword = 'Kata sandi minimal 8 karakter.';
    }

    // 6. Konfirmasi Sandi
    if (!confirmPassword) {
      errors.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
    } else if (confirmPassword !== regPassword) {
      errors.confirmPassword = 'Kata sandi tidak sama.';
    }

    // 7. Alamat Utama (Opsional) validation
    if (alamatLengkap.trim() && alamatLengkap.trim().length < 10) {
      errors.alamatLengkap = 'Alamat minimal 10 karakter.';
    }

    // 8. Terms Checkbox
    if (!termsAgreed) {
      errors.termsAgreed = 'Anda harus menyetujui Syarat & Kebijakan Privasi.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      formContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    const payload: RegisterPayload = {
      fullName: fullName.trim(),
      userName: trimmedUsername,
      email: trimmedEmail,
      phoneNumber: trimmedPhone,
      password: regPassword,
      dob: dob ? new Date(dob).toISOString() : undefined,
      genderName: genderName || undefined,
      provinsi: provinsi.trim() || undefined,
      kotaKabupaten: kotaKabupaten.trim() || undefined,
      kecamatan: kecamatan.trim() || undefined,
      kodePos: kodePos.trim() || undefined,
      alamatLengkap: alamatLengkap.trim() || undefined,
    };

    const res = await register(payload);
    setIsLoading(false);

    if (res.success) {
      if (onShowToast) {
        onShowToast(`🎉 Registrasi berhasil! Selamat datang, ${fullName.trim()}`);
      }
      onClose();
    } else {
      setGeneralError(res.message);
      formContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Modal Container */}
      <div className="bg-white rounded-[32px] max-w-4xl w-full my-8 overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Mockup Banner */}
        <div className="w-full md:w-5/12 bg-slate-50 p-8 flex flex-col justify-center items-center border-r border-slate-100 relative hidden md:flex">
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4 max-w-xs text-left">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl h-24 p-4 flex items-center gap-3 text-white shadow-md">
              <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="space-y-1">
                <div className="h-2.5 bg-white/90 rounded-full w-24" />
                <div className="h-2 bg-white/60 rounded-full w-16" />
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                BelanjaYuk – Lebih fun, lebih cepat
              </h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                UI segar dengan warna biru cerah, nyaman dilihat, dan fokus pada kemudahan.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-semibold text-slate-500">
              <span className="bg-slate-100 px-2.5 py-1 rounded-full">Gratis ongkir</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-full">Bayar COD</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-full">Promo harian</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-full">Pengiriman cepat</span>
            </div>
          </div>

        </div>

        {/* Right Side: Form Area */}
        <div ref={formContainerRef} className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-center max-h-[85vh] overflow-y-auto">
          
          {/* Top Header */}
          <div className="mb-5 space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5 text-yellow-300" />
              </div>
              <span className="font-black text-xl text-blue-900 tracking-tight">BelanjaYuk</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {mode === 'login' ? 'Hai, selamat datang kembali 👋' : 'Buat akun baru'}
            </h2>
            <p className="text-xs text-slate-500">
              {mode === 'login'
                ? 'Masuk pakai email atau no. HP yang terdaftar.'
                : 'Isi data diri kamu untuk mulai belanja di BelanjaYuk.'}
            </p>
          </div>

          {/* General API Error Alert */}
          {generalError && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-200 mb-4 animate-in fade-in">
              {generalError}
            </div>
          )}

          {/* ======================================================== */}
          {/* LOGIN FORM                                               */}
          {/* ======================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email / No. HP</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="contoh@mail.com / 0812xxxx"
                    value={loginEmailOrPhone}
                    onChange={(e) => {
                      setLoginEmailOrPhone(e.target.value);
                      if (fieldErrors.loginEmailOrPhone) setFieldErrors({ ...fieldErrors, loginEmailOrPhone: '' });
                    }}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition ${
                      fieldErrors.loginEmailOrPhone ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'
                    }`}
                  />
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                </div>
                {fieldErrors.loginEmailOrPhone ? (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{fieldErrors.loginEmailOrPhone}</p>
                ) : (
                  <p className="text-slate-400 text-[11px] mt-1">Format: email valid atau nomor HP Indonesia.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (fieldErrors.loginPassword) setFieldErrors({ ...fieldErrors, loginPassword: '' });
                    }}
                    className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition ${
                      fieldErrors.loginPassword ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'
                    }`}
                  />
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.loginPassword && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{fieldErrors.loginPassword}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Ingat saya (30 hari)</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Layanan Lupa kata sandi dapat menghubungi tim dukungan BelanjaYuk.')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Lupa kata sandi?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-full transition shadow-lg shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : 'Masuk'}
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <span className="relative bg-white px-3 text-[11px] text-slate-400 uppercase font-bold">atau</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-full transition"
              >
                Lanjut tanpa akun
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* REGISTER FORM                                            */}
          {/* ======================================================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              
              {/* 1. Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama sesuai identitas"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition ${
                    fieldErrors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'
                  }`}
                />
                {fieldErrors.fullName && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* 2. Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="belanjayuk_user"
                  value={regUsername}
                  onChange={(e) => {
                    setRegUsername(e.target.value);
                    if (fieldErrors.regUsername) setFieldErrors({ ...fieldErrors, regUsername: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition ${
                    fieldErrors.regUsername ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'
                  }`}
                />
                {fieldErrors.regUsername && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{fieldErrors.regUsername}</p>
                )}
              </div>

              {/* 3. Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="contoh@mail.com"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (fieldErrors.regEmail) setFieldErrors({ ...fieldErrors, regEmail: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition ${
                    fieldErrors.regEmail ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'
                  }`}
                />
                {fieldErrors.regEmail && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{fieldErrors.regEmail}</p>
                )}
              </div>

              {/* 4. No. HP */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. HP</label>
                <input
                  type="text"
                  placeholder="08xxxx / +628xx"
                  value={regPhone}
                  onChange={(e) => {
                    setRegPhone(e.target.value);
                    if (fieldErrors.regPhone) setFieldErrors({ ...fieldErrors, regPhone: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition ${
                    fieldErrors.regPhone ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'
                  }`}
                />
                {fieldErrors.regPhone && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{fieldErrors.regPhone}</p>
                )}
              </div>

              {/* 5 & 6. Side-by-side Password and Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Minimal 8 karakter"
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        if (fieldErrors.regPassword) setFieldErrors({ ...fieldErrors, regPassword: '' });
                      }}
                      className={`w-full pr-9 pl-3 py-2.5 bg-slate-50 border rounded-2xl text-xs focus:outline-none transition ${
                        fieldErrors.regPassword ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {fieldErrors.regPassword && (
                    <p className="text-red-500 text-[10px] font-semibold mt-1">{fieldErrors.regPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Sandi</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Ulangi sandi"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                      }}
                      className={`w-full pr-9 pl-3 py-2.5 bg-slate-50 border rounded-2xl text-xs focus:outline-none transition ${
                        fieldErrors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-500 text-[10px] font-semibold mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* 7. Tanggal Lahir (DOB) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-700"
                  />
                  <Calendar className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 8. Jenis Kelamin (LtGender) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                <select
                  value={genderName}
                  onChange={(e) => setGenderName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-700"
                >
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              {/* 9. Collapsible Address Accordion (Image 2 Mockup) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressAccordion(!showAddressAccordion)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-blue-600 transition"
                >
                  {showAddressAccordion ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span>Tambahkan alamat utama (opsional)</span>
                </button>

                {showAddressAccordion && (
                  <div className="mt-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Provinsi</label>
                      <input
                        type="text"
                        placeholder="Banten"
                        value={provinsi}
                        onChange={(e) => setProvinsi(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Kota/Kabupaten</label>
                      <input
                        type="text"
                        placeholder="Tangerang Kota"
                        value={kotaKabupaten}
                        onChange={(e) => setKotaKabupaten(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Kecamatan</label>
                      <input
                        type="text"
                        placeholder="Tangerang"
                        value={kecamatan}
                        onChange={(e) => setKecamatan(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Kode Pos</label>
                      <input
                        type="text"
                        placeholder="13111"
                        value={kodePos}
                        onChange={(e) => setKodePos(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Alamat Lengkap</label>
                      <textarea
                        placeholder="Jalan Tangerang Cahaya Blok B nomor 9"
                        rows={2}
                        value={alamatLengkap}
                        onChange={(e) => {
                          setAlamatLengkap(e.target.value);
                          if (fieldErrors.alamatLengkap) setFieldErrors({ ...fieldErrors, alamatLengkap: '' });
                        }}
                        className={`w-full px-3 py-2 bg-white border rounded-xl text-xs focus:outline-none transition ${
                          fieldErrors.alamatLengkap ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:ring-2 focus:ring-blue-600'
                        }`}
                      />
                      {fieldErrors.alamatLengkap && (
                        <p className="text-red-500 text-[10px] font-semibold mt-1">{fieldErrors.alamatLengkap}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 10. Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => {
                      setTermsAgreed(e.target.checked);
                      if (fieldErrors.termsAgreed) setFieldErrors({ ...fieldErrors, termsAgreed: '' });
                    }}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Saya setuju dengan Syarat & Kebijakan Privasi</span>
                </label>
                {fieldErrors.termsAgreed && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{fieldErrors.termsAgreed}</p>
                )}
              </div>

              {/* 11. Submit Button "Buat Akun" */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-full transition shadow-lg shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : 'Buat Akun'}
              </button>

            </form>
          )}

          {/* Footer Mode Switcher */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-blue-600 font-extrabold hover:underline"
                >
                  Daftar sekarang
                </button>
              </p>
            ) : (
              <p>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-blue-600 font-extrabold hover:underline"
                >
                  Masuk
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
