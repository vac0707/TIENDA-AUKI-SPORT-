import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PromotionsConfig } from '../types';

interface PromosSectionProps {
  onSelectCategory: (cat: string) => void;
  promotionsConfig?: PromotionsConfig | null;
}

export const PromosSection: React.FC<PromosSectionProps> = ({ 
  onSelectCategory,
  promotionsConfig
}) => {
  const headline = promotionsConfig?.headline || "¡ARRIBA EL PERÚ! DESCUENTOS PATRIOS EN ZAPATILLAS.";
  const subheadline = promotionsConfig?.subheadline || "Celebra estas Fiestas Patrias renovando tu calzado deportivo y urbano. Modelos seleccionados Adidas, Nike, New Balance, Puma y más con descuentos reales en tienda.";
  const badgeText = promotionsConfig?.badgeText || "Especial Fiestas Patrias 🇵🇪 - AUKI SPORT";
  const discounts = promotionsConfig?.discounts && promotionsConfig.discounts.length >= 3 
    ? promotionsConfig.discounts 
    : ["20%", "30%", "50%"];
  const buttonText = promotionsConfig?.buttonText || "Ver Colección Patrias";
  const activeCategory = promotionsConfig?.activeCategory || "Fiestas Patrias";

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
                <span>{badgeText}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black italic uppercase leading-tight tracking-tight text-white">
                {headline}
              </h2>

              <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
                {subheadline}
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
                <div className="bg-black/60 border border-red-500/30 p-3 rounded-2xl text-center">
                  <span className="text-2xl sm:text-3xl font-black text-red-400">{discounts[0]}</span>
                  <span className="text-[10px] text-white/60 font-bold block uppercase">En Seleccionados</span>
                </div>
                <div className="bg-black/60 border border-red-500/30 p-3 rounded-2xl text-center">
                  <span className="text-2xl sm:text-3xl font-black text-red-400">{discounts[1]}</span>
                  <span className="text-[10px] text-white/60 font-bold block uppercase">En Seleccionados</span>
                </div>
                <div className="bg-red-600 border border-red-400 p-3 rounded-2xl text-center text-white shadow-lg">
                  <span className="text-2xl sm:text-3xl font-black">{discounts[2]}</span>
                  <span className="text-[10px] text-white/90 font-bold block uppercase">En Seleccionados</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <button
                onClick={() => {
                  onSelectCategory(activeCategory);
                  const catalogEl = document.getElementById('catalog');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/40 flex items-center gap-3 hover:scale-105 cursor-pointer"
              >
                <span>{buttonText}</span>
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
                OFERTAS DE LIQUIDACIÓN
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
                className="px-6 py-3 bg-white text-black hover:bg-red-600 hover:text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explorar Ofertas</span>
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
