
'use server';

import { getSession, createSession } from '@/lib/auth';
import type { User } from '@/lib/users';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addUser } from '@/lib/users';

const updateUserSchema = z.object({
    name: z.string().min(1, "El nombre completo es requerido"),
    birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
    nationality: z.string().min(1, "La nacionalidad es requerida"),
});

export async function updateUser(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { error: 'Not authenticated', success: false, data: null };
    }

    const validatedFields = updateUserSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
        return { error: `Campos inválidos: ${errorMessages}`, success: false, data: null };
    }

    const { name, birthDate, nationality } = validatedFields.data;

    const updatedUser: User = {
        ...session,
        name,
        birthDate,
        nationality,
    };
    
    // In-memory update
    await addUser(updatedUser);
    await createSession(session.id, updatedUser);
    
    // Revalidate the path to ensure the UI updates with the new session data
    revalidatePath('/');

    return { success: true, error: null, data: updatedUser };
}


// In this mock setup, we don't have a persistent user store,
// so balance updates will be reflected in the session cookie.
export async function updateBalance(amount: number) {
  const session = await getSession();

  if (!session) {
    return { error: 'Not authenticated' };
  }

  const newBalance = session.balance + amount;

  if (newBalance < 0) {
    return { error: 'Insufficient funds' };
  }

  // Update the user object and re-save it in the session
  const updatedUser: User = { ...session, balance: newBalance };
  await createSession(session.id, updatedUser);

  return { success: true, newBalance };
}
