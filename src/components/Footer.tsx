import React from 'react';
import { Phone, MapPin, MessageCircle, ShieldCheck, Heart, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-black text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center font-black text-xl italic text-white">
                A
              </div>
              <span className="text-2xl font-black italic uppercase tracking-tighter">
                AUKI <span className="text-red-500">SPORT</span>
              </span>
            </div>

            <p className="text-xs text-white/60 leading-relaxed font-normal">
              Tu tienda de confianza en zapatillas 100% originales. Marcas líderes internacionales: Nike, Adidas, New Balance, Reebok, Asics, Merrell, CAT y más.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2.5 bg-neutral-900 hover:bg-red-600 rounded-full transition-colors text-white">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2.5 bg-neutral-900 hover:bg-red-600 rounded-full transition-colors text-white">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-red-500">
              Categorías
            </h4>
            <ul className="space-y-2 text-xs font-bold text-white/60">
              <li><a href="#catalog" className="hover:text-white transition-colors">Colección Hombre</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Colección Mujer</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Zapatillas Trekking</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Especial Fiestas Patrias 🇵🇪</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Ofertas S/ 99</a></li>
            </ul>
          </div>

          {/* WhatsApp Direct Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-red-500">
              Atención & Pedidos
            </h4>
            <div className="space-y-2 text-xs">
              <a 
                href="https://wa.me/51931741682" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-white/10 text-white font-bold transition-all group"
              >
                <MessageCircle size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="block text-[10px] text-white/50">Línea Pedidos 1</span>
                  <span>+51 931 741 682</span>
                </div>
              </a>

              <a 
                href="https://wa.me/51914459904" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-white/10 text-white font-bold transition-all group"
              >
                <MessageCircle size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="block text-[10px] text-white/50">Línea Pedidos 2</span>
                  <span>+51 914 459 904</span>
                </div>
              </a>
            </div>
          </div>

          {/* Store Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-red-500">
              Tienda Física
            </h4>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">AUKI SPORT Lima</strong><br />
                  Envíos a todo el Perú por Olva Courier, Shalom o delivery express.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400 font-bold">
                <ShieldCheck size={14} />
                <span>Atención Lunes a Sábado: 10am - 8pm</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40 font-bold uppercase tracking-wider">
          <p>© 2026 AUKI SPORT. Todos los derechos reservados. Zapatillas Originales.</p>
          <div className="flex items-center gap-4 text-[10px]">
            <span>Delivery Nacional</span>
            <span>•</span>
            <span>Garantía de Tienda</span>
            <span>•</span>
            <a 
              href="/admin" 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-white/30 hover:text-red-400 transition-colors cursor-pointer underline"
            >
              Panel Admin
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
