import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId || req.query.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { type, message } = req.body;
    if (!type || !message) return res.status(400).json({ error: 'Missing type or message' });
    const { rows } = await pool.query('INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3) RETURNING *', [userId, type, message]);
    return res.status(201).json(rows[0]);
  }
  if (req.method === 'PATCH') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing notification id' });
    await pool.query('UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2', [id, userId]);
    return res.status(200).json({ ok: true });
  }
  res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 