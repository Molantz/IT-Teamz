import { ReactNode } from 'react';

// Replace with your actual user context or session logic
function useUser() {
  // Example: return { role: 'manager' };
  if (typeof window !== 'undefined') {
    const user = window.localStorage.getItem('user');
    return user ? JSON.parse(user) : { role: 'anonymous' };
  }
  return { role: 'anonymous' };
}

export default function RoleBased({ roles, children }: { roles: string[]; children: ReactNode }) {
  const user = useUser();
  if (!roles.includes(user.role)) return null;
  return <>{children}</>;
} 