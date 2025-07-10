import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Total users
  const { rows: totalUsersRows } = await pool.query('SELECT COUNT(*) FROM users');
  const totalUsers = Number(totalUsersRows[0].count);

  // Users by role
  const { rows: usersByRoleRows } = await pool.query('SELECT role, COUNT(*) FROM users GROUP BY role');
  const usersByRole = usersByRoleRows.reduce((acc: any, r: any) => { acc[r.role] = Number(r.count); return acc; }, {});
  const usersByRoleChart = {
    labels: Object.keys(usersByRole),
    datasets: [{ data: Object.values(usersByRole), backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#B2FF66', '#FF66B2'] }]
  };

  // Assignments (dummy, replace with real query if assignments table exists)
  const totalAssignments = 42;
  const assignmentsByDayChart = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ label: 'Assignments', data: [5, 7, 6, 8, 9, 4, 3], backgroundColor: '#36A2EB' }]
  };

  // Active users (last 7d, dummy)
  const activeUsers7d = 12;

  // Logins by day (dummy, replace with real query if activity_logs table exists)
  const loginsByDayChart = {
    labels: Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`),
    datasets: [{ label: 'Logins', data: [2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1], borderColor: '#FF6384', backgroundColor: 'rgba(255,99,132,0.2)' }]
  };

  res.status(200).json({
    totalUsers,
    usersByRole,
    usersByRoleChart,
    totalAssignments,
    assignmentsByDayChart,
    activeUsers7d,
    loginsByDayChart,
  });
} 