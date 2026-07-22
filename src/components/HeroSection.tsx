import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Phone, ArrowRight, ShieldCheck, Sparkles, Heart, Zap, Tag } from 'lucide-react';

interface HeroSectionProps {
  onExploreCatalog: () => void;
  onSelectCategory: (cat: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreCatalog, onSelectCategory }) => {
  return (
    <section className="relative overflow-hidden bg-black text-white border-b border-white/10">
      
      {/* Background Subtle Gradient & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(220,38,38,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Special Promo Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/40 via-red-500/20 to-transparent border border-red-500/50 px-3.5 py-1.5 rounded-full">
              <Sparkles size={14} className="text-yellow-400 animate-bounce" />
              <span className="text-xs font-black uppercase tracking-widest text-red-400">
                Especial Fiestas Patrias 🇵🇪 2026
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
              ¡CELEBRA AL PERÚ <br />
              <span className="text-red-500 underline decoration-red-600 decoration-4">CON LO MEJOR</span>,<br />
              OFERTAS PATRIAS EN ZAPATILLAS!
            </h1>

            <p className="text-sm md:text-base text-white/70 max-w-xl font-normal leading-relaxed">
              Catálogo oficial <strong className="text-white">AUKI SPORT</strong>. Zapatillas 100% Originales Nike, Adidas, New Balance, Reebok, Asics, CAT y Merrell con descuentos exclusivos del 20%, 30% y hasta 50%.
            </p>

            {/* Discounts Highlight Cards */}
            <div className="grid grid-cols-3 gap-3 max-w-lg pt-2">
              <div 
                onClick={() => onSelectCategory('Fiestas Patrias')}
                className="bg-red-950/40 border border-red-500/30 p-3 rounded-xl cursor-pointer hover:border-red-500 hover:bg-red-900/40 transition-all text-center group"
              >
                <span className="text-2xl font-black text-red-500 group-hover:scale-110 block transition-transform">20%</span>
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-tight block">DESCUENTO</span>
              </div>
              <div 
                onClick={() => onSelectCategory('Fiestas Patrias')}
                className="bg-red-950/40 border border-red-500/30 p-3 rounded-xl cursor-pointer hover:border-red-500 hover:bg-red-900/40 transition-all text-center group"
              >
                <span className="text-2xl font-black text-red-500 group-hover:scale-110 block transition-transform">30%</span>
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-tight block">DESCUENTO</span>
              </div>
              <div 
                onClick={() => onSelectCategory('Ofertas')}
                className="bg-gradient-to-br from-red-600 to-red-800 border border-red-400 p-3 rounded-xl cursor-pointer hover:scale-105 transition-all text-center group shadow-lg shadow-red-600/30"
              >
                <span className="text-2xl font-black text-white group-hover:scale-110 block transition-transform">50%</span>
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-tight block">DESCUENTO</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button 
                onClick={onExploreCatalog}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-3 shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight size={16} />
              </button>

              <a 
                href="https://wa.me/51931741682?text=Hola%20AUKI%20SPORT,%20deseo%20hacer%20un%20pedido%20del%20cat%C3%A1logo"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-3"
              >
                <Phone size={16} className="text-red-400" />
                <span>Pedir por WhatsApp</span>
              </a>
            </div>

            {/* Contact numbers footer pill */}
            <div className="pt-4 flex items-center gap-6 text-xs text-white/50 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-red-500" />
                <span>Pedidos directos: <strong className="text-white">931741682</strong> y <strong className="text-white">914459904</strong></span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Showcase Cards / Banner */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-red-500/30 bg-gradient-to-b from-neutral-900 to-black p-6 shadow-2xl shadow-red-950/50">
              <div className="absolute top-4 right-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Originales 100%
              </div>

              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                  Oferta Exclusiva AUKI SPORT
                </span>
                <h3 className="text-2xl font-black italic uppercase">
                  OFERTAS DESDE S/ 99.00
                </h3>
              </div>

              {/* Main Banner Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden my-4 group">
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" 
                  alt="Zapatillas AUKI SPORT"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white/70 block">Nike, Adidas, Reebok</span>
                    <span className="text-xl font-black text-white italic">Envíos a todo el Perú</span>
                  </div>
                  <button 
                    onClick={onExploreCatalog}
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-white hover:text-red-600 transition-colors shadow-lg"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-bold text-white/80">
                <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <ShieldCheck size={16} className="text-red-500 shrink-0" />
                  <span>Garantía de Tienda</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <Zap size={16} className="text-red-500 shrink-0" />
                  <span>Delivery Inmediato</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
