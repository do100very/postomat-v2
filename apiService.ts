import { Postomat, Incident } from './types';

const API_BASE = '/api';

export const fetchDevices = async (): Promise<Postomat[]> => {
  const response = await fetch(`${API_BASE}/devices`);
  if (!response.ok) throw new Error('Failed to fetch devices');
  return response.json();
};

export const fetchIncidents = async (): Promise<Incident[]> => {
  const response = await fetch(`${API_BASE}/incidents`);
  if (!response.ok) throw new Error('Failed to fetch incidents');
  return response.json();
};

export const rebootDevice = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/devices/${id}/reboot`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to reboot device');
};

export const setupWebSocket = (onMessage: (data: any) => void) => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${window.location.host}`);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error('WS Error parsing message:', e);
    }
  };

  ws.onclose = () => {
    console.log('WS Connection closed, retrying in 5s...');
    setTimeout(() => setupWebSocket(onMessage), 5000);
  };

  return ws;
};
