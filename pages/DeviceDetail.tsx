
import React, { useState } from 'react';
import { ArrowLeftIcon, SparklesIcon } from '../components/Icons';
import { Postomat, CellStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { getDiagnosticSummary } from '../geminiService';

interface DeviceDetailProps {
  device: Postomat;
  onBack: () => void;
}

export const DeviceDetail: React.FC<DeviceDetailProps> = ({ device, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cells'>('overview');
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white rounded-lg border border-border hover:bg-bg-main transition-colors"
          >
            <ArrowLeftIcon size={20} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl lg:text-2xl font-bold truncate">{device.name}</h2>
              <StatusBadge status={device.status} />
            </div>
            <p className="text-text-muted text-sm truncate">{device.address}</p>
          </div>
        </div>
        <button 
          onClick={handleAiDiagnostic}
          disabled={loadingAi}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          style={{ background: '#9333ea', opacity: loadingAi ? 0.5 : 1 }}
        >
          <SparklesIcon size={18} />
          {loadingAi ? 'Анализ...' : 'AI Диагностика'}
        </button>
      </div>

      {aiSummary && (
        <div className="bg-[#faf5ff] border border-[#e9d5ff] rounded-xl p-4 flex gap-4">
          <div className="p-2 bg-[#f3e8ff] rounded-full h-fit shrink-0">
            <SparklesIcon style={{ color: '#9333ea' }} size={20} />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-[#581c87] mb-1">AI Инсайт:</h4>
            <div className="text-sm text-[#6b21a8] whitespace-pre-line leading-relaxed">{aiSummary}</div>
            <button onClick={() => setAiSummary(null)} className="mt-2 text-[#9333ea] font-bold text-[11px] hover:underline">Закрыть</button>
          </div>
        </div>
      )}

      <div className="flex border-b border-border overflow-x-auto scrollbar-hide">
        {['overview', 'cells'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`font-medium px-6 py-4 text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            {tab === 'overview' ? 'Обзор' : 'Ячейки'}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-semibold mb-4 pb-2 border-b border-border">Системная информация</h3>
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between gap-4"><span className="text-text-muted">ID Устройства:</span><span className="font-mono break-all text-right">{device.id}</span></div>
                <div className="flex justify-between gap-4"><span className="text-text-muted">Версия ПО:</span><span className="text-right">{device.config.softwareVersion}</span></div>
                <div className="flex justify-between gap-4"><span className="text-text-muted">Координаты:</span><span className="text-right">{device.coordinates.join(', ')}</span></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-semibold mb-4 pb-2 border-b border-border">Статистика ячеек</h3>
              <div className="flex gap-4 items-end h-32">
                {[
                  { label: 'Свободно', val: device.cells.filter(c => c.status === CellStatus.FREE).length, color: 'var(--status-online)' },
                  { label: 'Занято', val: device.cells.filter(c => c.status === CellStatus.OCCUPIED).length, color: 'var(--text-muted)' }
                ].map((s, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                    <div className="w-full bg-bg-main rounded h-full relative overflow-hidden">
                       <div className="absolute bottom-0 w-full rounded-t transition-all duration-500" style={{ height: `${(s.val/device.cells.length)*100}%`, background: s.color }} />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold">{s.val}</span>
                      <span className="text-[10px] text-text-muted uppercase">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cells' && (
          <div className="bg-white p-4 lg:p-6 rounded-xl border shadow-sm">
             <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-3">
                {device.cells.map((cell) => (
                  <div 
                    key={cell.id} 
                    className={`p-3 rounded-lg border border-border flex flex-col items-center gap-2 transition-colors ${
                      cell.status === CellStatus.FREE ? 'bg-green-50/50 border-green-100' : 'bg-bg-main'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-text-muted">{cell.id}</span>
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      cell.status === CellStatus.FREE ? 'bg-status-online shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'
                    }`} />
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>

  );
};
