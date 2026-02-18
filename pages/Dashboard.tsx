
import React from 'react';
import { PackageIcon, AlertIcon, UserIcon } from '../components/Icons';
import { MOCK_DEVICES, MOCK_INCIDENTS } from '../mockData';
import { DeviceStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Всего постоматов', value: MOCK_DEVICES.length, icon: PackageIcon, color: '#3b82f6' },
    { label: 'В сети', value: MOCK_DEVICES.filter(d => d.status === DeviceStatus.ONLINE).length, icon: UserIcon, color: '#10b981' },
    { label: 'Оффлайн', value: MOCK_DEVICES.filter(d => d.status === DeviceStatus.OFFLINE).length, icon: AlertIcon, color: '#ef4444' },
    { label: 'Инциденты', value: MOCK_INCIDENTS.length, icon: AlertIcon, color: '#f59e0b' },
  ];

  const chartData = MOCK_DEVICES.map(d => ({
    name: d.name,
    capacity: Math.round((d.cells.filter(c => c.status === 'Occupied').length / d.cells.length) * 100)
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', color: stat.color }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold" style={{ marginBottom: '24px' }}>Загруженность постоматов (%)</h3>
          <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '20px' }}>
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div style={{ width: '100%', backgroundColor: '#f1f5f9', borderRadius: '4px', height: '180px', position: 'relative', overflow: 'hidden' }}>
                  <div 
                    className="chart-bar" 
                    style={{ position: 'absolute', bottom: 0, width: '100%', height: `${data.capacity}%` }}
                  />
                </div>
                <span className="text-xs text-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60px' }}>{data.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold" style={{ marginBottom: '24px' }}>Статусы сети</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="160" height="160" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="3" />
              <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="var(--primary)" strokeWidth="3" strokeDasharray="65 35" strokeDashoffset="25" />
            </svg>
          </div>
          <div className="flex flex-col gap-2" style={{ marginTop: '1rem' }}>
             <div className="flex justify-between text-sm">
                <span className="text-muted flex items-center gap-2"><div style={{width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)'}}/> Online</span>
                <span className="font-bold">65%</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-muted flex items-center gap-2"><div style={{width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0'}}/> Другое</span>
                <span className="font-bold">35%</span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm" style={{ overflow: 'hidden' }}>
        <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-semibold">Активные инциденты</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Тип</th>
              <th>Устройство</th>
              <th>Статус</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INCIDENTS.map((inc) => (
              <tr key={inc.id}>
                <td className="font-medium" style={{ color: 'var(--primary)' }}>#{inc.id}</td>
                <td>{inc.type}</td>
                <td>{inc.deviceId}</td>
                <td><StatusBadge status={inc.status} /></td>
                <td className="text-muted text-sm">{new Date(inc.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
