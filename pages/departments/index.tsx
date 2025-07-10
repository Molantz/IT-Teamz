import { useEffect, useState } from 'react';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: '', company_id: '' });
  const [editing, setEditing] = useState<any>(null);
  const [filterCompany, setFilterCompany] = useState('');

  async function fetchCompanies() {
    const res = await fetch('/api/companies');
    setCompanies(await res.json());
  }
  async function fetchDepartments() {
    const url = filterCompany ? `/api/departments?companyId=${filterCompany}` : '/api/departments';
    const res = await fetch(url);
    setDepartments(await res.json());
  }

  useEffect(() => { fetchCompanies(); }, []);
  useEffect(() => { fetchDepartments(); }, [filterCompany]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/departments/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditing(null);
    } else {
      await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: '', company_id: '' });
    fetchDepartments();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/departments/${id}`, { method: 'DELETE' });
    fetchDepartments();
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>Departments</h1>
      <div style={{ marginBottom: 16 }}>
        <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
          <option value=''>All Companies</option>
          {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input required placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <select required value={form.company_id} onChange={e => setForm(f => ({ ...f, company_id: e.target.value }))}>
          <option value=''>Select Company</option>
          {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit">{editing ? 'Update' : 'Add'} Department</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', company_id: '' }); }}>Cancel</button>}
      </form>
      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr><th>Name</th><th>Company</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {departments.map((d: any) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{companies.find((c: any) => c.id === d.company_id)?.name || ''}</td>
              <td>
                <button onClick={() => { setEditing(d); setForm({ name: d.name, company_id: d.company_id }); }}>Edit</button>
                <button onClick={() => handleDelete(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 