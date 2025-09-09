'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/auth';

const loginSchema = z.object({
  userId: z.string().min(1, 'El ID de usuario es requerido'),
  password: z.string(), // No validation needed for mock
});

const registerSchema = z.object({
    name: z.string().min(2, 'El nombre es requerido'),
    userId: z.string().min(3, 'El ID de usuario debe tener al menos 3 caracteres'),
    phone: z.string().min(10, 'El número de teléfono debe tener al menos 10 caracteres'),
    password: z.string(), // No validation needed for mock
});


export async function handleLogin(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Campos inválidos.' };
  }

  const { userId } = validatedFields.data;
  
  // In this mock implementation, we bypass password check and just create the session
  await createSession(userId);
  redirect('/');
}

export async function handleRegister(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
    return { error: `Campos inválidos: ${errorMessages}` };
  }

  const { userId, name, phone } = validatedFields.data;
  
  // In this mock implementation, we just create the session directly
  // In a real app, you would save the user to the database here.
  const newUser = {
    id: userId,
    name: name,
    phone: phone,
    role: userId.toLowerCase() === 'admin' ? 'admin' : 'user',
    balance: 1000,
  };

  await createSession(newUser.id, newUser);
  redirect('/');
}

export async function handleLogout() {
  await deleteSession();
  redirect('/login');
}
