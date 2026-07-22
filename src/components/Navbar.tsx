import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Menu, X, Phone, Heart, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  onOpenCart: () => void;
  cartCount: number;
  onSearch: (query: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenCart, 
  cartCount, 
  onSearch, 
  activeCategory, 
  onSelectCategory,
  searchQuery
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    setIsSearchOpen(false);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
  };

  const navCategories = [
    { id: 'Todos', label: 'Inicio' },
    { id: 'Hombre', label: 'Hombre' },
    { id: 'Mujer', label: 'Mujer' },
    { id: 'Trekking', label: 'Trekking' },
    { id: 'Fiestas Patrias', label: 'Fiestas Patrias 🇵🇪', highlight: true },
    { id: 'Ofertas', label: 'Ofertas S/ 99', badge: 'HOT' },
  ];

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-black text-white text-[11px] font-bold py-2 px-4 text-center flex items-center justify-center gap-3 tracking-wider uppercase z-50 relative">
        <Sparkles size={14} className="text-yellow-300 animate-pulse" />
        <span>PROMO FIESTAS PATRIAS 🇵🇪: ¡HASTA 50% DE DESCUENTO EN MODELOS SELECCIONADOS!</span>
        <a 
          href="https://wa.me/51931741682" 
          target="_blank" 
          rel="noreferrer" 
          className="hidden md:inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-[10px] transition-colors"
        >
          <Phone size={12} /> Pedidos: 931 741 682
        </a>
      </div>

      <nav className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 h-20 flex items-center shrink-0 border-b",
        isScrolled ? "bg-black/90 backdrop-blur-md border-white/10 shadow-2xl" : "bg-black/80 backdrop-blur-sm border-white/10"
      )}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          
          {/* Logo AUKI SPORT */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black text-xl italic text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase leading-none italic">
                AUKI <span className="text-red-500">SPORT</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-white/50">
                Zapatillas Originales
              </span>
            </div>
          </a>
          
          {/* Desktop Categories */}
          <div className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-[0.15em] font-bold">
            {navCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const catalogEl = document.getElementById('catalog');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className={cn(
                  "relative py-2 transition-all flex items-center gap-1.5 hover:text-white",
                  activeCategory === cat.id ? "text-white font-extrabold" : "text-white/60",
                  cat.highlight && "text-red-400 font-extrabold animate-pulse"
                )}
              >
                {cat.label}
                {cat.badge && (
                  <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded font-black tracking-normal">
                    {cat.badge}
                  </span>
                )}
                {activeCategory === cat.id && (
                  <motion.div 
                    layoutId="activeNav" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Input Bar */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.form 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearchSubmit}
                    className="overflow-hidden mr-2"
                  >
                    <input 
                      type="text" 
                      autoFocus
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Buscar Nike, Adidas..."
                      className="w-full bg-white/10 border border-white/20 rounded-full py-1.5 px-4 text-xs text-white focus:outline-none focus:border-red-500 placeholder-white/40"
                    />
                  </motion.form>
                ) : null}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 border border-white/20 rounded-full hover:bg-white/10 transition-colors text-white" 
                aria-label="Buscar"
              >
                <Search size={18} />
              </button>
            </div>
            
            {/* WhatsApp Contact Fast Link */}
            <a 
              href="https://wa.me/51931741682?text=Hola%20AUKI%20SPORT,%20deseo%20informaci%C3%B3n" 
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 border border-red-500/40 bg-red-500/10 hover:bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            >
              <Phone size={14} className="text-red-400 group-hover:text-white" />
              <span>931 741 682</span>
            </a>

            {/* Shopping Cart Button */}
            <button 
              onClick={onOpenCart}
              className="p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full transition-all relative shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95"
              aria-label="Carrito"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-[11px] font-black rounded-full flex items-center justify-center border-2 border-black">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="p-2 lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menú"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col p-6 gap-4 text-base font-black uppercase">
                {navCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setIsMobileMenuOpen(false);
                      const catalogEl = document.getElementById('catalog');
                      if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={cn(
                      "text-left py-2 border-b border-white/5 flex items-center justify-between",
                      activeCategory === cat.id ? "text-red-500 pl-2" : "text-white/80"
                    )}
                  >
                    <span>{cat.label}</span>
                    {cat.badge && (
                      <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-black">
                        {cat.badge}
                      </span>
                    )}
                  </button>
                ))}
                <div className="pt-4 flex flex-col gap-2">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Atención por WhatsApp:</span>
                  <a 
                    href="https://wa.me/51931741682" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="py-3 bg-red-600 text-white text-center rounded font-bold text-sm tracking-wider flex items-center justify-center gap-2"
                  >
                    <Phone size={16} /> WhatsApp: 931 741 682
                  </a>
                  <a 
                    href="https://wa.me/51914459904" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="py-3 bg-white/10 text-white text-center rounded font-bold text-sm tracking-wider flex items-center justify-center gap-2 border border-white/20"
                  >
                    <Phone size={16} /> WhatsApp: 914 459 904
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
