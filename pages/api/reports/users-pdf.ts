import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import PDFDocument from 'pdfkit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Assume role check for manager/supervisor is done
  const { rows } = await pool.query('SELECT id, name, email, role, created_at FROM users');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="users.pdf"');
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.fontSize(18).text('User Report', { align: 'center' });
  doc.moveDown();
  rows.forEach(u => {
    doc.fontSize(12).text(`ID: ${u.id} | Name: ${u.name} | Email: ${u.email} | Role: ${u.role} | Created: ${u.created_at.toISOString()}`);
    doc.moveDown(0.5);
  });
  doc.end();
} 