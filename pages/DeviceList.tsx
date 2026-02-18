
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
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div style={{ position: 'relative', width: '384px' }}>
          <SearchIcon size={18} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Поиск по ID или адресу..."
            style={{ width: '100%', padding: '10px 12px 10px 40px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-primary">Добавить устройство</button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm" style={{ overflow: 'hidden' }}>
        <table>
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
                  className="cursor-pointer"
                  onClick={() => onSelect(device.id)}
                >
                  <td>
                    <div>
                      <p className="font-semibold">{device.name}</p>
                      <p className="text-xs text-muted" style={{ fontFamily: 'monospace' }}>{device.id}</p>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={device.status} />
                  </td>
                  <td>
                    <div style={{ width: '128px' }}>
                      <div className="flex justify-between text-xs" style={{ marginBottom: '4px' }}>
                        <span>{percent}%</span>
                        <span className="text-muted">{occupied}/{device.cells.length}</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            background: percent > 80 ? 'var(--status-offline)' : 'var(--status-online)', 
                            width: `${percent}%` 
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">{device.config.softwareVersion}</td>
                  <td className="text-sm text-muted">
                    {new Date(device.lastHeartbeat).toLocaleTimeString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
