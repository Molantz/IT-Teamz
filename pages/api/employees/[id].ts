import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }
  if (req.method === 'PUT') {
    const { name, email, department_id, position, hired_at, user_id } = req.body;
    if (!name || !email || !department_id) return res.status(400).json({ error: 'Name, email, and department_id required' });
    const { rows } = await pool.query('UPDATE employees SET name = $1, email = $2, department_id = $3, position = $4, hired_at = $5, user_id = $6 WHERE id = $7 RETURNING *', [name, email, department_id, position, hired_at, user_id, id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }
  if (req.method === 'DELETE') {
    await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 