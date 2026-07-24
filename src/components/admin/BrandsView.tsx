import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award, ExternalLink, Image as ImageIcon, X, Check, AlertCircle } from 'lucide-react';
import { Brand } from '../../types';
import { brandsService } from '../../services/api';

export const BrandsView: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    active: true
  });
  const [saving, setSaving] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await brandsService.getAll();
      setBrands(data);
    } catch (err) {
      console.error('Error loading brands', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      logo: '',
      description: '',
      active: true
    });
    setLogoError(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      logo: brand.logo,
      description: brand.description || '',
      active: brand.active ?? true
    });
    setLogoError(false);
    setIsModalOpen(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.logo.trim()) {
      alert('Por favor completa el nombre de la marca y la URL del logotipo.');
      return;
    }

    setSaving(true);
    try {
      if (editingBrand) {
        await brandsService.update(editingBrand.id, formData);
      } else {
        await brandsService.create(formData);
      }
      setIsModalOpen(false);
      await loadBrands();
    } catch (err) {
      console.error('Error saving brand', err);
      alert('Ocurrió un error al guardar la marca.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await brandsService.delete(id);
      setDeletingBrandId(null);
      await loadBrands();
    } catch (err) {
      console.error('Error deleting brand', err);
      alert('No se pudo eliminar la marca.');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-white/50 text-sm">Cargando marcas...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
            <span>Gestión de Marcas</span>
            <span className="text-xs bg-red-600/20 border border-red-500/40 text-red-400 font-bold px-2.5 py-0.5 rounded-full not-italic">
              {brands.length} Marcas
            </span>
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Administra los logotipos (Cloudinary URLs) y descripciones de las marcas de la tienda.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 hover:scale-105 cursor-pointer"
        >
          <Plus size={18} />
          <span>Agregar Marca</span>
        </button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <div
            key={b.id}
            className="bg-neutral-950 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-xl bg-black border border-white/10 p-2 flex items-center justify-center overflow-hidden">
                  <img src={b.logo} alt={b.name} className="max-w-full max-h-full object-contain" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  b.active ?? true ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-900 text-white/40'
                }`}>
                  {b.active ?? true ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">{b.name}</h3>
                <p className="text-xs text-white/60 line-clamp-2 mt-1">{b.description || 'Sin descripción'}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => handleOpenEdit(b)}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg border border-white/10 flex items-center gap-1.5"
              >
                <Edit size={14} />
                <span>Editar</span>
              </button>
              <button
                onClick={() => setDeletingBrandId(b.id)}
                className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold rounded-lg border border-red-500/20 flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-white/15 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-black uppercase italic text-white">
                {editingBrand ? 'Editar Marca' : 'Agregar Nueva Marca'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-white/50 hover:text-white rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-white/80">Nombre de la Marca *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Adidas, Nike, New Balance"
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-white/80">
                  Logo URL (Cloudinary) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.logo}
                  onChange={(e) => {
                    setLogoError(false);
                    setFormData({ ...formData, logo: e.target.value });
                  }}
                  placeholder="https://res.cloudinary.com/demo/image/upload/v123/brand_logo.png"
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />

                {/* Logo Live Preview */}
                {formData.logo ? (
                  <div className="mt-2 p-3 bg-black border border-white/10 rounded-xl flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-white/10 p-1 flex items-center justify-center">
                      {!logoError ? (
                        <img
                          src={formData.logo}
                          alt="Vista previa logo"
                          className="max-w-full max-h-full object-contain"
                          onError={() => setLogoError(true)}
                        />
                      ) : (
                        <span className="text-[10px] text-red-400">Error</span>
                      )}
                    </div>
                    <span className="text-xs text-white/60">Vista previa del logotipo</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-white/40 italic">Ingresa una URL de imagen válida.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-white/80">Descripción</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve reseña sobre la marca..."
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="brandActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-black text-red-600 focus:ring-0"
                />
                <label htmlFor="brandActive" className="text-xs text-white font-bold cursor-pointer">
                  Marca activa en la tienda pública
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5"
                >
                  <Check size={16} />
                  <span>{saving ? 'Guardando...' : 'Guardar Marca'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingBrandId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-red-500/30 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-black text-white uppercase italic">¿Eliminar Marca?</h3>
            <p className="text-xs text-white/60">
              Se quitará esta marca de la tienda. Los productos vinculados permanecerán en el catálogo.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingBrandId(null)}
                className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deletingBrandId)}
                className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
