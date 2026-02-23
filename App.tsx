
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { DeviceList } from './pages/DeviceList';
import { DeviceDetail } from './pages/DeviceDetail';
import { LoginPage } from './pages/LoginPage';
import { MOCK_DEVICES } from './mockData';
import { BellIcon, SearchIcon, UserIcon, LogoutIcon, MenuIcon, XIcon } from './components/Icons';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActivePage('dashboard');
    setSelectedDeviceId(null);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
          <div className="flex flex-col items-center justify-center h-[60vh] text-text-muted">
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

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen relative overflow-x-hidden">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          activePage={activePage} 
          setActivePage={(page) => {
            setActivePage(page);
            setSelectedDeviceId(null);
            setIsSidebarOpen(false);
          }} 
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white flex items-center justify-between h-16 border-b border-border px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="p-2 lg:hidden text-text-muted hover:bg-bg-main rounded-lg"
            >
              <MenuIcon size={24} />
            </button>
            <h2 className="font-bold text-base lg:text-lg truncate">{getPageTitle()}</h2>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-6">
            <div className="relative hidden md:block">
              <SearchIcon size={18} className="text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Поиск..." 
                className="w-48 lg:w-60 pl-10 pr-4 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-full text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <button className="p-2 text-text-muted relative hover:bg-bg-main rounded-lg transition-colors">
              <BellIcon size={20} />
              <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-6 border-l border-border">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold leading-tight">Артем А.</p>
                <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">ADMINISTRATOR</p>
              </div>
              <div className="flex items-center gap-1 lg:gap-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <UserIcon size={18} />
                </div>
                <button 
                  onClick={handleLogout}
                  title="Выйти"
                  className="p-2 text-text-muted hover:text-red-500 transition-colors"
                >
                  <LogoutIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;

