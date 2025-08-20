'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { users } from '@/lib/users';
import { createSession, deleteSession } from '@/lib/auth';

const loginSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function handleLogin(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Invalid fields provided.' };
  }

  const { userId, password } = validatedFields.data;
  const user = users.find(u => u.id === userId);

  // In a real application, you would use bcrypt.compare() to verify the password.
  // We are comparing the placeholder "hashed" password directly for this demo.
  if (user && user.password === password) {
    await createSession(user.id);
    redirect('/');
  } else {
    return { error: 'Invalid user ID or password.' };
  }
}

export async function handleLogout() {
  await deleteSession();
  redirect('/login');
}
