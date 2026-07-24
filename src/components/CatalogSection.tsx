import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { Product, CartItem, Category } from '../types';
import { Search, Filter, SlidersHorizontal, RefreshCw, Sparkles, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

interface CatalogSectionProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onDirectWhatsApp: (product: Product) => void;
  categoriesList?: Category[];
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  searchQuery,
  onSearchChange,
  onQuickView,
  onAddToCart,
  onDirectWhatsApp,
  categoriesList = []
}) => {
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('Todas');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'popular'>('recent');
  const [priceMax, setPriceMax] = useState<number>(800);

  // Dynamic categories from Admin, or default fallback
  const activeCategories = categoriesList.filter(c => c.active !== false).map(c => c.name);
  const categories = ['Todos', ...Array.from(new Set(activeCategories))];
  
  const sizesList = ['Todas', '35', '36', '36.5', '37', '37.5', '38', '38.5', '39', '40', '40.5', '41', '41.5', '42', '42.5', '43', '44'];
  const tagsList = ['Todos', 'Nuevo', 'Oferta', 'Top Ventas', 'Fiestas Patrias'];

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category Filter
      const matchCategory = selectedCategory === 'Todos' || 
        (selectedCategory === 'Ofertas' && (p.tag === 'Oferta' || p.price <= 170)) ||
        p.category.toLowerCase().includes(selectedCategory.toLowerCase());

      // Brand Filter
      const matchBrand = selectedBrand === 'Todas' || 
        p.brand.toLowerCase() === selectedBrand.toLowerCase();

      // Search Query Filter
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query);

      // Size Filter
      const matchSize = selectedSizeFilter === 'Todas' || 
        p.sizes.includes(selectedSizeFilter);

      // Tag Filter
      const matchTag = selectedTagFilter === 'Todos' || 
        p.tag === selectedTagFilter;

      // Price Max Filter
      const matchPrice = p.price <= priceMax;

      return matchCategory && matchBrand && matchSearch && matchSize && matchTag && matchPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'popular') return (b.salesCount || 0) - (a.salesCount || 0);
      return 0; // recent default
    });
  }, [products, selectedCategory, selectedBrand, searchQuery, selectedSizeFilter, selectedTagFilter, priceMax, sortBy]);

  const handleResetFilters = () => {
    onSelectCategory('Todos');
    onSelectBrand('Todas');
    onSearchChange('');
    setSelectedSizeFilter('Todas');
    setSelectedTagFilter('Todos');
    setPriceMax(800);
    setSortBy('recent');
  };

  return (
    <section id="catalog" className="py-16 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 block mb-1">
              Catálogo AUKI SPORT
            </span>
            <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tight">
              {searchQuery ? `Resultados para "${searchQuery}"` : selectedCategory !== 'Todos' ? `Categoría: ${selectedCategory}` : 'Nuestra Colección'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-neutral-900 border border-white/20 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500"
            >
              <option value="recent">Más recientes</option>
              <option value="popular">Más vendidos</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-white/10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2",
                selectedCategory === cat 
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105" 
                  : "bg-neutral-900 text-white/70 hover:text-white border border-white/10 hover:border-white/30"
              )}
            >
              {cat === 'Fiestas Patrias' && <Sparkles size={14} className="text-red-400" />}
              {cat === 'Ofertas' && <Tag size={14} className="text-red-400" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Advanced Filters Toolbar */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-5 mb-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500">
              <SlidersHorizontal size={16} />
              <span>Filtros Avanzados</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-white/50 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={12} />
              <span>Limpiar todo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            {/* Search Input */}
            <div>
              <label className="text-[10px] font-bold uppercase text-white/60 block mb-1">Buscar por modelo</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  placeholder="Ej. Samba, Ultimashow, Zoom..."
                  className="w-full bg-black border border-white/20 rounded-lg py-2 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-white/40" />
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className="text-[10px] font-bold uppercase text-white/60 block mb-1">Filtrar por Talla</label>
              <select
                value={selectedSizeFilter}
                onChange={e => setSelectedSizeFilter(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-red-500"
              >
                {sizesList.map(s => (
                  <option key={s} value={s}>{s === 'Todas' ? 'Todas las tallas' : `Talla ${s}`}</option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="text-[10px] font-bold uppercase text-white/60 block mb-1">Etiqueta</label>
              <select
                value={selectedTagFilter}
                onChange={e => setSelectedTagFilter(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-red-500"
              >
                {tagsList.map(t => (
                  <option key={t} value={t}>{t === 'Todos' ? 'Todas las promociones' : t}</option>
                ))}
              </select>
            </div>

            {/* Price Max Slider */}
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-white/60 mb-1">
                <span>Precio Máximo</span>
                <span className="text-red-400 font-extrabold">Hasta S/ {priceMax}</span>
              </div>
              <input
                type="range"
                min="100"
                max="800"
                step="20"
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-white/60 font-bold uppercase">
          <span>Mostrando {filteredProducts.length} zapatillas encontradas</span>
          {(selectedBrand !== 'Todas' || selectedCategory !== 'Todos' || searchQuery) && (
            <span className="text-red-400 font-normal">Filtro activo: {selectedBrand} / {selectedCategory}</span>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onDirectWhatsApp={onDirectWhatsApp}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-neutral-900/50 border border-white/10 rounded-3xl p-8">
            <Search size={48} className="mx-auto text-white/20 animate-pulse" />
            <h3 className="text-xl font-black uppercase text-white">No encontramos productos</h3>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              No hay zapatillas que coincidan con la búsqueda o filtros aplicados. Intenta cambiar de marca o borrar los filtros.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
            >
              Mostrar Todo el Catálogo
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
