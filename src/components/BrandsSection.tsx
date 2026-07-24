import React from 'react';
import { brands as defaultBrands } from '../data/products';
import { cn } from '../lib/utils';
import { Brand } from '../types';

interface BrandsSectionProps {
  selectedBrand: string;
  onSelectBrand: (brandName: string) => void;
  brands?: Brand[];
}

export const BrandsSection: React.FC<BrandsSectionProps> = ({ 
  selectedBrand, 
  onSelectBrand,
  brands = defaultBrands
}) => {
  const activeBrands = brands.filter(b => b.active !== false);

  return (
    <section className="py-12 bg-neutral-950 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 block mb-1">
              Marcas Originales
            </span>
            <h2 className="text-2xl sm:text-3xl font-black italic uppercase">
              Explora por <span className="text-red-500">Tu Marca Favorita</span>
            </h2>
          </div>
          {selectedBrand !== 'Todas' && (
            <button 
              onClick={() => onSelectBrand('Todas')}
              className="text-xs font-bold text-red-400 hover:text-white underline tracking-wider cursor-pointer"
            >
              Ver todas las marcas
            </button>
          )}
        </div>

        {/* Brands Horizontal Slider Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onSelectBrand('Todas')}
            className={cn(
              "p-4 rounded-xl border transition-all text-center flex flex-col items-center justify-center gap-2 group cursor-pointer",
              selectedBrand === 'Todas'
                ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30 scale-[1.02]"
                : "bg-black/60 border-white/10 hover:border-red-500/50 text-white/70 hover:text-white"
            )}
          >
            <span className="text-sm font-black uppercase italic">TODAS LAS MARCAS</span>
            <span className="text-[10px] opacity-70">Catálogo Completo</span>
          </button>

          {activeBrands.map(brand => (
            <button
              key={brand.id}
              onClick={() => {
                onSelectBrand(brand.name);
                const catalogEl = document.getElementById('catalog');
                if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className={cn(
                "p-4 rounded-xl border transition-all text-center flex flex-col items-center justify-center gap-2 relative overflow-hidden group cursor-pointer",
                selectedBrand.toLowerCase() === brand.name.toLowerCase()
                  ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30 scale-[1.02]"
                  : "bg-black/60 border-white/10 hover:border-red-500/50 text-white/70 hover:text-white"
              )}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-lg p-2 group-hover:scale-110 transition-transform">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="max-h-full max-w-full object-contain opacity-90"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-xs font-extrabold uppercase italic tracking-wider">{brand.name}</span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
