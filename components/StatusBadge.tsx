
import React from 'react';
import { DeviceStatus, CellStatus, IncidentStatus, IncidentPriority } from '../types';

interface StatusBadgeProps {
  status: DeviceStatus | CellStatus | IncidentStatus | IncidentPriority;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case DeviceStatus.ONLINE:
      case CellStatus.FREE:
      case IncidentStatus.RESOLVED:
      case IncidentStatus.CLOSED:
        return 'bg-green-100 text-green-700 border-green-200';
      case DeviceStatus.OFFLINE:
      case CellStatus.FAULT:
      case IncidentPriority.CRITICAL:
      case IncidentPriority.HIGH:
        return 'bg-red-100 text-red-700 border-red-200';
      case DeviceStatus.MAINTENANCE:
      case CellStatus.DISABLED:
      case IncidentPriority.MEDIUM:
      case IncidentStatus.IN_PROGRESS:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case IncidentStatus.NEW:
      case DeviceStatus.FAULT:
      case IncidentPriority.LOW:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case CellStatus.OCCUPIED:
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}>
      {status}
    </span>
  );
};
