import { redirect } from 'next/navigation';

export default function HomePage() {
  // Mock authentication role for folder structure testing
  // 'ADMIN', 'TEAM', 'CLIENT', or null (unauthenticated)
  const role = 'ADMIN'; 

  if (role === 'ADMIN' || role === 'TEAM') {
    redirect('/overview');
  } else if (role === 'CLIENT') {
    redirect('/portal/dashboard');
  } else {
    redirect('/login');
  }
}
