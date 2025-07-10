import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

const allowedRoles = [
  'superuser', 'anonymous', 'manager', 'supervisor',
  'printer technician', 'internet technician', 'devices technician',
  'intern', 'officer',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(rows[0]);
  }
  if (req.method === 'PUT') {
    const { name, email, password, role } = req.body;
    if (!name || !email || !allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    let password_hash;
    if (password) password_hash = await hashPassword(password);
    try {
      const { rows } = await pool.query(
        `UPDATE users SET name = $1, email = $2, role = $3${password ? ', password_hash = $4' : ''}, updated_at = NOW() WHERE id = $5 RETURNING id, name, email, role, created_at`,
        password ? [name, email, role, password_hash, id] : [name, email, role, id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json(rows[0]);
    } catch (e: any) {
      if (e.code === '23505') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Server error' });
    }
  }
  if (req.method === 'DELETE') {
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'User not found' });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 