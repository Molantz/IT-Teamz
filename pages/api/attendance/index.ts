import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { zktecoManager } from '../../../lib/zkteco';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { employeeId, deviceId, fromDate, toDate, logType } = req.query;
  
  if (req.method === 'GET') {
    let query = `
      SELECT al.*, e.name as employee_name, e.department_id, d.name as department, zd.device_name
      FROM attendance_logs al
      JOIN employees e ON al.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      JOIN zkteco_devices zd ON al.device_id = zd.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (employeeId) {
      query += ' AND al.employee_id = $' + (params.length + 1);
      params.push(employeeId);
    }
    if (deviceId) {
      query += ' AND al.device_id = $' + (params.length + 1);
      params.push(deviceId);
    }
    if (logType) {
      query += ' AND al.log_type = $' + (params.length + 1);
      params.push(logType);
    }
    if (fromDate) {
      query += ' AND al.timestamp >= $' + (params.length + 1);
      params.push(fromDate);
    }
    if (toDate) {
      query += ' AND al.timestamp <= $' + (params.length + 1);
      params.push(toDate + ' 23:59:59');
    }
    
    query += ' ORDER BY al.timestamp DESC LIMIT 1000';
    const { rows } = await pool.query(query, params);
    return res.status(200).json(rows);
  }
  
  if (req.method === 'POST') {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID required' });
    }
    
    try {
      // Get attendance data from device
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7); // Last 7 days
      const attendanceData = await zktecoManager.getAttendanceData(deviceId, fromDate, new Date());
      
      // Save attendance records
      for (const record of attendanceData) {
        await pool.query(
          'INSERT INTO attendance_logs (employee_id, device_id, log_type, timestamp, raw_data) VALUES ($1, $2, $3, $4, $5)',
          [record.employeeId, record.deviceId, record.logType, record.timestamp, record.rawData]
        );
      }
      
      return res.status(200).json({ 
        message: `Synced ${attendanceData.length} attendance records from device ${deviceId}` 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to sync attendance data' });
    }
  }
  
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 