import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Dashboard from '@/components/dashboard/dashboard';
import type { User } from '@/lib/users';
import { getTranslator } from '@/lib/i18n';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    // This redirect will be caught by the middleware, but it's good practice
    // to have it here as a fallback.
    redirect('/login');
  }
  
  const t = await getTranslator(session.locale);

  return <Dashboard user={session as User} t={t} />;
}
