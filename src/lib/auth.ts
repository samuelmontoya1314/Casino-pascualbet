import { cookies } from 'next/headers';
import type { User } from './users';
import { findUserById } from './users';

const SESSION_COOKIE_NAME = 'secure-access-session';

export async function getSession(): Promise<User | null> {
  const sessionValue = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionValue) return null;

  try {
    // The session value is a stringified User object
    const user: User = JSON.parse(sessionValue);
    return user;
  } catch (error) {
    // If parsing fails, the cookie is invalid
    return null;
  }
}

export async function createSession(userId: string, newUser?: Omit<User, 'password'>) {
  // For registration, a newUser object is passed.
  // For login, only userId is passed, and we need to fetch the user.
  const userToSession = newUser ?? await findUserById(userId);

  if (!userToSession) {
    // This case should ideally not be reached if handleLogin/handleRegister checks for user existence first.
    // However, as a safeguard, we prevent creating an empty session.
    throw new Error('Cannot create session for a non-existent user.');
  }

  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(userToSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export async function deleteSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
