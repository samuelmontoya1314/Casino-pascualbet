'use server';

import { getSession, createSession } from '@/lib/auth';
import type { User } from '@/lib/users';

// In this mock setup, we don't have a persistent user store,
// so balance updates will be reflected in the session cookie.

export async function updateBalance(amount: number) {
  const session = await getSession();

  if (!session) {
    return { error: 'Not authenticated' };
  }

  const newBalance = session.balance + amount;

  if (newBalance < 0) {
    return { error: 'Insufficient funds' };
  }

  // Update the user object and re-save it in the session
  const updatedUser: User = { ...session, balance: newBalance };
  await createSession(session.id, updatedUser);

  return { success: true, newBalance };
}
