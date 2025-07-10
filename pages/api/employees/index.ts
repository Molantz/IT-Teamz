import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { departmentId } = req.query;
  if (req.method === 'GET') {
    let query = 'SELECT * FROM employees';
    const params: any[] = [];
    if (departmentId) {
      query += ' WHERE department_id = $1';
      params.push(departmentId);
    }
    query += ' ORDER BY name';
    const { rows } = await pool.query(query, params);
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { name, email, department_id, position, hired_at, user_id } = req.body;
    if (!name || !email || !department_id) return res.status(400).json({ error: 'Name, email, and department_id required' });
    const { rows } = await pool.query('INSERT INTO employees (name, email, department_id, position, hired_at, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [name, email, department_id, position, hired_at, user_id]);
    return res.status(201).json(rows[0]);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 