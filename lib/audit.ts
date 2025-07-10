import pool from './db';

export async function logAudit({ actorId, action, targetType, targetId, details }: {
  actorId: number;
  action: string;
  targetType?: string;
  targetId?: number;
  details?: string;
}) {
  await pool.query(
    'INSERT INTO audit_trail (actor_id, action, target_type, target_id, details) VALUES ($1, $2, $3, $4, $5)',
    [actorId, action, targetType || null, targetId || null, details || null]
  );
} 