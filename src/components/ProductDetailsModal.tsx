import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem } from '../types';
import { X, Star, ShoppingBag, MessageCircle, ShieldCheck, Truck, CheckCircle2, AlertCircle, ZoomIn } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onBuyNowCheckout: (item: CartItem) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNowCheckout
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const galleryImages = product.gallery && product.gallery.length > 0 
    ? [product.image, ...product.gallery.filter(img => img !== product.image)] 
    : [product.image];

  const handleAddCart = () => {
    if (!selectedSize) {
      setErrorMsg('Por favor elige una talla disponible.');
      return;
    }
    setErrorMsg('');

    const item: CartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      retailPrice: product.retailPrice,
      image: selectedImage || product.image,
      size: selectedSize,
      color: selectedColor || product.colors[0] || 'Original',
      quantity: 1
    };

    onAddToCart(item);
    onClose();
  };

  const handleDirectWhatsApp = () => {
    if (!selectedSize) {
      setErrorMsg('Por favor elige una talla disponible.');
      return;
    }
    setErrorMsg('');

    const item: CartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      retailPrice: product.retailPrice,
      image: selectedImage || product.image,
      size: selectedSize,
      color: selectedColor || product.colors[0] || 'Original',
      quantity: 1
    };

    onBuyNowCheckout(item);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-5xl bg-neutral-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl z-[101] my-auto max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors border border-white/20 shadow-lg"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>

          {/* Left Column: Image Gallery + Zoom */}
          <div className="w-full md:w-1/2 bg-black/80 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-white/10 relative">
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <span className="bg-red-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow">
                {product.brand}
              </span>
              {product.tag && (
                <span className="bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase px-3 py-1 rounded-full">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Main Image with Zoom preview */}
            <div 
              className="relative w-full aspect-square max-h-[350px] flex items-center justify-center my-auto cursor-zoom-in group overflow-hidden rounded-2xl"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img 
                src={selectedImage} 
                alt={product.name}
                className={cn(
                  "w-full h-full object-contain transition-transform duration-500",
                  isZoomed ? "scale-150 cursor-zoom-out" : "group-hover:scale-105"
                )}
              />
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20 opacity-80">
                <ZoomIn size={12} />
                <span>{isZoomed ? 'Alejar' : 'Hacer Zoom'}</span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto max-w-full p-1 scrollbar-hide">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedImage(img); setIsZoomed(false); }}
                    className={cn(
                      "w-16 h-16 rounded-xl border-2 overflow-hidden p-1 bg-neutral-900 transition-all shrink-0",
                      selectedImage === img ? "border-red-500 scale-105 shadow-md shadow-red-600/30" : "border-white/10 opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="Miniatura" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Purchase Form */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6 bg-neutral-900 text-white">
            
            <div className="space-y-4">
              
              {/* Rating & Stock */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star size={14} fill="currentColor" />
                  <span>{product.rating}</span>
                  <span className="text-white/40 font-normal">({product.salesCount || 120} valoraciones)</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold text-[11px] bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={12} />
                  <span>Stock Disponible</span>
                </div>
              </div>

              {/* Title & Brand */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-white/50 uppercase font-bold tracking-widest mt-1">
                  Categoría: {product.category}
                </p>
              </div>

              {/* Price Display */}
              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-red-400 uppercase font-black tracking-widest block">
                    PRECIO AUKI SPORT
                  </span>
                  <span className="text-3xl font-black italic text-white">
                    S/ {product.price.toFixed(2)}
                  </span>
                </div>
                {product.retailPrice && (
                  <div className="text-right">
                    <span className="text-[10px] text-white/40 uppercase font-bold block">
                      PRECIO RETAIL
                    </span>
                    <span className="text-base text-white/40 line-through font-bold">
                      S/ {product.retailPrice.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-white/70 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/80 block">
                    Color Seleccionado: <span className="text-red-400 italic">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-3.5 py-2 rounded-lg border text-xs font-bold uppercase transition-all",
                          selectedColor === color 
                            ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30" 
                            : "bg-black/40 border-white/20 text-white/70 hover:border-white/50"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector with Highlighted Available and Disabled Out-of-Stock Sizes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                    Talla Disponibles (US): <span className="text-red-400 italic">{selectedSize || 'Selecciona una talla'}</span>
                  </label>
                  <span className="text-[10px] text-white/40 uppercase underline cursor-pointer">Guía de tallas</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {/* Available Sizes */}
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setErrorMsg(''); }}
                      className={cn(
                        "py-2.5 rounded-lg border text-xs font-extrabold transition-all text-center relative",
                        selectedSize === size 
                          ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/40 scale-105" 
                          : "bg-black/60 border-white/20 text-white hover:border-red-400/80 hover:bg-neutral-800"
                      )}
                    >
                      {size}
                    </button>
                  ))}

                  {/* Out of Stock Sizes (Disabled & Low Opacity) */}
                  {product.outOfStockSizes?.map(size => (
                    <button
                      key={`out-${size}`}
                      disabled
                      className="py-2.5 rounded-lg border border-white/5 bg-neutral-950 text-white/30 text-xs font-bold opacity-30 line-through cursor-not-allowed text-center relative"
                      title="Talla Agotada"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddCart}
                  className="py-3.5 bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag size={18} />
                  <span>Agregar al Carrito</span>
                </button>

                <button
                  onClick={handleDirectWhatsApp}
                  className="py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-600/30"
                >
                  <MessageCircle size={18} />
                  <span>Comprar por WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-around text-[10px] text-white/50 pt-2 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Truck size={14} className="text-red-500" />
                  <span>Envío a todo el Perú</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-red-500" />
                  <span>Garantía de Tienda</span>
                </div>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
