import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BerandaHero } from './components/BerandaHero';
import { ProductGrid } from './components/ProductGrid';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutSuccessModal } from './components/CheckoutSuccessModal';
import { AuthModal } from './components/AuthModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { UserProfileModal } from './components/UserProfileModal';
import { RegisterSellerModal } from './components/RegisterSellerModal';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { productService } from './services/productService';
import type { Product, Transaction } from './types';
import { Heart, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [successTransaction, setSuccessTransaction] = useState<Transaction | null>(null);

  // URL Router Sync (History API)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      const qParam = params.get('q');

      if (catParam) {
        setSelectedCategory(catParam);
      }
      if (qParam !== null) {
        setSearchTerm(qParam);
      }

      if (path === '/login') {
        setAuthMode('login');
        setAuthModalOpen(true);
      } else if (path === '/register') {
        setAuthMode('register');
        setAuthModalOpen(true);
      } else {
        setAuthModalOpen(false);
      }

      if (path === '/orders') {
        setOrdersModalOpen(true);
      } else {
        setOrdersModalOpen(false);
      }

      if (path === '/profile') {
        setProfileModalOpen(true);
      } else {
        setProfileModalOpen(false);
      }

      if (path === '/seller') {
        setSellerModalOpen(true);
      } else {
        setSellerModalOpen(false);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  useEffect(() => {
    fetchProducts(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async (search?: string, category?: string) => {
    setIsLoading(true);
    try {
      const res = await productService.getProducts(search, category);
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    navigateTo(mode === 'register' ? '/register' : '/login');
  };

  const handleCloseModal = () => {
    navigateTo('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        searchTerm={searchTerm}
        onSearchSubmit={(term) => {
          setSearchTerm(term);
          navigateTo(term ? `/?q=${encodeURIComponent(term)}` : '/');
        }}
        onOpenAuth={handleOpenAuth}
        onOpenOrders={() => navigateTo('/orders')}
        onOpenProfile={() => navigateTo('/profile')}
        onOpenSeller={() => navigateTo('/seller')}
      />

      {/* Main Content */}
      <main className="flex-1">
        <BerandaHero
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            navigateTo(cat !== 'Semua' ? `/?category=${encodeURIComponent(cat)}` : '/');
          }}
          onOpenOrders={() => navigateTo('/orders')}
          onOpenProfile={() => navigateTo('/profile')}
        />

        <ProductGrid
          products={products}
          isLoading={isLoading}
          onOpenAuth={() => handleOpenAuth('login')}
          onShowToast={handleShowToast}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 BelanjaYuk</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for BelanjaYuk Technical Test
          </span>
        </div>
      </footer>

      {/* Drawers & Modals */}
      <CartDrawer onCheckoutSuccess={(tx) => setSuccessTransaction(tx)} />
      
      <CheckoutSuccessModal
        transaction={successTransaction}
        onClose={() => setSuccessTransaction(null)}
      />

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={handleCloseModal}
        onShowToast={handleShowToast}
      />

      <OrderHistoryModal
        isOpen={ordersModalOpen}
        onClose={handleCloseModal}
      />

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={handleCloseModal}
      />

      <RegisterSellerModal
        isOpen={sellerModalOpen}
        onClose={handleCloseModal}
        onOpenAuth={() => navigateTo('/login')}
        onShowToast={handleShowToast}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
