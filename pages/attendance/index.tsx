import { useEffect, useState } from 'react';

export default function AttendanceDashboard() {
  const [logs, setLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);
  const [filters, setFilters] = useState({ employeeId: '', deviceId: '', fromDate: '', toDate: '', logType: '' });

  async function fetchEmployees() {
    const res = await fetch('/api/employees');
    setEmployees(await res.json());
  }
  async function fetchDevices() {
    const res = await fetch('/api/devices');
    setDevices(await res.json());
  }
  async function fetchLogs() {
    const params = new URLSearchParams();
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.deviceId) params.append('deviceId', filters.deviceId);
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    if (filters.logType) params.append('logType', filters.logType);
    const res = await fetch(`/api/attendance?${params.toString()}`);
    setLogs(await res.json());
  }

  useEffect(() => { fetchEmployees(); fetchDevices(); }, []);
  useEffect(() => { fetchLogs(); }, [filters]);

  function handleChange(e: any) {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleExport() {
    const csv = [
      ['Employee', 'Department', 'Device', 'Type', 'Time'].join(','),
      ...logs.map((l: any) => [l.employee_name, l.department, l.device_name, l.log_type, l.timestamp].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance-export.csv';
    a.click();
  }

  // Summary stats
  const present = logs.filter((l: any) => l.log_type === 'check_in').length;
  const absent = employees.length - present;
  const late = logs.filter((l: any) => l.log_type === 'check_in' && new Date(l.timestamp).getHours() > 9).length;

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h1>Attendance Dashboard</h1>
      <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <h3>Filters</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <select name="employeeId" value={filters.employeeId} onChange={handleChange}>
            <option value=''>All Employees</option>
            {employees.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <select name="deviceId" value={filters.deviceId} onChange={handleChange}>
            <option value=''>All Devices</option>
            {devices.map((d: any) => <option key={d.id} value={d.id}>{d.device_name}</option>)}
          </select>
          <select name="logType" value={filters.logType} onChange={handleChange}>
            <option value=''>All Types</option>
            <option value='check_in'>Check In</option>
            <option value='check_out'>Check Out</option>
            <option value='access_denied'>Access Denied</option>
          </select>
          <input name="fromDate" type="date" value={filters.fromDate} onChange={handleChange} />
          <input name="toDate" type="date" value={filters.toDate} onChange={handleChange} />
          <button type="button" onClick={handleExport}>Export CSV</button>
        </div>
      </div>
      <div style={{ marginBottom: 24, display: 'flex', gap: 32 }}>
        <div><b>Present:</b> {present}</div>
        <div><b>Absent:</b> {absent}</div>
        <div><b>Late:</b> {late}</div>
      </div>
      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Device</th>
            <th>Type</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l: any) => (
            <tr key={l.id}>
              <td>{l.employee_name}</td>
              <td>{l.department}</td>
              <td>{l.device_name}</td>
              <td>{l.log_type}</td>
              <td>{new Date(l.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        Showing {logs.length} attendance records
      </div>
    </div>
  );
} 