
import React, { useState } from 'react';
import { SearchIcon } from '../components/Icons';
import { MOCK_DEVICES } from '../mockData';
import { StatusBadge } from '../components/StatusBadge';

interface DeviceListProps {
  onSelect: (id: string) => void;
}

export const DeviceList: React.FC<DeviceListProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_DEVICES.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border shadow-sm gap-4">
        <div className="relative w-full sm:max-w-md">
          <SearchIcon size={18} className="text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Поиск по ID или адресу..."
            className="w-full pl-10 pr-4 py-2 bg-bg-main border border-border rounded-lg outline-none focus:border-primary transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-primary whitespace-nowrap">Добавить устройство</button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[800px]">
            <thead>
              <tr>
                <th>Устройство</th>
                <th>Статус</th>
                <th>Загрузка</th>
                <th>Версия ПО</th>
                <th>Последний сигнал</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((device) => {
                const occupied = device.cells.filter(c => c.status === 'Occupied').length;
                const percent = Math.round((occupied / device.cells.length) * 100);
                
                return (
                  <tr 
                    key={device.id} 
                    className="cursor-pointer group"
                    onClick={() => onSelect(device.id)}
                  >
                    <td>
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">{device.name}</p>
                        <p className="text-[10px] text-text-muted font-mono">{device.id}</p>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={device.status} />
                    </td>
                    <td>
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="font-bold">{percent}%</span>
                          <span className="text-text-muted">{occupied}/{device.cells.length}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-500"
                            style={{ 
                              background: percent > 80 ? 'var(--status-offline)' : 'var(--status-online)', 
                              width: `${percent}%` 
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{device.config.softwareVersion}</td>
                    <td className="text-sm text-text-muted">
                      {new Date(device.lastHeartbeat).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};
