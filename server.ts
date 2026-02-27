import express from 'express';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('postomat.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    name TEXT,
    address TEXT,
    lat REAL,
    lng REAL,
    status TEXT,
    lastHeartbeat TEXT,
    hasChilledModules INTEGER,
    softwareVersion TEXT,
    pickupRetryLimit INTEGER,
    openTTL INTEGER,
    maintenanceMode INTEGER
  );

  CREATE TABLE IF NOT EXISTS cells (
    id TEXT,
    deviceId TEXT,
    type TEXT,
    status TEXT,
    doorSensor INTEGER,
    PRIMARY KEY (id, deviceId),
    FOREIGN KEY (deviceId) REFERENCES devices(id)
  );

  CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    type TEXT,
    priority TEXT,
    deviceId TEXT,
    cellId TEXT,
    status TEXT,
    description TEXT,
    createdAt TEXT,
    assignedTo TEXT
  );
`);

// Seed data if empty
const deviceCount = db.prepare('SELECT COUNT(*) as count FROM devices').get() as { count: number };
if (deviceCount.count === 0) {
  const insertDevice = db.prepare(`
    INSERT INTO devices (id, name, address, lat, lng, status, lastHeartbeat, hasChilledModules, softwareVersion, pickupRetryLimit, openTTL, maintenanceMode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertCell = db.prepare(`
    INSERT INTO cells (id, deviceId, type, status, doorSensor)
    VALUES (?, ?, ?, ?, ?)
  `);

  const devices = [
    { id: 'P-1001', name: 'Проспект ленина 1', address: '123 Main St, Moscow', lat: 55.7558, lng: 37.6173, status: 'online', chilled: 1 },
    { id: 'P-1002', name: 'ТЦ АШАН', address: '45 Retail Ave, St. Petersburg', lat: 59.9343, lng: 30.3351, status: 'offline', chilled: 0 },
    { id: 'P-1003', name: 'Аэропорт Шереметьево Т1', address: 'Arrivals Hall, Sheremetyevo', lat: 55.9726, lng: 37.4146, status: 'maintenance', chilled: 1 },
  ];

  for (const d of devices) {
    insertDevice.run(d.id, d.name, d.address, d.lat, d.lng, d.status, new Date().toISOString(), d.chilled, 'v2.4.1', 3, 60, d.status === 'maintenance' ? 1 : 0);
    
    const cellCount = d.id === 'P-1003' ? 32 : (d.id === 'P-1001' ? 24 : 16);
    for (let i = 1; i <= cellCount; i++) {
      insertCell.run(
        `C${i}`, 
        d.id, 
        (d.chilled && i < cellCount / 3) ? 'Chilled' : 'Regular', 
        Math.random() > 0.8 ? 'Occupied' : 'Free', 
        1
      );
    }
  }

  db.prepare(`
    INSERT INTO incidents (id, type, priority, deviceId, cellId, status, description, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('INC-7721', 'Ошибка датчика двери', 'High', 'P-1001', 'C5', 'New', 'Cell C5 reports door open but latch confirmed closed.', new Date().toISOString());
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/devices', (req, res) => {
    const devices = db.prepare('SELECT * FROM devices').all();
    const devicesWithCells = devices.map((d: any) => {
      const cells = db.prepare('SELECT * FROM cells WHERE deviceId = ?').all(d.id);
      return {
        ...d,
        coordinates: [d.lat, d.lng],
        hasChilledModules: !!d.hasChilledModules,
        config: {
          softwareVersion: d.softwareVersion,
          pickupRetryLimit: d.pickupRetryLimit,
          openTTL: d.openTTL,
          maintenanceMode: !!d.maintenanceMode
        },
        cells: cells.map((c: any) => ({
          ...c,
          doorSensor: !!c.doorSensor
        }))
      };
    });
    res.json(devicesWithCells);
  });

  app.get('/api/incidents', (req, res) => {
    const incidents = db.prepare('SELECT * FROM incidents').all();
    res.json(incidents);
  });

  app.post('/api/devices/:id/reboot', (req, res) => {
    const { id } = req.params;
    db.prepare('UPDATE devices SET status = "offline", lastHeartbeat = ? WHERE id = ?').run(new Date().toISOString(), id);
    broadcast({ type: 'DEVICE_UPDATED', deviceId: id, status: 'offline' });
    
    // Simulate rebooting
    setTimeout(() => {
      db.prepare('UPDATE devices SET status = "online", lastHeartbeat = ? WHERE id = ?').run(new Date().toISOString(), id);
      broadcast({ type: 'DEVICE_UPDATED', deviceId: id, status: 'online' });
    }, 5000);

    res.json({ success: true, message: 'Reboot command sent' });
  });

  // WebSocket handling
  const clients = new Set<WebSocket>();
  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
  });

  function broadcast(data: any) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Device Emulation Logic
  setInterval(() => {
    // Randomly change a cell status in a random device
    const devices = db.prepare('SELECT id FROM devices WHERE status = "online"').all() as { id: string }[];
    if (devices.length > 0) {
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      const cells = db.prepare('SELECT id, status FROM cells WHERE deviceId = ?').all(randomDevice.id) as { id: string, status: string }[];
      const randomCell = cells[Math.floor(Math.random() * cells.length)];
      
      const newStatus = randomCell.status === 'Free' ? 'Occupied' : 'Free';
      db.prepare('UPDATE cells SET status = ? WHERE id = ? AND deviceId = ?').run(newStatus, randomCell.id, randomDevice.id);
      
      broadcast({
        type: 'CELL_UPDATED',
        deviceId: randomDevice.id,
        cellId: randomCell.id,
        status: newStatus
      });
    }

    // Update heartbeats
    db.prepare('UPDATE devices SET lastHeartbeat = ? WHERE status = "online"').run(new Date().toISOString());
  }, 10000);


  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
