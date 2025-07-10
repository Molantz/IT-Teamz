import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Assume admin check is done
  const { actorId, targetType, action, details, from, to } = req.query;
  let query = 'SELECT * FROM audit_trail WHERE 1=1';
  const params: any[] = [];
  if (actorId) { query += ' AND actor_id = $' + (params.length + 1); params.push(actorId); }
  if (targetType) { query += ' AND target_type = $' + (params.length + 1); params.push(targetType); }
  if (action) { query += ' AND action = $' + (params.length + 1); params.push(action); }
  if (details) { query += ' AND details ILIKE $' + (params.length + 1); params.push(`%${details}%`); }
  if (from) { query += ' AND created_at >= $' + (params.length + 1); params.push(from); }
  if (to) { query += ' AND created_at <= $' + (params.length + 1); params.push(to + ' 23:59:59'); }
  query += ' ORDER BY created_at DESC LIMIT 100';
  const { rows } = await pool.query(query, params);
  res.status(200).json(rows);
} 