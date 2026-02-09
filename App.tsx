
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { DeviceList } from './pages/DeviceList';
import { DeviceDetail } from './pages/DeviceDetail';
import { MOCK_DEVICES } from './mockData';
import { Bell, Search, User } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
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
      reports: 'Аналитические отчеты',
      audit: 'Журнал аудита',
      users: 'Управление доступом',
      config: 'Системные настройки'
    };
    return titles[activePage] || 'Панель управления';
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activePage={activePage} setActivePage={(page) => {
        setActivePage(page);
        setSelectedDeviceId(null);
      }} />
      
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-800">{getPageTitle()}</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Глобальный поиск..." 
                className="pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
              />
            </div>
            
            <button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-bold">Дмитрий А.</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>

      {/* Toast notifications container could be added here */}
    </div>
  );
};

export default App;
