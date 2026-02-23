
import React, { useState } from 'react';
import { LockIcon, UserIcon } from '../components/Icons';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Имитация задержки сети
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError('Неверный логин или пароль');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xl w-full max-w-[400px]">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/30">P</div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-sm text-text-muted">Postomat Control Center</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">ЛОГИН</label>
            <div className="relative">
              <UserIcon size={18} className="text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="w-full pl-11 pr-4 py-3 bg-bg-main border border-border rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">ПАРОЛЬ</label>
            <div className="relative">
              <LockIcon size={18} className="text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-11 pr-4 py-3 bg-bg-main border border-border rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-100 animate-shake">
              {String(error)}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 mt-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Вход...</span>
              </div>
            ) : 'Войти в систему'}
          </button>
        </form>

        <p className="text-center text-[10px] text-text-muted mt-10 uppercase tracking-widest font-medium">
          © 2025 ParcelLocker System
        </p>
      </div>
    </div>
  );

};
