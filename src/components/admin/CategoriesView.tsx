import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers, Check, X, AlertCircle } from 'lucide-react';
import { Category } from '../../types';
import { categoriesService } from '../../services/api';

export const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true
  });
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', active: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      active: cat.active ?? true
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Ingresa el nombre de la categoría.');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        await categoriesService.update(editingCategory.id, formData);
      } else {
        await categoriesService.create(formData);
      }
      setIsModalOpen(false);
      await loadCategories();
    } catch (err) {
      console.error('Error saving category', err);
      alert('Error al guardar la categoría.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoriesService.delete(id);
      setDeletingCatId(null);
      await loadCategories();
    } catch (err) {
      console.error('Error deleting category', err);
      alert('No se pudo eliminar la categoría.');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-white/50 text-sm">Cargando categorías...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
            <span>Gestión de Categorías</span>
            <span className="text-xs bg-red-600/20 border border-red-500/40 text-red-400 font-bold px-2.5 py-0.5 rounded-full not-italic">
              {categories.length} Categorías
            </span>
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Crea, modifica o elimina las secciones del menú de navegación de la tienda.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 hover:scale-105 cursor-pointer"
        >
          <Plus size={18} />
          <span>Agregar Categoría</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="bg-neutral-900 border-b border-white/10 text-white/50 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Categoría</th>
                <th className="p-4">Descripción</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-black text-white text-sm">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-red-500" />
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/60">
                    {c.description || 'Sin descripción'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      c.active ?? true ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-900 text-white/40'
                    }`}>
                      {c.active ?? true ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-2 bg-neutral-900 hover:bg-neutral-800 text-white/80 hover:text-white rounded-lg border border-white/10 transition-colors"
                        title="Editar categoría"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setDeletingCatId(c.id)}
                        className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg border border-red-500/20 transition-colors"
                        title="Eliminar categoría"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-white/15 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-black uppercase italic text-white">
                {editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-white/80">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Niños, Outdoor, Accesorios"
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-white/80">Descripción</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre esta categoría..."
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-black text-red-600 focus:ring-0"
                />
                <label htmlFor="catActive" className="text-xs text-white font-bold cursor-pointer">
                  Categoría activa en la tienda
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
                  className="px-5 py-2.5 bg-red-600 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5"
                >
                  <Check size={16} />
                  <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingCatId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-red-500/30 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-black text-white uppercase italic">¿Eliminar Categoría?</h3>
            <p className="text-xs text-white/60">
              Esta acción quitará la categoría de la navegación principal.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingCatId(null)}
                className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deletingCatId)}
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
