import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Image as ImageIcon, MessageCircle, Phone, Mail, MapPin, Clock, Truck, Share2 } from 'lucide-react';
import { SiteConfig } from '../../types';
import { configService } from '../../services/api';

export const ConfigView: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig>({
    logoUrl: '',
    faviconUrl: '',
    mainBannerUrl: '',
    promoBannerUrl: '',
    whatsappPhone: '51931741682',
    contactPhone: '931 741 682',
    contactEmail: 'ventas@aukisport.com',
    address: 'Av. Grau 456, Stand 102',
    openingHours: 'Lunes a Sábado: 9:00 am - 8:30 pm',
    deliveryCostLima: 15.00,
    deliveryCostProvincias: 20.00,
    freeShippingThreshold: 299.00,
    storePickupAddress: 'Tienda Principal: Stand 102',
    socials: {
      facebook: '',
      instagram: '',
      tiktok: '',
      youtube: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      try {
        const data = await configService.get();
        setConfig(data);
      } catch (err) {
        console.error('Error loading config', err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await configService.update(config);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving config', err);
      alert('Error al guardar la configuración.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-white/50 text-sm">Cargando configuración general...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
            <span>Configuración General de la Tienda</span>
            <Settings size={20} className="text-red-500" />
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Administra los logos, datos de contacto, WhatsApp, redes sociales y envíos.
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-950 border border-emerald-500/40 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check size={16} />
            <span>Configuración guardada correctamente</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Identidad Visual & Imágenes (Cloudinary) */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-red-500 font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-3">
            <ImageIcon size={18} />
            <span>Identidad Visual (URLs Cloudinary)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">URL Logo Principal</label>
              <input
                type="url"
                value={config.logoUrl}
                onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                placeholder="https://res.cloudinary.com/demo/image/upload/v123/logo.png"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">URL Favicon</label>
              <input
                type="url"
                value={config.faviconUrl}
                onChange={(e) => setConfig({ ...config, faviconUrl: e.target.value })}
                placeholder="https://res.cloudinary.com/demo/image/upload/v123/favicon.ico"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">URL Banner Principal (Hero)</label>
              <input
                type="url"
                value={config.mainBannerUrl}
                onChange={(e) => setConfig({ ...config, mainBannerUrl: e.target.value })}
                placeholder="https://res.cloudinary.com/demo/image/upload/v123/hero.jpg"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">URL Banner Promocional</label>
              <input
                type="url"
                value={config.promoBannerUrl}
                onChange={(e) => setConfig({ ...config, promoBannerUrl: e.target.value })}
                placeholder="https://res.cloudinary.com/demo/image/upload/v123/promo.jpg"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Contacto & WhatsApp */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-3">
            <MessageCircle size={18} />
            <span>Contacto & WhatsApp Pedidos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">Número WhatsApp (sin + ni espacios)</label>
              <input
                type="text"
                required
                value={config.whatsappPhone}
                onChange={(e) => setConfig({ ...config, whatsappPhone: e.target.value })}
                placeholder="51931741682"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">Teléfono Visible en Tienda</label>
              <input
                type="text"
                required
                value={config.contactPhone}
                onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                placeholder="931 741 682"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">Correo Electrónico de Contacto</label>
              <input
                type="email"
                required
                value={config.contactEmail}
                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                placeholder="ventas@aukisport.com"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">Horario de Atención</label>
              <input
                type="text"
                required
                value={config.openingHours}
                onChange={(e) => setConfig({ ...config, openingHours: e.target.value })}
                placeholder="Lunes a Sábado: 9:00 am - 8:30 pm"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-white/80">Dirección Física de la Tienda</label>
              <input
                type="text"
                required
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                placeholder="Av. Grau 456, Galería La Virreyna Stand 102"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Deliveries & Pickups */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-3">
            <Truck size={18} />
            <span>Configuración de Envíos y Entregas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">Costo Envío Lima (S/)</label>
              <input
                type="number"
                step="0.5"
                required
                value={config.deliveryCostLima}
                onChange={(e) => setConfig({ ...config, deliveryCostLima: parseFloat(e.target.value) || 0 })}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">Costo Envío Provincias (S/)</label>
              <input
                type="number"
                step="0.5"
                required
                value={config.deliveryCostProvincias}
                onChange={(e) => setConfig({ ...config, deliveryCostProvincias: parseFloat(e.target.value) || 0 })}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">Monto Envío Gratis desde (S/)</label>
              <input
                type="number"
                step="1"
                required
                value={config.freeShippingThreshold}
                onChange={(e) => setConfig({ ...config, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <label className="block text-xs font-bold uppercase text-white/80">Dirección para Recojo en Tienda</label>
              <input
                type="text"
                required
                value={config.storePickupAddress}
                onChange={(e) => setConfig({ ...config, storePickupAddress: e.target.value })}
                placeholder="Stand 102 - Galería La Virreyna"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Social Networks */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-3">
            <Share2 size={18} />
            <span>Redes Sociales</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">Facebook URL</label>
              <input
                type="url"
                value={config.socials.facebook || ''}
                onChange={(e) => setConfig({ ...config, socials: { ...config.socials, facebook: e.target.value } })}
                placeholder="https://facebook.com/aukisport"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">Instagram URL</label>
              <input
                type="url"
                value={config.socials.instagram || ''}
                onChange={(e) => setConfig({ ...config, socials: { ...config.socials, instagram: e.target.value } })}
                placeholder="https://instagram.com/aukisport"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">TikTok URL</label>
              <input
                type="url"
                value={config.socials.tiktok || ''}
                onChange={(e) => setConfig({ ...config, socials: { ...config.socials, tiktok: e.target.value } })}
                placeholder="https://tiktok.com/@aukisport"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">YouTube URL</label>
              <input
                type="url"
                value={config.socials.youtube || ''}
                onChange={(e) => setConfig({ ...config, socials: { ...config.socials, youtube: e.target.value } })}
                placeholder="https://youtube.com/@aukisport"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-red-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'Guardando...' : 'Guardar Configuración General'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
