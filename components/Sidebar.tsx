
import React from 'react';
import { LayoutDashboard, Package, AlertCircle, FileText, Settings, ShieldCheck, ListChecks } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { id: 'devices', label: 'Постоматы', icon: Package },
  { id: 'incidents', label: 'Инциденты', icon: AlertCircle },
  { id: 'reports', label: 'Отчеты', icon: FileText },
  { id: 'audit', label: 'Аудит', icon: ListChecks },
  { id: 'users', label: 'Пользователи', icon: ShieldCheck },
  { id: 'config', label: 'Настройки', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">P</div>
          Postomat Admin
        </h1>
      </div>
      <nav className="flex-1 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">AD</div>
          <div>
            <p className="text-white font-medium">Administrator</p>
            <p className="text-xs">v2.5.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
