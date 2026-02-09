
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { MOCK_DEVICES, MOCK_INCIDENTS } from '../mockData';
import { DeviceStatus } from '../types';

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

export const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Всего постоматов', value: MOCK_DEVICES.length, icon: Package, color: 'text-blue-600' },
    { label: 'В сети', value: MOCK_DEVICES.filter(d => d.status === DeviceStatus.ONLINE).length, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Оффлайн', value: MOCK_DEVICES.filter(d => d.status === DeviceStatus.OFFLINE).length, icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Инциденты', value: MOCK_INCIDENTS.length, icon: Activity, color: 'text-amber-600' },
  ];

  const chartData = MOCK_DEVICES.map(d => ({
    name: d.name,
    capacity: Math.round((d.cells.filter(c => c.status === 'Occupied').length / d.cells.length) * 100)
  }));

  const statusData = [
    { name: 'Online', value: MOCK_DEVICES.filter(d => d.status === DeviceStatus.ONLINE).length },
    { name: 'Offline', value: MOCK_DEVICES.filter(d => d.status === DeviceStatus.OFFLINE).length },
    { name: 'Service', value: MOCK_DEVICES.filter(d => d.status === DeviceStatus.MAINTENANCE).length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-6">Загруженность постоматов (%)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="capacity" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-6">Статусы сети</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.map((s, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-gray-600">{s.name}</span>
                </div>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold">Активные инциденты</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Тип</th>
              <th className="px-6 py-3">Устройство</th>
              <th className="px-6 py-3">Статус</th>
              <th className="px-6 py-3">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_INCIDENTS.map((inc) => (
              <tr key={inc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-blue-600">#{inc.id}</td>
                <td className="px-6 py-4">{inc.type}</td>
                <td className="px-6 py-4">{inc.deviceId}</td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-xs ${
                     inc.status === 'New' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                   }`}>{inc.status}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{new Date(inc.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
