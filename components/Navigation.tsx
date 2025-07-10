import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/users', label: 'Users', icon: '👥' },
    { href: '/companies', label: 'Companies', icon: '🏢' },
    { href: '/departments', label: 'Departments', icon: '🏛️' },
    { href: '/employees', label: 'Employees', icon: '👤' },
    { href: '/id-cards', label: 'ID Cards', icon: '🪪' },
    { href: '/devices', label: 'Devices', icon: '📱' },
    { href: '/attendance', label: 'Attendance', icon: '⏰' },
    { href: '/audit', label: 'Audit Log', icon: '📋' },
    { href: '/notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <nav style={{ 
      background: '#1a1a1a', 
      color: 'white', 
      padding: '1rem', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000 
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          IT-Teamz Management
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {navItems.map(item => (
            <Link 
              key={item.href} 
              href={item.href}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                textDecoration: 'none',
                color: router.pathname === item.href ? '#fff' : '#ccc',
                background: router.pathname === item.href ? '#333' : 'transparent',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 