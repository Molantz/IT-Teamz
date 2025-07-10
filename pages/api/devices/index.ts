import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { zktecoManager } from '../../../lib/zkteco';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM zkteco_devices ORDER BY device_name');
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { device_name, device_ip, device_port, device_type, location } = req.body;
    if (!device_name || !device_ip) {
      return res.status(400).json({ error: 'Device name and IP required' });
    }
    
    try {
      const { rows } = await pool.query(
        'INSERT INTO zkteco_devices (device_name, device_ip, device_port, device_type, location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [device_name, device_ip, device_port || 4370, device_type, location]
      );
      
      // Test connection to device
      const connected = await zktecoManager.connectToDevice({
        id: rows[0].id,
        name: device_name,
        ip: device_ip,
        port: device_port || 4370,
        type: device_type || 'unknown'
      });
      
      return res.status(201).json({ ...rows[0], connected });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to add device' });
    }
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 