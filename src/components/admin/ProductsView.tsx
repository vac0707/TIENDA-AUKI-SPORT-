import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Tag, AlertCircle, Check, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Product, Brand, Category } from '../../types';
import { productsService, brandsService, categoriesService } from '../../services/api';
import { CloudinaryImageInput } from './CloudinaryImageInput';

export const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('Todas');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('Todas');
  const [selectedTagFilter, setSelectedTagFilter] = useState('Todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<{
    name: string;
    brand: string;
    category: string;
    price: string;
    retailPrice: string;
    stock: string;
    description: string;
    image: string;
    gallery: string[];
    colors: string[];
    sizes: string[];
    tag: string;
    featured: boolean;
    active: boolean;
  }>({
    name: '',
    brand: 'Adidas',
    category: 'Hombre',
    price: '',
    retailPrice: '',
    stock: '10',
    description: '',
    image: '',
    gallery: [],
    colors: ['Negro', 'Blanco'],
    sizes: ['38', '39', '40', '41', '42'],
    tag: '',
    featured: false,
    active: true
  });

  const [saving, setSaving] = useState(false);
  const [newColorInput, setNewColorInput] = useState('');
  const [newSizeInput, setNewSizeInput] = useState('');

  const STANDARD_SIZES = ['35', '36', '36.5', '37', '37.5', '38', '38.5', '39', '40', '40.5', '41', '41.5', '42', '42.5', '43', '44'];

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, brs, cats] = await Promise.all([
        productsService.getAll(),
        brandsService.getAll(),
        categoriesService.getAll()
      ]);
      setProducts(prods);
      setBrands(brs);
      setCategories(cats);
    } catch (err) {
      console.error('Error loading products list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: brands[0]?.name || 'Adidas',
      category: categories[0]?.name || 'Hombre',
      price: '',
      retailPrice: '',
      stock: '10',
      description: '',
      image: '',
      gallery: [],
      colors: ['Negro', 'Blanco'],
      sizes: ['38', '39', '40', '41', '42'],
      tag: 'Fiestas Patrias',
      featured: false,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price.toString(),
      retailPrice: p.retailPrice ? p.retailPrice.toString() : '',
      stock: (p.stock ?? 10).toString(),
      description: p.description || '',
      image: p.image || '',
      gallery: p.gallery || [],
      colors: p.colors || ['Negro', 'Blanco'],
      sizes: p.sizes || ['38', '39', '40', '41', '42'],
      tag: p.tag || '',
      featured: p.featured || false,
      active: p.active ?? true
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.image.trim()) {
      alert('Por favor completa el nombre, precio e imagen principal (URL Cloudinary).');
      return;
    }

    setSaving(true);
    try {
      const productPayload = {
        name: formData.name.trim(),
        brand: formData.brand,
        category: formData.category,
        price: parseFloat(formData.price),
        retailPrice: formData.retailPrice ? parseFloat(formData.retailPrice) : undefined,
        stock: parseInt(formData.stock, 10) || 0,
        description: formData.description.trim(),
        image: formData.image.trim(),
        gallery: formData.gallery,
        colors: formData.colors,
        sizes: formData.sizes,
        tag: formData.tag || undefined,
        featured: formData.featured,
        active: formData.active,
        rating: editingProduct?.rating || 5
      };

      if (editingProduct) {
        await productsService.update(editingProduct.id, productPayload);
      } else {
        await productsService.create(productPayload);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error('Error al guardar el producto', err);
      alert('Ocurrió un error al guardar el producto.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await productsService.delete(id);
      setDeletingProductId(null);
      await loadData();
    } catch (err) {
      console.error('Error al eliminar producto', err);
      alert('No se pudo eliminar el producto.');
    }
  };

  const toggleSize = (sizeStr: string) => {
    setFormData(prev => {
      const exists = prev.sizes.includes(sizeStr);
      const updated = exists ? prev.sizes.filter(s => s !== sizeStr) : [...prev.sizes, sizeStr];
      return { ...prev, sizes: updated };
    });
  };

  const handleAddCustomColor = () => {
    if (!newColorInput.trim()) return;
    if (!formData.colors.includes(newColorInput.trim())) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, newColorInput.trim()] }));
    }
    setNewColorInput('');
  };

  const handleRemoveColor = (col: string) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== col) }));
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = `${p.brand} ${p.name}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCat === 'Todas' || p.category.toLowerCase() === selectedCat.toLowerCase();
      const matchesBrand = selectedBrandFilter === 'Todas' || p.brand.toLowerCase() === selectedBrandFilter.toLowerCase();
      const matchesTag = selectedTagFilter === 'Todos' || p.tag === selectedTagFilter;
      return matchesSearch && matchesCat && matchesBrand && matchesTag;
    });
  }, [products, searchQuery, selectedCat, selectedBrandFilter, selectedTagFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/50 text-sm">
        Cargando listado de productos...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
            <span>Gestión de Productos</span>
            <span className="text-xs bg-red-600/20 border border-red-500/40 text-red-400 font-bold px-2.5 py-0.5 rounded-full not-italic">
              {products.length} Muestras
            </span>
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Agrega, edita o actualiza el catálogo, precios, stock e imágenes en Cloudinary.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 hover:scale-105 cursor-pointer"
        >
          <Plus size={18} />
          <span>Agregar Producto</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por marca o nombre..."
              className="w-full bg-black border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
          >
            <option value="Todas">Todas las Categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrandFilter}
            onChange={(e) => setSelectedBrandFilter(e.target.value)}
            className="bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
          >
            <option value="Todas">Todas las Marcas</option>
            {brands.map(b => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTagFilter}
            onChange={(e) => setSelectedTagFilter(e.target.value)}
            className="bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
          >
            <option value="Todos">Todos los Estado/Tags</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Oferta">Oferta</option>
            <option value="Top Ventas">Top Ventas</option>
            <option value="Fiestas Patrias">Fiestas Patrias</option>
          </select>

        </div>
      </div>

      {/* Products Table */}
      <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="bg-neutral-900 border-b border-white/10 text-white/50 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio / Antes</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Etiqueta</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-xl bg-black border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="font-black text-white text-sm">{p.brand} {p.name}</div>
                          <div className="text-[11px] text-white/50">{p.sizes.length} tallas • {p.colors.length} colores</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-[11px] font-bold">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">
                        S/ {p.price.toFixed(2)}
                      </div>
                      {p.retailPrice && p.retailPrice > p.price && (
                        <div className="text-[10px] text-white/40 line-through">
                          S/ {p.retailPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        (p.stock ?? 10) <= 0
                          ? 'bg-red-950 text-red-400 border border-red-500/30'
                          : (p.stock ?? 10) <= 5
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {(p.stock ?? 10) <= 0 ? 'Agotado (0)' : `${p.stock ?? 10} unid.`}
                      </span>
                    </td>
                    <td className="p-4">
                      {p.tag ? (
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black ${
                          p.tag === 'Fiestas Patrias' ? 'bg-red-600 text-white' :
                          p.tag === 'Nuevo' ? 'bg-emerald-500 text-black' :
                          p.tag === 'Oferta' ? 'bg-pink-600 text-white' : 'bg-amber-400 text-black'
                        }`}>
                          {p.tag}
                        </span>
                      ) : (
                        <span className="text-white/30 text-[10px] italic">Sin etiqueta</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 bg-neutral-900 hover:bg-neutral-800 text-white/80 hover:text-white rounded-lg border border-white/10 transition-colors"
                          title="Editar producto"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(p.id)}
                          className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg border border-red-500/20 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/40 italic">
                    No se encontraron productos coincidentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-950 border border-white/15 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl my-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-white">
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                    Nombre de la Zapatilla *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: VL Court Base / Switch Move / Falcon"
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                    Marca *
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                    Precio de Venta (S/) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="189.90"
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                    Precio Anterior / Tachado (S/)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                    placeholder="239.00"
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                    Stock Disponible (Unidades) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="10"
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                    Etiqueta Promocional
                  </label>
                  <select
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Sin Etiqueta</option>
                    <option value="Fiestas Patrias">Fiestas Patrias 🇵🇪</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Oferta">Oferta</option>
                    <option value="Top Ventas">Top Ventas</option>
                  </select>
                </div>

              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                  Descripción Corta del Producto
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles del calzado, material capellada, tipo de suela, usos..."
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Sizes Manager */}
              <div className="space-y-2 bg-neutral-900/40 p-4 rounded-2xl border border-white/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                  Tallas Disponibles
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STANDARD_SIZES.map(s => {
                    const isSelected = formData.sizes.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected ? 'bg-red-600 text-white shadow-md' : 'bg-black text-white/60 border border-white/10 hover:border-white/30'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors Manager */}
              <div className="space-y-2 bg-neutral-900/40 p-4 rounded-2xl border border-white/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                  Colores Disponibles
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {formData.colors.map((c) => (
                    <span key={c} className="bg-black border border-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(c)}
                        className="text-white/40 hover:text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newColorInput}
                      onChange={(e) => setNewColorInput(e.target.value)}
                      placeholder="Otro color..."
                      className="bg-black border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white w-28"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Cloudinary Image Component */}
              <CloudinaryImageInput
                mainImage={formData.image}
                onChangeMainImage={(url) => setFormData({ ...formData, image: url })}
                galleryImages={formData.gallery}
                onChangeGalleryImages={(urls) => setFormData({ ...formData, gallery: urls })}
              />

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Check size={16} />
                  <span>{saving ? 'Guardando...' : editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-red-500/30 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-black text-white uppercase italic">¿Confirmar Eliminación?</h3>
            <p className="text-xs text-white/60">
              Esta acción eliminará el producto del catálogo. Esta operación es irreversible.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteProduct(deletingProductId)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl"
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
