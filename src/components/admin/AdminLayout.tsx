import React, { useState } from 'react';
import { LayoutDashboard, Package, Award, Layers, Sparkles, Settings, ExternalLink, LogOut, Menu, X, Shield, ChevronRight } from 'lucide-react';
import { AdminUser } from '../../types';
import { DashboardView } from './DashboardView';
import { ProductsView } from './ProductsView';
import { BrandsView } from './BrandsView';
import { CategoriesView } from './CategoriesView';
import { PromotionsView } from './PromotionsView';
import { ConfigView } from './ConfigView';

interface AdminLayoutProps {
  user: AdminUser;
  onLogout: () => void;
  onGoToPublicStore: () => void;
}

export type AdminTab = 'dashboard' | 'products' | 'brands' | 'categories' | 'promos' | 'config';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout, onGoToPublicStore }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as AdminTab, label: 'Productos', icon: Package, badge: 'Catálogo' },
    { id: 'brands' as AdminTab, label: 'Marcas', icon: Award },
    { id: 'categories' as AdminTab, label: 'Categorías', icon: Layers },
    { id: 'promos' as AdminTab, label: 'Promociones', icon: Sparkles, badge: 'Patrias 🇵🇪' },
    { id: 'config' as AdminTab, label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white rounded-xl bg-neutral-900 border border-white/10"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-black border border-red-500/50 flex items-center justify-center font-black italic text-white text-base shadow-lg shadow-red-600/30">
              A
            </div>
            <div>
              <div className="font-black italic uppercase text-sm tracking-tight text-white leading-none">
                AUKI SPORT <span className="text-red-500 text-xs font-normal">ADMIN</span>
              </div>
              <div className="text-[10px] text-white/50 font-mono">Panel de Control v2.0</div>
            </div>
          </div>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGoToPublicStore}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white/90 hover:text-white rounded-xl border border-white/10 text-xs font-bold transition-all"
            title="Ver Tienda Pública"
          >
            <span>Ver Tienda</span>
            <ExternalLink size={14} className="text-red-400" />
          </button>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500/40 text-red-400 font-bold text-xs flex items-center justify-center">
              <Shield size={14} />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-white leading-tight">{user.name || user.username}</div>
              <div className="text-[10px] text-white/40 capitalize">{user.role}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 sm:px-3 sm:py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>

      </header>

      <div className="flex-1 flex relative">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-neutral-950 border-r border-white/10 p-4 space-y-2 shrink-0">
          <div className="text-[10px] font-black uppercase tracking-wider text-white/40 px-3 py-2">
            Navegación del Sistema
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-black text-white' : 'bg-red-950 text-red-400 border border-red-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight size={14} />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex">
            <div className="w-72 bg-neutral-950 border-r border-white/10 p-5 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="font-black italic uppercase text-sm text-white">
                    Menú Administrador
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-white/50 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold ${
                          isActive ? 'bg-red-600 text-white' : 'text-white/70 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onGoToPublicStore();
                  }}
                  className="w-full py-3 bg-neutral-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-white/10"
                >
                  <span>Ver Tienda Pública</span>
                  <ExternalLink size={14} />
                </button>
              </div>

            </div>

            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === 'products' && <ProductsView />}
          {activeTab === 'brands' && <BrandsView />}
          {activeTab === 'categories' && <CategoriesView />}
          {activeTab === 'promos' && <PromotionsView />}
          {activeTab === 'config' && <ConfigView />}
        </main>

      </div>

    </div>
  );
};
