
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/auth';
import { findUserById, addUser } from '@/lib/users';

const loginSchema = z.object({
  userId: z.string().min(1, 'El ID de usuario es requerido').max(24, 'El ID de usuario no puede tener más de 24 caracteres').regex(/^[a-zA-Z0-9]+$/, 'Solo se permiten letras y números.'),
  password: z.string().min(1, 'La contraseña es requerida').max(24, 'La contraseña no puede tener más de 24 caracteres').regex(/^[a-zA-Z0-9]+$/, 'Solo se permiten letras y números.'),
});

const registerSchema = z.object({
    userId: z.string().min(3, 'El ID de usuario debe tener al menos 3 caracteres'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(24, 'La contraseña no puede tener más de 24 caracteres')
        .refine(
            (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value), 
            'La contraseña debe contener al menos una mayúscula y un número.'
        ),
    fullName: z.string()
        .min(1, "El nombre completo es requerido")
        .regex(/^[a-zA-Z\s]+$/, "El nombre completo solo debe contener letras y espacios"),
    birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
});


export async function handleLogin(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
    return { error: `Campos inválidos: ${errorMessages}` };
  }

  const { userId } = validatedFields.data;
  
  const user = await findUserById(userId);

  if (!user) {
    return { error: 'Usuario no encontrado.' };
  }
  
  // In this mock implementation, we bypass password check and just create the session
  await createSession(userId);
  redirect('/');
}

export async function handleRegister(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = registerSchema.safeParse(rawFormData);
  
  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
    return { error: `Campos inválidos: ${errorMessages}` };
  }

  const { userId, fullName, birthDate, password } = validatedFields.data;

  const existingUser = await findUserById(userId);
  if (existingUser) {
    return { error: 'El ID de usuario ya está en uso. Por favor, elige otro.' };
  }
  
  // In this mock implementation, we just create the session directly
  // In a real app, you would save the user to the database here.
  const newUser = {
    id: userId,
    password, // Storing password in mock DB
    name: fullName,
    birthDate,
    role: userId.toLowerCase() === 'admin' ? 'admin' : 'user',
    balance: 1000,
  };

  await addUser(newUser);
  await createSession(userId, newUser);
  redirect('/');
}

export async function handleLogout() {
  await deleteSession();
  redirect('/login');
}
