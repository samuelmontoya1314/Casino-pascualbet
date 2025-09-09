
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/auth';
import { findUserById } from '@/lib/users';

const loginSchema = z.object({
  userId: z.string().min(1, 'El ID de usuario es requerido'),
  password: z.string(), // No validation needed for mock
});

const registerSchema = z.object({
    userId: z.string().min(3, 'El ID de usuario debe tener al menos 3 caracteres'),
    password: z.string()
        .min(12, 'La contraseña debe tener al menos 12 caracteres')
        .max(24, 'La contraseña no puede tener más de 24 caracteres')
        .refine(
            (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/.test(value), 
            'La contraseña debe contener al menos una mayúscula, un número y un carácter especial.'
        ),
    firstName: z.string().min(1, "El primer nombre es requerido"),
    secondName: z.string().optional(),
    firstLastName: z.string().min(1, "El primer apellido es requerido"),
    secondLastName: z.string().min(1, "El segundo apellido es requerido"),
    birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
    nationality: z.string().min(1, "La nacionalidad es requerida"),
    documentNumber: z.string().min(1, "El número de documento es requerido"),
    documentIssuePlace: z.string().min(1, "El lugar de expedición es requerido"),
});


export async function handleLogin(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Campos inválidos.' };
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
  const validatedFields = registerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
    return { error: `Campos inválidos: ${errorMessages}` };
  }

  const { userId, firstName, firstLastName, documentNumber, nationality, birthDate, documentIssuePlace, secondName, secondLastName } = validatedFields.data;
  
  // In this mock implementation, we just create the session directly
  // In a real app, you would save the user to the database here.
  const newUser = {
    id: userId,
    name: `${firstName} ${firstLastName}`,
    firstName,
    secondName,
    firstLastName,
    secondLastName,
    birthDate,
    nationality,
    documentNumber,
    documentIssuePlace,
    role: userId.toLowerCase() === 'admin' ? 'admin' : 'user',
    balance: 1000,
  };

  await createSession(userId, newUser);
  redirect('/');
}

export async function handleLogout() {
  await deleteSession();
  redirect('/login');
}
