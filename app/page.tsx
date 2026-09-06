import { redirect } from 'next/navigation';

export default function HomePage() {
  // Langsung redirect ke halaman dashboard karena tidak ada landing page
  redirect('/dashboard');
}
