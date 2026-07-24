import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, OrderDetails, SiteConfig } from '../types';
import { X, MessageCircle, MapPin, Truck, Store, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onClearCart: () => void;
  siteConfig?: SiteConfig | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onClearCart,
  siteConfig
}) => {
  if (!isOpen) return null;

  const whatsappPhone = siteConfig?.whatsappPhone || "51931741682";
  const storePickupAddress = siteConfig?.storePickupAddress || siteConfig?.address || "Av. Grau 456 Stand 102 - Huancayo / Lima";

  const total = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  const [formData, setFormData] = useState<OrderDetails>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    department: 'Lima',
    province: 'Lima',
    district: 'San Isidro',
    address: '',
    reference: '',
    deliveryMethod: 'Delivery',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'Ingresa tu nombre.';
    if (!formData.lastName.trim()) errs.lastName = 'Ingresa tu apellido.';
    if (!formData.phone.trim()) errs.phone = 'Ingresa tu teléfono o celular.';

    if (formData.deliveryMethod === 'Delivery') {
      if (!formData.address.trim()) errs.address = 'Ingresa tu dirección de envío.';
      if (!formData.district.trim()) errs.district = 'Ingresa tu distrito.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinalizeWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build the formatted WhatsApp order message
    let msg = `🛒 *NUEVO PEDIDO DE COMPRA - AUKI SPORT*\n`;
    msg += `-----------------------------------\n`;
    msg += `👤 *Cliente:* ${formData.firstName} ${formData.lastName}\n`;
    msg += `📱 *Teléfono:* ${formData.phone}\n`;
    if (formData.email) msg += `✉️ *Correo:* ${formData.email}\n`;
    msg += `\n📦 *MÉTODO DE ENTREGA:* ${formData.deliveryMethod === 'Delivery' ? 'Envío a Domicilio (Delivery)' : 'Recojo en Tienda'}\n`;

    if (formData.deliveryMethod === 'Delivery') {
      msg += `📍 *Ubicación:* ${formData.department}, ${formData.province}, ${formData.district}\n`;
      msg += `🏠 *Dirección:* ${formData.address}\n`;
      if (formData.reference) msg += `🔑 *Referencia:* ${formData.reference}\n`;
    } else {
      msg += `🏬 *Sede Recojo:* Tienda AUKI SPORT - Lima, Perú\n`;
    }

    if (formData.notes) msg += `📝 *Observaciones:* ${formData.notes}\n`;

    msg += `\n👟 *DETALLE DEL PEDIDO:*\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.brand} - ${item.name}*\n`;
      msg += `   • Talla: ${item.size} | Color: ${item.color}\n`;
      msg += `   • Cantidad: ${item.quantity} x S/ ${item.price.toFixed(2)}\n`;
      msg += `   • Subtotal: S/ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    msg += `-----------------------------------\n`;
    msg += `💰 *TOTAL A PAGAR:* S/ ${total.toFixed(2)}\n`;
    msg += `-----------------------------------\n`;
    msg += `¡Hola! Deseo confirmar la disponibilidad y coordinar el pago de mi pedido.`;

    const encoded = encodeURIComponent(msg);
    const whatsappPhone = "51931741682"; // Primary WhatsApp from PDF OCR

    window.open(`https://wa.me/${whatsappPhone}?text=${encoded}`, '_blank');
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120]"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl bg-neutral-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl z-[121] my-auto max-h-[90vh] flex flex-col text-white"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-black/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black">
                <Truck size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black italic uppercase">Finalizar Pedido</h2>
                <p className="text-xs text-white/50">Completa tus datos de envío para generar tu pedido vía WhatsApp</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form & Summary Body */}
          <form onSubmit={handleFinalizeWhatsApp} className="p-6 md:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Fields Left Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Delivery Method Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/80 block">
                  Método de Entrega
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'Delivery' })}
                    className={cn(
                      "p-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                      formData.deliveryMethod === 'Delivery'
                        ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30"
                        : "bg-black/40 border-white/20 text-white/70 hover:border-white/40"
                    )}
                  >
                    <Truck size={16} />
                    <span>Delivery a Domicilio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'Recojo en Tienda' })}
                    className={cn(
                      "p-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                      formData.deliveryMethod === 'Recojo en Tienda'
                        ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30"
                        : "bg-black/40 border-white/20 text-white/70 hover:border-white/40"
                    )}
                  >
                    <Store size={16} />
                    <span>Recojo en Tienda</span>
                  </button>
                </div>
              </div>

              {/* Personal Data */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-red-500 border-b border-white/10 pb-2">
                  Datos Personales
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-white/70 block mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Juan"
                      className="w-full bg-black/60 border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    {errors.firstName && <span className="text-[10px] text-red-400 font-bold">{errors.firstName}</span>}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-white/70 block mb-1">Apellido *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Pérez"
                      className="w-full bg-black/60 border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    {errors.lastName && <span className="text-[10px] text-red-400 font-bold">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-white/70 block mb-1">Celular / WhatsApp *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="987654321"
                      className="w-full bg-black/60 border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    {errors.phone && <span className="text-[10px] text-red-400 font-bold">{errors.phone}</span>}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-white/70 block mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="cliente@email.com"
                      className="w-full bg-black/60 border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address Fields or Store Pick-Up Info */}
              {formData.deliveryMethod === 'Delivery' ? (
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-red-500 border-b border-white/10 pb-2">
                    Dirección de Envío
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-white/70 block mb-1">Departamento</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-black/60 border border-white/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-white/70 block mb-1">Provincia</label>
                      <input
                        type="text"
                        value={formData.province}
                        onChange={e => setFormData({ ...formData, province: e.target.value })}
                        className="w-full bg-black/60 border border-white/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-white/70 block mb-1">Distrito *</label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                        placeholder="Ej: Miraflores"
                        className="w-full bg-black/60 border border-white/20 rounded-lg p-2.5 text-xs text-white"
                      />
                      {errors.district && <span className="text-[10px] text-red-400 font-bold">{errors.district}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-white/70 block mb-1">Dirección Exacta *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Av. Principal 123, Dpto 402"
                      className="w-full bg-black/60 border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    {errors.address && <span className="text-[10px] text-red-400 font-bold">{errors.address}</span>}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-white/70 block mb-1">Referencia</label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={e => setFormData({ ...formData, reference: e.target.value })}
                      placeholder="Frente al parque o supermercado"
                      className="w-full bg-black/60 border border-white/20 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-red-950/40 border border-red-500/40 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase">
                    <Store size={16} />
                    <span>Ubicación de Tienda AUKI SPORT</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    📍 <strong>Lima, Perú</strong> — Horario de atención: Lunes a Sábado de 10:00 am a 8:00 pm.
                  </p>
                  <p className="text-[11px] text-white/50">
                    Al enviar tu mensaje por WhatsApp te confirmaremos el punto exacto de recojo sin costo de envío.
                  </p>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Observaciones o Notas</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Instrucciones adicionales para la entrega..."
                  className="w-full bg-black/60 border border-white/20 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

            </div>

            {/* Right Column: Order Review & Submit */}
            <div className="lg:col-span-5 bg-black/60 border border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase italic tracking-wider text-white border-b border-white/10 pb-2">
                  Resumen del Pedido ({items.length} productos)
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 text-xs border-b border-white/5 pb-2">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-neutral-800 rounded p-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{item.name}</p>
                        <p className="text-[10px] text-white/50">Talla: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-red-400">S/ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>S/ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Envío</span>
                    <span className="text-emerald-400 font-bold">A coordinar por WhatsApp</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                    <span>Total a Pagar</span>
                    <span className="text-2xl text-red-500 italic">S/ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 hover:scale-[1.02]"
                >
                  <MessageCircle size={20} />
                  <span>Enviar Pedido a WhatsApp</span>
                </button>

                <p className="text-[10px] text-center text-white/40 font-bold uppercase tracking-wider">
                  Al presionar se abrirá automáticamente WhatsApp con todos los detalles de tu compra.
                </p>
              </div>

            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
