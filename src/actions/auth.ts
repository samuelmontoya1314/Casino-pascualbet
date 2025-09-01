'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { findUserById, addUser } from '@/lib/users';
import { createSession, deleteSession } from '@/lib/auth';
import type { User } from '@/lib/users';

const loginSchema = z.object({
  userId: z.string().min(1, 'El ID de usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const registerSchema = z.object({
    name: z.string().min(2, 'El nombre es requerido'),
    userId: z.string().min(3, 'El ID de usuario debe tener al menos 3 caracteres'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});


export async function handleLogin(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Campos inválidos.' };
  }

  const { userId, password } = validatedFields.data;
  const user = await findUserById(userId);

  if (user && user.password === password) {
    await createSession(user.id);
    redirect('/');
  } else {
    return { error: 'ID de usuario o contraseña inválidos.' };
  }
}

export async function handleRegister(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
    return { error: `Campos inválidos: ${errorMessages}` };
  }

  const { userId, password, name } = validatedFields.data;
  
  const existingUser = await findUserById(userId);
  if (existingUser) {
    return { error: 'El ID de usuario ya existe. Por favor, elige otro.' };
  }

  const newUser: User = {
    id: userId,
    password: password, // In a real app, hash this password
    name: name,
    role: userId.toLowerCase() === 'admin' ? 'admin' : 'user',
    balance: 1000,
  };

  await addUser(newUser);

  await createSession(newUser.id);
  redirect('/');
}

export async function handleLogout() {
  await deleteSession();
  redirect('/login');
}
