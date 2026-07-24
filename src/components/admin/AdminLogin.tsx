import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { authService } from '../../services/api';
import { AdminUser } from '../../types';

interface AdminLoginProps {
  onSuccess: (user: AdminUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setError(res.message || 'Error al iniciar sesión');
      }
    } catch {
      setError('Ocurrió un error al conectar con el servicio de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@aukisport.com');
    setPassword('auki2026');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 selection:bg-red-600 selection:text-white">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-neutral-950 border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 border border-red-500/40 rounded-2xl text-red-500 mb-2">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white italic">
            AUKI SPORT <span className="text-red-500 font-normal text-lg">ADMIN</span>
          </h1>
          <p className="text-xs text-white/60">
            Acceso exclusivo al Sistema de Administración
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/60 border border-red-500/40 p-4 rounded-2xl flex items-start gap-3 text-red-200 text-xs">
            <ShieldAlert size={18} className="text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
              Correo Electrónico / Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Mail size={16} />
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aukisport.com"
                className="w-full bg-black border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Lock size={16} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Verificando...' : 'Ingresar al Panel'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="pt-4 border-t border-white/10 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-white/50">
            <Sparkles size={12} className="text-yellow-400" />
            <span>Acceso rápido de prueba:</span>
          </div>
          <div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-red-400 hover:text-red-300 font-bold underline cursor-pointer"
            >
              Cargar datos demo (admin@aukisport.com / auki2026)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
