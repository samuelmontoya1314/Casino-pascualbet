import { cookies } from 'next/headers';
import { findUserById } from './users';
import type { User } from './users';

const SESSION_COOKIE_NAME = 'secure-access-session';

export async function getSession(): Promise<User | null> {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const user = await findUserById(sessionId);
  if (!user) return null;

  // Create a plain object to ensure it's serializable
  const sessionData: User = {
    id: user.id,
    name: user.name,
    role: user.role,
    balance: user.balance,
  };
  
  // The password is not included here, so it's not sent to the client.

  return sessionData;
}

export async function createSession(userId: string) {
  cookies().set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export async function deleteSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
