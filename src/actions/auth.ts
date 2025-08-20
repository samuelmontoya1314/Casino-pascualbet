'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { users } from '@/lib/users';
import { createSession, deleteSession } from '@/lib/auth';

const loginSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    userId: z.string().min(3, 'User ID must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
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

export async function handleRegister(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Invalid fields provided. Please check the requirements.' };
  }

  const { userId, password, name } = validatedFields.data;
  
  const existingUser = users.find(u => u.id === userId);
  if (existingUser) {
    return { error: 'User ID already exists. Please choose another.' };
  }

  const newUser = {
    id: userId,
    // In a real app, hash this password!
    password: `${password}_hashed`,
    name: name,
    role: 'user' as const,
    balance: 1000, // Starting balance for new users
  };

  users.push(newUser);

  await createSession(newUser.id);
  redirect('/');
}

export async function handleLogout() {
  await deleteSession();
  redirect('/login');
}
