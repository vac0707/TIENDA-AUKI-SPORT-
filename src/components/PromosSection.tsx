import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

interface PromosSectionProps {
  onSelectCategory: (cat: string) => void;
}

export const PromosSection: React.FC<PromosSectionProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Fiestas Patrias */}
        <div className="relative rounded-3xl overflow-hidden border border-red-500/40 bg-gradient-to-r from-red-950/80 via-red-900/50 to-black p-8 md:p-12 mb-12 shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-red-600/30 border border-red-400/50 px-3.5 py-1 rounded-full text-red-200 text-xs font-black uppercase tracking-wider">
                <Sparkles size={14} className="text-yellow-400" />
                <span>Especial Fiestas Patrias 🇵🇪 - AUKI SPORT</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black italic uppercase leading-none tracking-tight">
                ¡ARRIBA EL PERÚ! <br />
                <span className="text-red-400">DESCUENTOS PATRIOS EN ZAPATILLAS.</span>
              </h2>

              <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
                Celebra estas Fiestas Patrias renovando tu calzado deportivo y urbano. Modelos seleccionados Adidas, Nike, New Balance, Puma y más con descuentos reales en tienda.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
                <div className="bg-black/60 border border-red-500/30 p-3 rounded-2xl text-center">
                  <span className="text-2xl sm:text-3xl font-black text-red-400">20%</span>
                  <span className="text-[10px] text-white/60 font-bold block uppercase">En Seleccionados</span>
                </div>
                <div className="bg-black/60 border border-red-500/30 p-3 rounded-2xl text-center">
                  <span className="text-2xl sm:text-3xl font-black text-red-400">30%</span>
                  <span className="text-[10px] text-white/60 font-bold block uppercase">En Seleccionados</span>
                </div>
                <div className="bg-red-600 border border-red-400 p-3 rounded-2xl text-center text-white shadow-lg">
                  <span className="text-2xl sm:text-3xl font-black">50%</span>
                  <span className="text-[10px] text-white/90 font-bold block uppercase">En Seleccionados</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <button
                onClick={() => {
                  onSelectCategory('Fiestas Patrias');
                  const catalogEl = document.getElementById('catalog');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/40 flex items-center gap-3 hover:scale-105"
              >
                <span>Ver Colección Patrias</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>

        {/* Banner Ofertas S/ 99 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group">
            <div className="space-y-3">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block">
                ¡Oportunidad Única!
              </span>
              <h3 className="text-2xl font-black italic uppercase">
                OFERTAS S/ 99.00
              </h3>
              <p className="text-xs text-white/60">
                Lotes de zapatillas originales de liquidación garantizada. Disponibilidad por tallas limitadas.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  onSelectCategory('Ofertas');
                  const catalogEl = document.getElementById('catalog');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white text-black hover:bg-red-600 hover:text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
              >
                <span>Explorar Ofertas S/ 99</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group">
            <div className="space-y-3">
              <span className="bg-emerald-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block">
                Garantía AUKI SPORT
              </span>
              <h3 className="text-2xl font-black italic uppercase">
                100% ORIGINALES
              </h3>
              <p className="text-xs text-white/60">
                Todos nuestros productos cuentan con código de autenticidad de marca, caja original y garantía directa de tienda.
              </p>
            </div>

            <div className="pt-6 flex items-center gap-4 text-xs text-white/70 font-bold">
              <ShieldCheck size={20} className="text-emerald-400" />
              <span>Atención personalizada por WhatsApp</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
