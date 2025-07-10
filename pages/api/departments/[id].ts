import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM departments WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }
  if (req.method === 'PUT') {
    const { name, company_id } = req.body;
    if (!name || !company_id) return res.status(400).json({ error: 'Name and company_id required' });
    const { rows } = await pool.query('UPDATE departments SET name = $1, company_id = $2 WHERE id = $3 RETURNING *', [name, company_id, id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }
  if (req.method === 'DELETE') {
    await pool.query('DELETE FROM departments WHERE id = $1', [id]);
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 