
'use server';

import { getSession } from '@/lib/auth';
import { getAllUsers } from '@/lib/users';
import type { User } from '@/lib/users';

export async function fetchAllUsers(): Promise<{ success: boolean; users?: User[]; error?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: 'Not authenticated' };
  }

  if (session.role !== 'admin') {
    return { success: false, error: 'Not authorized' };
  }

  try {
    const users = await getAllUsers();
    // Remove password from user objects before sending to client
    const safeUsers = users.map(({ password, ...user }) => user);
    return { success: true, users: safeUsers as User[] };
  } catch (e) {
    return { success: false, error: 'Failed to fetch users.' };
  }
}
