import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Assume role check for manager/supervisor is done
  const { rows } = await pool.query('SELECT id, name, email, role, created_at FROM users');
  const header = 'id,name,email,role,created_at\n';
  const csv = rows.map(u => `${u.id},${u.name},${u.email},${u.role},${u.created_at.toISOString()}`).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
  res.status(200).send(header + csv);
} 