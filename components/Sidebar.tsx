
import React from 'react';
import { DashboardIcon, PackageIcon, AlertIcon, SettingsIcon } from './Icons';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Дашборд', icon: DashboardIcon },
  { id: 'devices', label: 'Постоматы', icon: PackageIcon },
  { id: 'incidents', label: 'Инциденты', icon: AlertIcon },
  { id: 'config', label: 'Настройки', icon: SettingsIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <aside className="sidebar flex flex-col h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'white' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>P</div>
          Admin
        </h1>
      </div>
      <nav className="flex-col" style={{ flex: 1, marginTop: '1rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-6" style={{ borderTop: '1px solid #1e293b' }}>
        <div className="flex items-center gap-3 text-sm" style={{ color: '#94a3b8' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>AD</div>
          <div>
            <p style={{ color: 'white', fontWeight: 500 }}>Admin</p>
            <p className="text-xs">v2.5.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
