
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/auth';
import { findUserById, addUser } from '@/lib/users';

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
    fullName: z.string()
        .min(1, "El nombre completo es requerido")
        .regex(/^[a-zA-Z\s]+$/, "El nombre completo solo debe contener letras y espacios"),
    birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
    nationality: z.string().min(1, "La nacionalidad es requerida"),
    documentNumber: z.string()
        .min(1, "El número de documento es requerido")
        .regex(/^[0-9]+$/, "El documento de identidad solo debe contener números"),
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
  const rawFormData = Object.fromEntries(formData.entries());
  // Sanitize documentNumber: remove dots and commas
  if (typeof rawFormData.documentNumber === 'string') {
      rawFormData.documentNumber = rawFormData.documentNumber.replace(/[.,]/g, '');
  }

  const validatedFields = registerSchema.safeParse(rawFormData);
  
  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
    return { error: `Campos inválidos: ${errorMessages}` };
  }

  const { userId, fullName, documentNumber, nationality, birthDate, password } = validatedFields.data;

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
    nationality,
    documentNumber,
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
