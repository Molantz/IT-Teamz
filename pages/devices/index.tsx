import { useEffect, useState } from 'react';

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ device_name: '', device_ip: '', device_port: 4370, device_type: '', location: '' });
  const [loading, setLoading] = useState(false);

  async function fetchDevices() {
    const res = await fetch('/api/devices');
    setDevices(await res.json());
  }

  async function fetchEmployees() {
    const res = await fetch('/api/employees');
    setEmployees(await res.json());
  }

  useEffect(() => { fetchDevices(); fetchEmployees(); }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ device_name: '', device_ip: '', device_port: 4370, device_type: '', location: '' });
      fetchDevices();
    } catch (error) {
      console.error('Failed to add device:', error);
    }
    setLoading(false);
  }

  async function handleSyncEmployees(deviceId: number) {
    setLoading(true);
    try {
      const res = await fetch('/api/devices/sync-employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, employees }),
      });
      const result = await res.json();
      alert(result.message || 'Employees synced successfully');
    } catch (error) {
      alert('Failed to sync employees');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto' }}>
      <h1>ZKTeco Device Management</h1>
      
      {/* Add Device Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <h3>Add New Device</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            required 
            placeholder="Device Name" 
            value={form.device_name} 
            onChange={e => setForm(f => ({ ...f, device_name: e.target.value }))} 
          />
          <input 
            required 
            placeholder="Device IP" 
            value={form.device_ip} 
            onChange={e => setForm(f => ({ ...f, device_ip: e.target.value }))} 
          />
          <input 
            type="number" 
            placeholder="Port" 
            value={form.device_port} 
            onChange={e => setForm(f => ({ ...f, device_port: parseInt(e.target.value) }))} 
          />
          <input 
            placeholder="Device Type" 
            value={form.device_type} 
            onChange={e => setForm(f => ({ ...f, device_type: e.target.value }))} 
          />
          <input 
            placeholder="Location" 
            value={form.location} 
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))} 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Device'}
          </button>
        </div>
      </form>

      {/* Devices Table */}
      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Device Name</th>
            <th>IP Address</th>
            <th>Port</th>
            <th>Type</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d: any) => (
            <tr key={d.id}>
              <td>{d.device_name}</td>
              <td>{d.device_ip}</td>
              <td>{d.device_port}</td>
              <td>{d.device_type}</td>
              <td>{d.location}</td>
              <td>
                <span style={{ 
                  color: d.status === 'active' ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {d.status}
                </span>
              </td>
              <td>
                <button 
                  onClick={() => handleSyncEmployees(d.id)}
                  disabled={loading}
                  style={{ marginRight: 8 }}
                >
                  Sync Employees
                </button>
                <button onClick={() => window.open(`/attendance?deviceId=${d.id}`, '_blank')}>
                  View Attendance
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 