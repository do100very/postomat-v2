
import React from 'react';
import { DeviceStatus, CellStatus, IncidentStatus, IncidentPriority } from '../types';

interface StatusBadgeProps {
  status: DeviceStatus | CellStatus | IncidentStatus | IncidentPriority;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getClassName = () => {
    const s = status.toLowerCase();
    if (['online', 'free', 'resolved', 'closed'].includes(s)) return 'badge-online';
    if (['offline', 'fault', 'critical', 'high'].includes(s)) return 'badge-offline';
    if (['maintenance', 'disabled', 'medium', 'inprogress'].includes(s)) return 'badge-maintenance';
    return '';
  };

  return (
    <span className={`badge ${getClassName()}`}>
      {status}
    </span>
  );
};
