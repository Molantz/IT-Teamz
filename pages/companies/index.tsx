import { useEffect, useState } from 'react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [editing, setEditing] = useState<any>(null);

  async function fetchCompanies() {
    const res = await fetch('/api/companies');
    setCompanies(await res.json());
  }

  useEffect(() => { fetchCompanies(); }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/companies/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditing(null);
    } else {
      await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: '' });
    fetchCompanies();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/companies/${id}`, { method: 'DELETE' });
    fetchCompanies();
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Companies</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input required placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <button type="submit">{editing ? 'Update' : 'Add'} Company</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '' }); }}>Cancel</button>}
      </form>
      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr><th>Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {companies.map((c: any) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>
                <button onClick={() => { setEditing(c); setForm({ name: c.name }); }}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 