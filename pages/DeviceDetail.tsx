
import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Activity, Layers, Thermometer, Settings, Terminal, Sparkles } from 'lucide-react';
import { Postomat, CellStatus, DeviceStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { getDiagnosticSummary } from '../geminiService';

interface DeviceDetailProps {
  device: Postomat;
  onBack: () => void;
}

export const DeviceDetail: React.FC<DeviceDetailProps> = ({ device, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cells' | 'telemetry' | 'config' | 'commands'>('overview');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAiDiagnostic = async () => {
    setLoadingAi(true);
    const logs = "Door closed successfully. Unauthorized pickup attempt detected. Signal dropped.";
    const tel = "Temperature: 4.2C, RSSI: -65dBm, Voltage: 231V";
    const result = await getDiagnosticSummary(logs, tel);
    setAiSummary(result || "Аналитика недоступна.");
    setLoadingAi(false);
  };

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: Activity },
    { id: 'cells', label: 'Ячейки', icon: Layers },
    { id: 'telemetry', label: 'Телеметрия', icon: Thermometer },
    { id: 'config', label: 'Конфигурация', icon: Settings },
    { id: 'commands', label: 'Команды', icon: Terminal },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{device.name}</h2>
              <StatusBadge status={device.status} />
            </div>
            <p className="text-gray-500 text-sm">{device.address}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAiDiagnostic}
            disabled={loadingAi}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Sparkles size={18} />
            {loadingAi ? 'Анализ...' : 'AI Диагностика'}
          </button>
          <button className="p-2 hover:bg-white rounded-lg border border-gray-200">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {aiSummary && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="p-2 bg-purple-100 rounded-full h-fit">
            <Sparkles className="text-purple-600" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">AI Инсайт по состоянию:</h4>
            <div className="text-purple-800 text-sm whitespace-pre-line leading-relaxed">
              {aiSummary}
            </div>
            <button onClick={() => setAiSummary(null)} className="mt-2 text-xs font-bold text-purple-600 hover:underline">Закрыть</button>
          </div>
        </div>
      )}

      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id 
                ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Системная информация</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-gray-500">ID Устройства:</span>
                <span className="font-mono">{device.id}</span>
                <span className="text-gray-500">Версия ПО:</span>
                <span>{device.config.softwareVersion}</span>
                <span className="text-gray-500">Режим обслуживания:</span>
                <span>{device.config.maintenanceMode ? 'Включен' : 'Выключен'}</span>
                <span className="text-gray-500">Координаты:</span>
                <span>{device.coordinates.join(', ')}</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-lg border-b pb-2 mb-4">Статус ячеек</h3>
              <div className="flex gap-4 items-end h-32">
                 {[
                   { label: 'Свободно', value: device.cells.filter(c => c.status === CellStatus.FREE).length, color: 'bg-green-500' },
                   { label: 'Занято', value: device.cells.filter(c => c.status === CellStatus.OCCUPIED).length, color: 'bg-slate-400' },
                   { label: 'Ошибка', value: device.cells.filter(c => c.status === CellStatus.FAULT).length, color: 'bg-red-500' }
                 ].map((bar, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-2">
                     <div className="w-full bg-gray-50 rounded-t-lg relative" style={{ height: '100px' }}>
                       <div 
                         className={`absolute bottom-0 w-full rounded-t-lg ${bar.color}`}
                         style={{ height: `${(bar.value / device.cells.length) * 100}%` }}
                       />
                     </div>
                     <span className="text-[10px] text-gray-500 font-bold uppercase">{bar.label}</span>
                     <span className="text-sm font-bold">{bar.value}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cells' && (
          <div className="bg-white p-6 rounded-xl border border-gray-100">
             <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {device.cells.map((cell) => (
                  <div 
                    key={cell.id} 
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer ${
                      cell.status === CellStatus.FREE ? 'bg-green-50 border-green-200' :
                      cell.status === CellStatus.OCCUPIED ? 'bg-gray-50 border-gray-200' :
                      cell.status === CellStatus.FAULT ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{cell.type}</span>
                    <span className="text-sm font-bold">{cell.id}</span>
                    <StatusBadge status={cell.status} />
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="max-w-2xl bg-white p-6 rounded-xl border border-gray-100 space-y-6">
            <h3 className="font-semibold text-lg border-b pb-2">Параметры работы</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Лимит попыток (Pickup)</p>
                  <p className="text-xs text-gray-500">Кол-во неудачных вводов кода до блокировки</p>
                </div>
                <input type="number" defaultValue={device.config.pickupRetryLimit} className="w-20 px-2 py-1 border rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">TTL открытия (сек)</p>
                  <p className="text-xs text-gray-500">Время ожидания после команды на открытие</p>
                </div>
                <input type="number" defaultValue={device.config.openTTL} className="w-20 px-2 py-1 border rounded" />
              </div>
              <div className="pt-4 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Сохранить</button>
                <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">Сброс</button>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'telemetry' || activeTab === 'commands') && (
           <div className="bg-slate-50 p-12 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500">
             <div className="p-4 bg-slate-100 rounded-full mb-4">
               {activeTab === 'telemetry' ? <Thermometer size={32} /> : <Terminal size={32} />}
             </div>
             <p className="font-medium">Модуль в разработке</p>
             <p className="text-sm">Данные реального времени появятся после интеграции с IoT Hub</p>
           </div>
        )}
      </div>
    </div>
  );
};
