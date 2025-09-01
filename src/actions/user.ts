'use server';

import { getSession } from '@/lib/auth';
import { findUserById } from '@/lib/users';

export async function updateBalance(amount: number) {
  const session = await getSession();

  if (!session) {
    return { error: 'Not authenticated' };
  }

  const user = findUserById(session.id);

  if (!user) {
    return { error: 'User not found' };
  }

  const newBalance = user.balance + amount;

  if (newBalance < 0) {
    // This could happen in race conditions, though unlikely in this app.
    // The games should prevent betting more than the balance.
    return { error: 'Insufficient funds' };
  }

  user.balance = newBalance;

  return { success: true, newBalance: user.balance };
}
