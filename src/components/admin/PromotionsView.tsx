import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Check, Image as ImageIcon, ExternalLink, Save } from 'lucide-react';
import { PromotionsConfig } from '../../types';
import { promotionsService } from '../../services/api';

export const PromotionsView: React.FC = () => {
  const [promoConfig, setPromoConfig] = useState<PromotionsConfig>({
    headline: '',
    subheadline: '',
    badgeText: '',
    discounts: ['20%', '30%', '50%'],
    buttonText: '',
    activeCategory: 'Fiestas Patrias',
    bannerImageUrl: '',
    active: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function loadPromo() {
      setLoading(true);
      try {
        const data = await promotionsService.get();
        setPromoConfig(data);
      } catch (err) {
        console.error('Error loading promotions config', err);
      } finally {
        setLoading(false);
      }
    }
    loadPromo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await promotionsService.update(promoConfig);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving promotions config', err);
      alert('Error al guardar la configuración de la promoción.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-white/50 text-sm">Cargando promociones...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
            <span>Gestión de Promociones & Banners</span>
            <Sparkles size={20} className="text-yellow-400" />
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Modifica la campaña promocional activa (Fiestas Patrias, Cyber, Black Friday, etc.)
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-950 border border-emerald-500/40 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Check size={16} />
            <span>¡Promoción actualizada en vivo!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Banner Preview Card */}
        <div className="bg-gradient-to-r from-red-950/80 via-red-900/50 to-black border border-red-500/40 rounded-3xl p-6 md:p-8 space-y-4 relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-red-600/30 border border-red-400/50 px-3 py-1 rounded-full text-red-200 text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} className="text-yellow-400" />
            <span>{promoConfig.badgeText || 'Vista Previa del Banner'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black italic uppercase leading-tight text-white">
            {promoConfig.headline || 'TITULO PROMOCIONAL'}
          </h2>

          <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
            {promoConfig.subheadline || 'Subtítulo explicativo de la oferta en tienda.'}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <span className="px-6 py-3 bg-red-600 text-white font-black text-xs uppercase rounded-xl">
              {promoConfig.buttonText || 'Ver Colección'}
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-white/80">Etiqueta Superior Badge</label>
            <input
              type="text"
              required
              value={promoConfig.badgeText}
              onChange={(e) => setPromoConfig({ ...promoConfig, badgeText: e.target.value })}
              placeholder="Ej: Especial Fiestas Patrias 🇵🇪 - AUKI SPORT"
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-white/80">Titular Principal Promocional *</label>
            <input
              type="text"
              required
              value={promoConfig.headline}
              onChange={(e) => setPromoConfig({ ...promoConfig, headline: e.target.value })}
              placeholder="Ej: ¡CELEBRA AL PERÚ CON LO MEJOR!"
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-white/80">Subtítulo Descriptivo *</label>
            <textarea
              rows={2}
              required
              value={promoConfig.subheadline}
              onChange={(e) => setPromoConfig({ ...promoConfig, subheadline: e.target.value })}
              placeholder="Ej: Descuentos reales en zapatillas seleccionadas..."
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">Texto Botón de Acción</label>
              <input
                type="text"
                required
                value={promoConfig.buttonText}
                onChange={(e) => setPromoConfig({ ...promoConfig, buttonText: e.target.value })}
                placeholder="Ej: Ver Colección Patrias"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-white/80">Categoría Objetivo al hacer Clic</label>
              <input
                type="text"
                required
                value={promoConfig.activeCategory}
                onChange={(e) => setPromoConfig({ ...promoConfig, activeCategory: e.target.value })}
                placeholder="Ej: Fiestas Patrias"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-white/80">
              URL Imagen de Fondo del Banner (Cloudinary)
            </label>
            <input
              type="url"
              value={promoConfig.bannerImageUrl || ''}
              onChange={(e) => {
                setImageError(false);
                setPromoConfig({ ...promoConfig, bannerImageUrl: e.target.value });
              }}
              placeholder="https://res.cloudinary.com/demo/image/upload/v123/banner_patrias.jpg"
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="promoActive"
              checked={promoConfig.active}
              onChange={(e) => setPromoConfig({ ...promoConfig, active: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-black text-red-600 focus:ring-0"
            />
            <label htmlFor="promoActive" className="text-xs text-white font-bold cursor-pointer">
              Promoción activa en la portada pública
            </label>
          </div>

        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-red-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'Guardando...' : 'Guardar Cambios Promocionales'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
