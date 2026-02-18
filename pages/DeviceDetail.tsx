
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            style={{ padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer' }}
          >
            <ArrowLeftIcon size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{device.name}</h2>
              <StatusBadge status={device.status} />
            </div>
            <p className="text-muted text-sm">{device.address}</p>
          </div>
        </div>
        <button 
          onClick={handleAiDiagnostic}
          disabled={loadingAi}
          className="btn-primary flex items-center gap-2"
          style={{ background: '#9333ea', opacity: loadingAi ? 0.5 : 1 }}
        >
          <SparklesIcon size={18} />
          {loadingAi ? 'Анализ...' : 'AI Диагностика'}
        </button>
      </div>

      {aiSummary && (
        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px' }}>
          <div style={{ padding: '8px', background: '#f3e8ff', borderRadius: '50%', height: 'fit-content' }}>
            <SparklesIcon style={{ color: '#9333ea' }} size={20} />
          </div>
          <div>
            <h4 className="font-semibold" style={{ color: '#581c87', marginBottom: '4px' }}>AI Инсайт:</h4>
            <div className="text-sm" style={{ color: '#6b21a8', whiteSpace: 'pre-line' }}>{aiSummary}</div>
            <button onClick={() => setAiSummary(null)} style={{ marginTop: '8px', background: 'none', border: 'none', color: '#9333ea', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>Закрыть</button>
          </div>
        </div>
      )}

      <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
        {['overview', 'cells'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className="font-medium"
            style={{ 
              padding: '16px 24px', 
              fontSize: '14px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {tab === 'overview' ? 'Обзор' : 'Ячейки'}
          </button>
        ))}
      </div>

      <div style={{ minHeight: '400px' }}>
        {activeTab === 'overview' && (
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-semibold" style={{ marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Системная информация</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between"><span className="text-muted">ID Устройства:</span><span style={{ fontFamily: 'monospace' }}>{device.id}</span></div>
                <div className="flex justify-between"><span className="text-muted">Версия ПО:</span><span>{device.config.softwareVersion}</span></div>
                <div className="flex justify-between"><span className="text-muted">Координаты:</span><span>{device.coordinates.join(', ')}</span></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-semibold" style={{ marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Статистика ячеек</h3>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '140px' }}>
                {[
                  { label: 'Свободно', val: device.cells.filter(c => c.status === CellStatus.FREE).length, color: 'var(--status-online)' },
                  { label: 'Занято', val: device.cells.filter(c => c.status === CellStatus.OCCUPIED).length, color: 'var(--text-muted)' }
                ].map((s, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div style={{ width: '100%', background: '#f8fafc', borderRadius: '4px', height: '100px', position: 'relative' }}>
                       <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${(s.val/device.cells.length)*100}%`, background: s.color, borderRadius: '4px' }} />
                    </div>
                    <span className="text-xs font-bold">{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cells' && (
          <div className="bg-white p-6 rounded-xl border shadow-sm">
             <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px' }}>
                {device.cells.map((cell) => (
                  <div 
                    key={cell.id} 
                    style={{ 
                      padding: '12px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '4px',
                      background: cell.status === CellStatus.FREE ? '#f0fdf4' : '#f8fafc'
                    }}
                  >
                    <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#94a3b8' }}>{cell.id}</span>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cell.status === CellStatus.FREE ? 'var(--status-online)' : '#cbd5e1' }} />
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
