import { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function DashboardPage() {
  const [kpis, setKpis] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setKpis).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
        <div><b>Total Users:</b> {kpis.totalUsers}</div>
        <div><b>Assignments:</b> {kpis.totalAssignments}</div>
        <div><b>Active Users (last 7d):</b> {kpis.activeUsers7d}</div>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ width: 300 }}>
          <h3>Users by Role</h3>
          <Pie data={kpis.usersByRoleChart} />
        </div>
        <div style={{ width: 400 }}>
          <h3>Assignments by Day</h3>
          <Bar data={kpis.assignmentsByDayChart} />
        </div>
        <div style={{ width: 400 }}>
          <h3>Activity (Logins) - Last 14d</h3>
          <Line data={kpis.loginsByDayChart} />
        </div>
      </div>
    </div>
  );
} 