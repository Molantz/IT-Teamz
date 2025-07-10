import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { verify2FAToken } from '../../../lib/2fa';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, token } = req.body;
  if (!userId || !token) return res.status(400).json({ error: 'Missing userId or token' });
  const { rows } = await pool.query('SELECT secret FROM user_2fa WHERE user_id = $1', [userId]);
  if (rows.length === 0) return res.status(400).json({ error: '2FA not setup' });
  const secret = rows[0].secret;
  const valid = verify2FAToken(secret, token);
  if (!valid) return res.status(401).json({ error: 'Invalid token' });
  await pool.query('UPDATE user_2fa SET enabled = TRUE WHERE user_id = $1', [userId]);
  return res.status(200).json({ ok: true });
} 