
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { DeviceList } from './pages/DeviceList';
import { DeviceDetail } from './pages/DeviceDetail';
import { MOCK_DEVICES } from './mockData';
import { BellIcon, SearchIcon, UserIcon } from './components/Icons';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const renderContent = () => {
    if (selectedDeviceId) {
      const device = MOCK_DEVICES.find(d => d.id === selectedDeviceId);
      if (device) return <DeviceDetail device={device} onBack={() => setSelectedDeviceId(null)} />;
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'devices':
        return <DeviceList onSelect={setSelectedDeviceId} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center" style={{ height: '60vh', color: 'var(--text-muted)' }}>
            <h2 className="text-xl font-semibold">Раздел "{activePage}" еще не реализован</h2>
            <p className="text-sm">Пожалуйста, выберите "Дашборд" или "Постоматы"</p>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    if (selectedDeviceId) return 'Детали устройства';
    const titles: Record<string, string> = {
      dashboard: 'Обзор сети',
      devices: 'Реестр постоматов',
      incidents: 'Инциденты и Алерты',
      config: 'Настройки'
    };
    return titles[activePage] || 'Панель управления';
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activePage={activePage} setActivePage={(page) => {
        setActivePage(page);
        setSelectedDeviceId(null);
      }} />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header className="bg-white flex items-center justify-between" style={{ height: '64px', borderBottom: '1px solid var(--border)', padding: '0 32px', position: 'sticky', top: 0, zIndex: 10 }}>
          <h2 className="font-bold" style={{ fontSize: '18px' }}>{getPageTitle()}</h2>
          
          <div className="flex items-center gap-6">
            <div style={{ position: 'relative' }}>
              <SearchIcon size={18} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Поиск..." 
                style={{ width: '240px', padding: '6px 12px 6px 36px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '99px', fontSize: '14px', outline: 'none' }}
              />
            </div>
            
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', position: 'relative' }}>
              <BellIcon size={20} />
              <div style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', background: 'red', borderRadius: '50%', border: '2px solid white' }} />
            </button>
            
            <div className="flex items-center gap-3" style={{ paddingLeft: '24px', borderLeft: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'right' }}>
                <p className="text-sm font-bold">Артем А.</p>
                <p className="text-xs text-muted font-bold" style={{ fontSize: '9px' }}>ADMINISTRATOR</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(45deg, var(--primary), #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
                <UserIcon size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8" style={{ maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
