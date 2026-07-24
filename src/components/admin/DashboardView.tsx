import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, Tag, Award, Layers, Clock, ArrowRight, TrendingUp, Sparkles, Plus } from 'lucide-react';
import { Product, Brand, Category, ActivityLog } from '../../types';
import { productsService, brandsService, categoriesService, activityService } from '../../services/api';

interface DashboardViewProps {
  onNavigate: (tab: 'products' | 'brands' | 'categories' | 'promos' | 'config') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prods, brs, cats, logs] = await Promise.all([
          productsService.getAll(),
          brandsService.getAll(),
          categoriesService.getAll(),
          activityService.getLogs()
        ]);
        setProducts(prods);
        setBrands(brs);
        setCategories(cats);
        setActivityLogs(logs);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const outOfStockProducts = products.filter(p => (p.stock ?? 10) <= 0);
  const lowStockProducts = products.filter(p => (p.stock ?? 10) > 0 && (p.stock ?? 10) <= 3);
  const promoProducts = products.filter(p => p.tag === 'Oferta' || (p.retailPrice && p.retailPrice > p.price));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/50 text-sm">
        Cargando métricas del sistema...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Title & Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
            <span>Panel General - Dashboard</span>
            <Sparkles size={20} className="text-yellow-400" />
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Resumen en tiempo real del catálogo y configuración de AUKI SPORT
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('products')}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Agregar Producto</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Products */}
        <div 
          onClick={() => onNavigate('products')}
          className="bg-neutral-900/80 border border-white/10 hover:border-red-500/50 p-5 rounded-2xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-white/60">Total Productos</span>
            <div className="p-2.5 bg-red-600/20 text-red-500 rounded-xl group-hover:scale-110 transition-transform">
              <Package size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{products.length}</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> Activos
            </span>
          </div>
        </div>

        {/* Out of Stock */}
        <div 
          onClick={() => onNavigate('products')}
          className="bg-neutral-900/80 border border-white/10 hover:border-amber-500/50 p-5 rounded-2xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-white/60">Sin Stock</span>
            <div className="p-2.5 bg-amber-500/20 text-amber-500 rounded-xl group-hover:scale-110 transition-transform">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{outOfStockProducts.length}</span>
            <span className="text-xs text-white/40">modelos agotados</span>
          </div>
        </div>

        {/* Promo Products */}
        <div 
          onClick={() => onNavigate('products')}
          className="bg-neutral-900/80 border border-white/10 hover:border-pink-500/50 p-5 rounded-2xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-white/60">En Oferta</span>
            <div className="p-2.5 bg-pink-500/20 text-pink-400 rounded-xl group-hover:scale-110 transition-transform">
              <Tag size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-pink-400">{promoProducts.length}</span>
            <span className="text-xs text-white/40">con precio rebajado</span>
          </div>
        </div>

        {/* Brands & Categories */}
        <div 
          onClick={() => onNavigate('brands')}
          className="bg-neutral-900/80 border border-white/10 hover:border-blue-500/50 p-5 rounded-2xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-white/60">Marcas / Categorías</span>
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
              <Award size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">{brands.length}</span>
            <span className="text-xs text-white/50">marcas / {categories.length} cat.</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Low stock alerts & Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Low Stock Alerts */}
        <div className="lg:col-span-7 bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle size={18} />
              <span>Alertas de Stock Bajo</span>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Gestionar Inventario</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {[...outOfStockProducts, ...lowStockProducts].length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {[...outOfStockProducts, ...lowStockProducts].slice(0, 8).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-neutral-900/60 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-black" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.brand} {p.name}</h4>
                      <p className="text-[10px] text-white/50">{p.category} • S/ {p.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                    (p.stock ?? 0) <= 0 ? 'bg-red-950 text-red-400 border border-red-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                  }`}>
                    {(p.stock ?? 0) <= 0 ? 'Agotado (0)' : `Quedan ${p.stock}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/40 italic py-8 text-center">
              Todo el inventario cuenta con stock suficiente.
            </p>
          )}
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-5 bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-white/90 font-bold text-sm uppercase tracking-wider">
              <Clock size={18} className="text-red-500" />
              <span>Últimas Modificaciones</span>
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {activityLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="p-3 bg-neutral-900/50 border border-white/5 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-red-400">{log.action}</span>
                  <span className="text-[10px] text-white/40">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-white/80">{log.details}</p>
                <span className="text-[10px] text-white/40 block italic">{log.user}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
