import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const userId = 1; // TODO: Replace with actual user ID from auth/session
  const [notifications, setNotifications] = useState([]);

  async function fetchNotifications() {
    const res = await fetch(`/api/notifications?userId=${userId}`);
    setNotifications(await res.json());
  }

  useEffect(() => { fetchNotifications(); }, []);

  async function markAsRead(id: number) {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, userId }),
    });
    fetchNotifications();
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((n: any) => (
          <li key={n.id} style={{ marginBottom: 12, background: n.read ? '#eee' : '#ffd', padding: 8 }}>
            <b>{n.type}</b>: {n.message}
            {!n.read && (
              <button style={{ marginLeft: 12 }} onClick={() => markAsRead(n.id)}>Mark as read</button>
            )}
            <span style={{ float: 'right', fontSize: 12 }}>{new Date(n.created_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 