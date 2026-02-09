
import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Thermometer, Box } from 'lucide-react';
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по ID или адресу..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-sm">
            <Filter size={18} />
            Фильтры
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
            Добавить устройство
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Устройство</th>
              <th className="px-6 py-4">Статус</th>
              <th className="px-6 py-4">Загрузка</th>
              <th className="px-6 py-4">Тип</th>
              <th className="px-6 py-4">Последний сигнал</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((device) => {
              const occupied = device.cells.filter(c => c.status === 'Occupied').length;
              const percent = Math.round((occupied / device.cells.length) * 100);
              
              return (
                <tr 
                  key={device.id} 
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  onClick={() => onSelect(device.id)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{device.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{device.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={device.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="flex justify-between text-[10px] mb-1 font-medium">
                        <span>{percent}%</span>
                        <span className="text-gray-400">{occupied}/{device.cells.length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${percent > 85 ? 'bg-red-500' : percent > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {/* Wrap Lucide icons in spans with title to fix type errors as title is not a valid prop */}
                      <span title="Regular Cells">
                        <Box size={16} className="text-gray-400" />
                      </span>
                      {device.hasChilledModules && (
                        <span title="Chilled Modules">
                          <Thermometer size={16} className="text-blue-400" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(device.lastHeartbeat).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 rounded hover:bg-gray-100 text-gray-400">
                      <MoreVertical size={18} />
                    </button>
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
