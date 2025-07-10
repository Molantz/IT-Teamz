import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
  const { rows } = await pool.query('SELECT * FROM password_resets WHERE token = $1 AND used = FALSE AND expires_at > NOW()', [token]);
  if (rows.length === 0) return res.status(400).json({ error: 'Invalid or expired token' });
  const reset = rows[0];
  const password_hash = await hashPassword(password);
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, reset.user_id]);
  await pool.query('UPDATE password_resets SET used = TRUE WHERE id = $1', [reset.id]);
  return res.status(200).json({ ok: true });
} 