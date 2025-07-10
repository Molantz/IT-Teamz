import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM companies ORDER BY name');
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const { rows } = await pool.query('INSERT INTO companies (name) VALUES ($1) RETURNING *', [name]);
    return res.status(201).json(rows[0]);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 