import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

const allowedRoles = [
  'superuser', 'anonymous', 'manager', 'supervisor',
  'printer technician', 'internet technician', 'devices technician',
  'intern', 'officer',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // List users
    const { rows } = await pool.query('SELECT id, name, email, role, created_at FROM users');
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const password_hash = await hashPassword(password);
    try {
      const { rows } = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
        [name, email, password_hash, role]
      );
      return res.status(201).json(rows[0]);
    } catch (e: any) {
      if (e.code === '23505') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Server error' });
    }
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 