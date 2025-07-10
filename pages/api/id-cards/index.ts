import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { employeeId } = req.query;
  if (req.method === 'GET') {
    let query = `SELECT c.*, e.name as employee_name, e.position, e.hired_at, e.image_url, e.signature_url, d.name as department, co.name as company, co.id as company_id, co.address as company_address
      FROM employee_id_cards c
      JOIN employees e ON c.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      JOIN companies co ON d.company_id = co.id`;
    const params: any[] = [];
    if (employeeId) {
      query += ' WHERE c.employee_id = $1';
      params.push(employeeId);
    }
    query += ' ORDER BY c.created_at DESC';
    const { rows } = await pool.query(query, params);
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { employee_id, card_number, issue_date, status } = req.body;
    if (!employee_id || !card_number || !issue_date) return res.status(400).json({ error: 'employee_id, card_number, and issue_date required' });
    const { rows } = await pool.query('INSERT INTO employee_id_cards (employee_id, card_number, issue_date, status) VALUES ($1, $2, $3, $4) RETURNING *', [employee_id, card_number, issue_date, status || 'active']);
    return res.status(201).json(rows[0]);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 