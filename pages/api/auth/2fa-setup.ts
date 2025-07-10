import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import { generate2FASecret, get2FAQrCodeUrl } from '../../../lib/2fa';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Assume user is authenticated and userId is available (e.g., from session/JWT)
  const userId = req.body.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  const secretObj = generate2FASecret(String(userId));
  await pool.query('INSERT INTO user_2fa (user_id, secret, enabled) VALUES ($1, $2, FALSE) ON CONFLICT (user_id) DO UPDATE SET secret = $2, enabled = FALSE', [userId, secretObj.base32]);
  const qr = await get2FAQrCodeUrl(secretObj.otpauth_url);
  return res.status(200).json({ secret: secretObj.base32, qr });
} 