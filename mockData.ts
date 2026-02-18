
import { DeviceStatus, CellStatus, CellType, IncidentStatus, IncidentPriority, UserRole, Postomat, Incident, AuditLog } from './types';

const generateCells = (count: number, chilled: boolean): any[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `C${i + 1}`,
    type: chilled && i < count / 3 ? CellType.CHILLED : CellType.REGULAR,
    status: Math.random() > 0.8 ? CellStatus.OCCUPIED : CellStatus.FREE,
    doorSensor: true,
  }));
};

export const MOCK_DEVICES: Postomat[] = [
  {
    id: 'P-1001',
    name: 'Проспект ленина 1',
    address: '123 Main St, Moscow',
    coordinates: [55.7558, 37.6173],
    status: DeviceStatus.ONLINE,
    lastHeartbeat: new Date().toISOString(),
    hasChilledModules: true,
    cells: generateCells(24, true),
    config: {
      pickupRetryLimit: 3,
      openTTL: 60,
      maintenanceMode: false,
      softwareVersion: 'v2.4.1'
    }
  },
  {
    id: 'P-1002',
    name: 'ТЦ АШАН',
    address: '45 Retail Ave, St. Petersburg',
    coordinates: [59.9343, 30.3351],
    status: DeviceStatus.OFFLINE,
    lastHeartbeat: new Date(Date.now() - 3600000).toISOString(),
    hasChilledModules: false,
    cells: generateCells(16, false),
    config: {
      pickupRetryLimit: 3,
      openTTL: 60,
      maintenanceMode: false,
      softwareVersion: 'v2.4.0'
    }
  },
  {
    id: 'P-1003',
    name: 'Аэропорт Шереметьево Т1',
    address: 'Arrivals Hall, Sheremetyevo',
    coordinates: [55.9726, 37.4146],
    status: DeviceStatus.MAINTENANCE,
    lastHeartbeat: new Date().toISOString(),
    hasChilledModules: true,
    cells: generateCells(32, true),
    config: {
      pickupRetryLimit: 5,
      openTTL: 120,
      maintenanceMode: true,
      softwareVersion: 'v2.5.0-beta'
    }
  }
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-7721',
    type: 'Ошибка датчика двери',
    priority: IncidentPriority.HIGH,
    deviceId: 'P-1001',
    cellId: 'C5',
    status: IncidentStatus.NEW,
    description: 'Cell C5 reports door open but latch confirmed closed.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'INC-7722',
    type: 'Превышен лимит времени открытого замка',
    priority: IncidentPriority.CRITICAL,
    deviceId: 'P-1002',
    status: IncidentStatus.IN_PROGRESS,
    description: 'Device offline for more than 60 minutes.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    assignedTo: 'John Doe',
  }
];

export const MOCK_AUDIT: AuditLog[] = [
  {
    id: 'A-1',
    timestamp: new Date().toISOString(),
    userId: 'admin@system.com',
    action: 'CHANGE_CONFIG',
    target: 'P-1003',
    details: 'Enabled maintenance mode'
  }
];
