import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { companyId } = req.query;
  if (req.method === 'GET') {
    let query = 'SELECT * FROM departments';
    const params: any[] = [];
    if (companyId) {
      query += ' WHERE company_id = $1';
      params.push(companyId);
    }
    query += ' ORDER BY name';
    const { rows } = await pool.query(query, params);
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { name, company_id } = req.body;
    if (!name || !company_id) return res.status(400).json({ error: 'Name and company_id required' });
    const { rows } = await pool.query('INSERT INTO departments (name, company_id) VALUES ($1, $2) RETURNING *', [name, company_id]);
    return res.status(201).json(rows[0]);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 