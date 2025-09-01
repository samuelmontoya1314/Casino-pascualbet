'use server';

import { getSession } from '@/lib/auth';
import { findUserById, updateUserBalance } from '@/lib/users';

export async function updateBalance(amount: number) {
  const session = await getSession();

  if (!session) {
    return { error: 'Not authenticated' };
  }

  const user = await findUserById(session.id);

  if (!user) {
    return { error: 'User not found' };
  }

  const newBalance = user.balance + amount;

  if (newBalance < 0) {
    return { error: 'Insufficient funds' };
  }

  await updateUserBalance(user.id, newBalance);

  return { success: true, newBalance };
}
