import { useEffect, useState } from 'react';

const actionOptions = [
  '', 'create_user', 'update_role', 'delete_user', 'assign_device', 'assign_project', 'login', 'reset_password', '2fa_setup', '2fa_verify'
];
const targetTypeOptions = ['', 'user', 'device', 'project', 'module'];

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ actorId: '', targetType: '', action: '', details: '', from: '', to: '' });

  async function fetchLogs() {
    const params = new URLSearchParams();
    if (filters.actorId) params.append('actorId', filters.actorId);
    if (filters.targetType) params.append('targetType', filters.targetType);
    if (filters.action) params.append('action', filters.action);
    if (filters.details) params.append('details', filters.details);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    const res = await fetch(`/api/audit?${params.toString()}`);
    setLogs(await res.json());
  }

  useEffect(() => { fetchLogs(); }, []);

  function handleChange(e: any) {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleFilter(e: any) {
    e.preventDefault();
    fetchLogs();
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>Audit Log</h1>
      <form onSubmit={handleFilter} style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input name="actorId" placeholder="Actor ID" value={filters.actorId} onChange={handleChange} />
        <select name="targetType" value={filters.targetType} onChange={handleChange}>
          {targetTypeOptions.map(opt => <option key={opt} value={opt}>{opt || 'All Types'}</option>)}
        </select>
        <select name="action" value={filters.action} onChange={handleChange}>
          {actionOptions.map(opt => <option key={opt} value={opt}>{opt || 'All Actions'}</option>)}
        </select>
        <input name="details" placeholder="Details contains..." value={filters.details} onChange={handleChange} />
        <input name="from" type="date" value={filters.from} onChange={handleChange} />
        <input name="to" type="date" value={filters.to} onChange={handleChange} />
        <button type="submit">Filter</button>
      </form>
      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Time</th><th>Actor</th><th>Action</th><th>Target Type</th><th>Target ID</th><th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log: any) => (
            <tr key={log.id}>
              <td>{new Date(log.created_at).toLocaleString()}</td>
              <td>{log.actor_id}</td>
              <td>{log.action}</td>
              <td>{log.target_type}</td>
              <td>{log.target_id}</td>
              <td>{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 