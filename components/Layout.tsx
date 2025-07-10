import Navigation from './Navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navigation />
      <main style={{ padding: '2rem 0' }}>
        {children}
      </main>
      <footer style={{ 
        background: '#1a1a1a', 
        color: 'white', 
        textAlign: 'center', 
        padding: '1rem',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          © 2024 IT-Teamz Management System
        </div>
      </footer>
    </div>
  );
} 