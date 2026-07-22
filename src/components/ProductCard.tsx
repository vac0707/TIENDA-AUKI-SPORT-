import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ShoppingBag, Eye, Heart, MessageCircle, Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onDirectWhatsApp: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onQuickView, 
  onAddToCart,
  onDirectWhatsApp
}) => {
  const discountPercent = product.retailPrice 
    ? Math.round(((product.retailPrice - product.price) / product.retailPrice) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/30 transition-all duration-300 relative"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          <span className="bg-black/80 backdrop-blur-md text-white border border-white/20 text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
            {product.brand}
          </span>
          {product.tag && (
            <span className={cn(
              "text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm tracking-wider",
              product.tag === 'Fiestas Patrias' ? "bg-red-600 text-white border border-red-400/50" :
              product.tag === 'Nuevo' ? "bg-emerald-500 text-black" :
              product.tag === 'Oferta' ? "bg-red-600 text-white" : "bg-amber-400 text-black"
            )}>
              {product.tag}
            </span>
          )}
        </div>

        {discountPercent > 0 && (
          <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-md shadow-lg shadow-red-600/40 italic">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Product Image Area */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative aspect-[4/3] bg-gradient-to-b from-neutral-800/50 to-neutral-900 p-6 flex items-center justify-center cursor-pointer overflow-hidden"
      >
        <div className="w-36 h-36 bg-red-600/10 rounded-full blur-2xl absolute group-hover:bg-red-600/20 transition-all" />
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain relative z-10 group-hover:scale-110 group-hover:rotate-[-3deg] transition-all duration-500"
          loading="lazy"
        />

        {/* Hover Overlay Button */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-4 py-2 bg-white text-black font-black text-xs uppercase tracking-wider rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2 shadow-xl"
          >
            <Eye size={14} />
            <span>Ver Detalle</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col gap-3 flex-1 justify-between bg-neutral-900">
        <div>
          <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold mb-1">
            <Star size={12} fill="currentColor" />
            <span>{product.rating}</span>
            <span className="text-white/40 font-normal">({product.salesCount || 85} vendidos)</span>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="font-black italic uppercase text-lg text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
            {product.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase font-bold block">
              Precio AUKI SPORT:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white italic">
                S/ {product.price.toFixed(2)}
              </span>
              {product.retailPrice && (
                <span className="text-xs text-white/40 line-through font-bold">
                  S/ {product.retailPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onQuickView(product)}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-white/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye size={14} />
            <span>Ver Tallas</span>
          </button>

          <button
            onClick={() => onDirectWhatsApp(product)}
            className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30"
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
};
