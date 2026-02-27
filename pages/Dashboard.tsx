
import React from 'react';
import { PackageIcon, AlertIcon, UserIcon } from '../components/Icons';
import { Postomat, Incident, DeviceStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface DashboardProps {
  devices: Postomat[];
  incidents: Incident[];
}

export const Dashboard: React.FC<DashboardProps> = ({ devices, incidents }) => {
  const stats = [
    { label: 'Всего постоматов', value: devices.length, icon: PackageIcon, color: '#3b82f6' },
    { label: 'В сети', value: devices.filter(d => d.status === DeviceStatus.ONLINE).length, icon: UserIcon, color: '#10b981' },
    { label: 'Оффлайн', value: devices.filter(d => d.status === DeviceStatus.OFFLINE).length, icon: AlertIcon, color: '#ef4444' },
    { label: 'Инциденты', value: incidents.length, icon: AlertIcon, color: '#f59e0b' },
  ];

  const chartData = devices.map(d => ({
    name: d.name,
    capacity: Math.round((d.cells.filter(c => c.status === 'Occupied').length / d.cells.length) * 100)
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-4 lg:p-6 rounded-xl border shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
              <div>
                <p className="text-sm font-medium text-text-muted">{stat.label}</p>
                <p className="text-xl lg:text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-main" style={{ color: stat.color }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 lg:p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold mb-6">Загруженность постоматов (%)</h3>
          <div className="h-60 flex items-flex-end gap-2 lg:gap-4 pb-5 overflow-x-auto">
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 min-w-[40px] flex flex-col items-center gap-2">
                <div className="w-full bg-[#f1f5f9] rounded-sm h-full relative overflow-hidden">
                  <div 
                    className="chart-bar absolute bottom-0 w-full" 
                    style={{ height: `${data.capacity}%` }}
                  />
                </div>
                <span className="text-[10px] text-text-muted truncate w-full text-center">{data.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl border shadow-sm flex flex-col">
          <h3 className="font-semibold mb-6">Статусы сети</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 40 40" className="transform -rotate-90">
                <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="3" />
                <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="var(--primary)" strokeWidth="3" strokeDasharray="65 35" strokeDashoffset="0" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">65%</span>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Online</span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2 mt-6">
               <div className="flex justify-between text-sm">
                  <span className="text-text-muted flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"/> Online</span>
                  <span className="font-bold">65%</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-text-muted flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#e2e8f0]"/> Другое</span>
                  <span className="font-bold">35%</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Активные инциденты</h3>
          <button className="text-xs text-primary font-bold hover:underline">Смотреть все</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[600px]">
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
              {incidents.map((inc) => (
                <tr key={inc.id}>
                  <td className="font-medium text-primary">#{inc.id}</td>
                  <td>{inc.type}</td>
                  <td>{inc.deviceId}</td>
                  <td><StatusBadge status={inc.status} /></td>
                  <td className="text-text-muted text-sm">{new Date(inc.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
