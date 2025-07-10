import { useEffect, useState } from 'react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', department_id: '', position: '', hired_at: '', user_id: '' });
  const [editing, setEditing] = useState<any>(null);
  const [filterDepartment, setFilterDepartment] = useState('');

  async function fetchDepartments() {
    const res = await fetch('/api/departments');
    setDepartments(await res.json());
  }
  async function fetchEmployees() {
    const url = filterDepartment ? `/api/employees?departmentId=${filterDepartment}` : '/api/employees';
    const res = await fetch(url);
    setEmployees(await res.json());
  }

  useEffect(() => { fetchDepartments(); }, []);
  useEffect(() => { fetchEmployees(); }, [filterDepartment]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/employees/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditing(null);
    } else {
      await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: '', email: '', department_id: '', position: '', hired_at: '', user_id: '' });
    fetchEmployees();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/employees/${id}`, { method: 'DELETE' });
    fetchEmployees();
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>Employees</h1>
      <div style={{ marginBottom: 16 }}>
        <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)}>
          <option value=''>All Departments</option>
          {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input required placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <input required placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <select required value={form.department_id} onChange={e => setForm(f => ({ ...f, department_id: e.target.value }))}>
          <option value=''>Select Department</option>
          {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input placeholder="Position" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
        <input placeholder="Hired At" type="date" value={form.hired_at} onChange={e => setForm(f => ({ ...f, hired_at: e.target.value }))} />
        <input placeholder="User ID (optional)" value={form.user_id} onChange={e => setForm(f => ({ ...f, user_id: e.target.value }))} />
        <button type="submit">{editing ? 'Update' : 'Add'} Employee</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', email: '', department_id: '', position: '', hired_at: '', user_id: '' }); }}>Cancel</button>}
      </form>
      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Department</th><th>Position</th><th>Hired At</th><th>User ID</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {employees.map((e: any) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{departments.find((d: any) => d.id === e.department_id)?.name || ''}</td>
              <td>{e.position}</td>
              <td>{e.hired_at}</td>
              <td>{e.user_id}</td>
              <td>
                <button onClick={() => { setEditing(e); setForm({ name: e.name, email: e.email, department_id: e.department_id, position: e.position, hired_at: e.hired_at, user_id: e.user_id || '' }); }}>Edit</button>
                <button onClick={() => handleDelete(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 