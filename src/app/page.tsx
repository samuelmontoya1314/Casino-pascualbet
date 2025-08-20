import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Dashboard from '@/components/dashboard/dashboard';
import type { User } from '@/lib/users';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    // This redirect will be caught by the middleware, but it's good practice
    // to have it here as a fallback.
    redirect('/login');
  }

  return <Dashboard user={session as User} />;
}
