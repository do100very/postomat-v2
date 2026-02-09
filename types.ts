
export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  FAULT = 'fault'
}

export enum CellStatus {
  FREE = 'Free',
  OCCUPIED = 'Occupied',
  FAULT = 'Fault',
  DISABLED = 'Disabled'
}

export enum CellType {
  REGULAR = 'Regular',
  CHILLED = 'Chilled'
}

export enum IncidentStatus {
  NEW = 'New',
  IN_PROGRESS = 'InProgress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed'
}

export enum IncidentPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum UserRole {
  ADMIN = 'Admin',
  OPERATOR = 'Operator',
  SUPPORT = 'Support',
  SERVICE = 'Service'
}

export interface Cell {
  id: string;
  type: CellType;
  status: CellStatus;
  doorSensor: boolean;
}

export interface Telemetry {
  timestamp: string;
  temperature?: number;
  batteryLevel?: number;
  signalStrength?: number; // RSSI
}

export interface PostomatEvent {
  id: string;
  timestamp: string;
  type: 'openCommand' | 'openResult' | 'pickupAttempt' | 'placement' | 'doorState' | 'reboot' | 'statusChange';
  description: string;
  details?: any;
}

export interface Postomat {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  status: DeviceStatus;
  lastHeartbeat: string;
  hasChilledModules: boolean;
  cells: Cell[];
  config: {
    pickupRetryLimit: number;
    openTTL: number;
    maintenanceMode: boolean;
    softwareVersion: string;
  };
}

export interface Incident {
  id: string;
  type: string;
  priority: IncidentPriority;
  deviceId: string;
  cellId?: string;
  status: IncidentStatus;
  description: string;
  createdAt: string;
  assignedTo?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  target: string;
  details: string;
}
