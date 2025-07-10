import { useEffect, useState } from 'react';

const roles = [
  'superuser', 'anonymous', 'manager', 'supervisor',
  'printer technician', 'internet technician', 'devices technician',
  'intern', 'officer',
];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: roles[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchUsers() {
    const res = await fetch('/api/users');
    setUsers(await res.json());
  }

  useEffect(() => { fetchUsers(); }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) setError((await res.json()).error || 'Error');
    setForm({ name: '', email: '', password: '', role: roles[0] });
    setLoading(false);
    fetchUsers();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>User Management</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input required placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <input required placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <input required placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>
        <button type="submit" disabled={loading}>Add User</button>
        {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
      </form>
      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{new Date(u.created_at).toLocaleString()}</td>
              <td>
                {/* For brevity, only delete is implemented. Edit can be added similarly. */}
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 