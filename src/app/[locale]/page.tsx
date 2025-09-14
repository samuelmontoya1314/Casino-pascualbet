
import { getSession } from '@/lib/auth';
import Dashboard from '@/components/dashboard/dashboard';
import type { User } from '@/lib/users';
import { redirect } from 'next/navigation';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const session = await getSession();

  if (!session) {
    // This redirect is a fallback, middleware should handle it.
    redirect(`/${params.locale}/login`);
  }
  
  return <Dashboard user={session as User} />;
}
