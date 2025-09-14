
import { getSession } from '@/lib/auth';
import Dashboard from '@/components/dashboard/dashboard';
import type { User } from '@/lib/users';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }
  
  return <Dashboard user={session as User} />;
}
