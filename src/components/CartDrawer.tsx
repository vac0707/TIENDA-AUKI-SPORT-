import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { cn } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQuantity,
  onProceedToCheckout
}) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[110]"
          />

          {/* Cart Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-[111] w-full max-w-md bg-neutral-900 border-l border-white/10 h-full flex flex-col justify-between shadow-2xl text-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black">
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black italic uppercase">Tu Carrito de Compras</h2>
                  <span className="text-[11px] text-white/50 font-bold">AUKI SPORT - Perú</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-white/40 my-auto">
                  <ShoppingBag size={56} className="text-white/20" />
                  <div>
                    <p className="text-sm font-black uppercase tracking-wider text-white/70">Tu carrito está vacío</p>
                    <p className="text-xs text-white/40 mt-1">Explora nuestro catálogo y agrega tus zapatillas favoritas.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-black/50 border border-white/10 rounded-2xl p-4 flex gap-4 items-center relative group"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-neutral-800 rounded-xl p-2 shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[10px] font-black uppercase text-red-500 block">
                        {item.brand}
                      </span>
                      <h4 className="text-xs font-black uppercase italic text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-white/50 font-medium">
                        Talla: <strong className="text-white">{item.size}</strong> | Color: <strong className="text-white">{item.color}</strong>
                      </p>

                      {/* Quantity Controls & Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center bg-white/10 border border-white/20 rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-white/20 text-white transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-xs font-black">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-white/20 text-white transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="text-sm font-black italic text-white">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Item Button */}
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-white/40 hover:text-red-500 transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Order Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-black border-t border-white/10 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Envío</span>
                    <span className="text-emerald-400 font-bold">Por coordinar</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                    <span>Total a Pagar</span>
                    <span className="text-2xl text-red-500 italic">S/ {subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={onProceedToCheckout}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 hover:scale-[1.02]"
                >
                  <span>Continuar Checkout</span>
                  <ArrowRight size={16} />
                </button>

                <p className="text-[10px] text-center text-white/40 uppercase font-bold tracking-wider">
                  🔒 Compra 100% Segura vía WhatsApp AUKI SPORT
                </p>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
