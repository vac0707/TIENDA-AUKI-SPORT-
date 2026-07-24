import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrandsSection } from './components/BrandsSection';
import { PromosSection } from './components/PromosSection';
import { CatalogSection } from './components/CatalogSection';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { 
  productsService, 
  brandsService, 
  categoriesService, 
  promotionsService, 
  configService, 
  authService 
} from './services/api';

import { products as initialProducts } from './data/products';
import { Product, Brand, Category, PromotionsConfig, SiteConfig, CartItem, AdminUser } from './types';
import { MessageCircle, ArrowUp } from 'lucide-react';

export default function App() {
  // Navigation / Route state
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/admin');
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    return authService.getCurrentUser();
  });

  // Dynamic store data states
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promotionsConfig, setPromotionsConfig] = useState<PromotionsConfig | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedBrand, setSelectedBrand] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Listen to browser path changes / pushState
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setIsAdminRoute(path.startsWith('/admin'));
  };

  // LocalStorage Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('auki_sport_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('auki_sport_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to local storage:', e);
    }
  }, [cartItems]);

  // Load all dynamic store data from REST API Services
  const loadAllStoreData = async () => {
    try {
      const [liveProds, liveBrands, liveCats, livePromos, liveConfig] = await Promise.all([
        productsService.getAll(),
        brandsService.getAll(),
        categoriesService.getAll(),
        promotionsService.get(),
        configService.get()
      ]);

      if (liveProds && liveProds.length > 0) setProducts(liveProds);
      if (liveBrands) setBrands(liveBrands);
      if (liveCats) setCategories(liveCats);
      if (livePromos) setPromotionsConfig(livePromos);
      if (liveConfig) setSiteConfig(liveConfig);
    } catch (err) {
      console.error('Error fetching live store data:', err);
    }
  };

  useEffect(() => {
    loadAllStoreData();
  }, [isAdminRoute]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ADMIN ROUTE RENDERING
  if (isAdminRoute) {
    if (!adminUser) {
      return (
        <AdminLogin
          onSuccess={(user) => {
            setAdminUser(user);
          }}
        />
      );
    }

    return (
      <AdminLayout
        user={adminUser}
        onLogout={async () => {
          await authService.logout();
          setAdminUser(null);
        }}
        onGoToPublicStore={() => {
          navigateTo('/');
        }}
      />
    );
  }

  // PUBLIC STORE ROUTE RENDERING
  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleCardAddToCart = (product: Product, size: string, color: string) => {
    const item: CartItem = {
      id: `${product.id}-${size}-${color}`,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      retailPrice: product.retailPrice,
      image: product.image,
      size: size || product.sizes[0] || '38',
      color: color || product.colors[0] || 'Original',
      quantity: 1
    };
    handleAddToCart(item);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const whatsappPhone = siteConfig?.whatsappPhone || "51931741682";

  const handleDirectWhatsAppProduct = (product: Product) => {
    const msg = `Hola *AUKI SPORT*, me interesa consultar este modelo:\n\n👟 *Zapatilla:* ${product.brand} ${product.name}\n💰 *Precio:* S/ ${product.price.toFixed(2)}\n📏 *Tallas disponibles:* ${product.sizes.join(', ')}\n\n¿Tienen stock disponible para entrega inmediata?`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${whatsappPhone}?text=${encoded}`, '_blank');
  };

  const handleBuyNowFromModal = (item: CartItem) => {
    setCartItems([item]);
    setIsCheckoutOpen(true);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-red-600 selection:text-white">
      
      {/* Sticky Header Navigation */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        onSearch={setSearchQuery}
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        categories={categories}
        siteConfig={siteConfig}
        promotionsConfig={promotionsConfig}
      />

      <main className="flex-1">
        
        {/* Main Hero Section */}
        <HeroSection
          onExploreCatalog={() => {
            const catalogEl = document.getElementById('catalog');
            if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
          }}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const catalogEl = document.getElementById('catalog');
            if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
          }}
          siteConfig={siteConfig}
          promotionsConfig={promotionsConfig}
        />

        {/* Brands Slider Filter Bar */}
        <BrandsSection
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          brands={brands}
        />

        {/* Promotions Banner */}
        <PromosSection
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const catalogEl = document.getElementById('catalog');
            if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
          }}
          promotionsConfig={promotionsConfig}
        />

        {/* Dynamic Products Catalog Grid */}
        <CatalogSection
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onQuickView={setQuickViewProduct}
          onAddToCart={handleCardAddToCart}
          onDirectWhatsApp={handleDirectWhatsAppProduct}
          categoriesList={categories}
        />

      </main>

      {/* Footer Component */}
      <Footer siteConfig={siteConfig} categories={categories} />

      {/* Floating Action Buttons: WhatsApp & Scroll Top */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end pointer-events-auto">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3 bg-neutral-900 border border-white/20 text-white rounded-full hover:bg-red-600 hover:border-red-500 transition-all shadow-xl cursor-pointer"
            aria-label="Volver arriba"
          >
            <ArrowUp size={20} />
          </button>
        )}

        <a
          href={`https://wa.me/${whatsappPhone}?text=Hola%20AUKI%20SPORT,%20deseo%20hacer%20un%20pedido%20de%20zapatillas`}
          target="_blank"
          rel="noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2 cursor-pointer hover:scale-105 transition-all group"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">
            WhatsApp Pedidos
          </span>
        </a>
      </div>

      {/* Modals & Drawers */}
      <ProductDetailsModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNowCheckout={handleBuyNowFromModal}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onClearCart={handleClearCart}
        siteConfig={siteConfig}
      />

    </div>
  );
}

