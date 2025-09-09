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

export async function createSession(userId: string, user?: Omit<User, 'password'>) {
  const existingUser = await findUserById(userId);
  
  // Use the provided user object (from registration), fall back to existing user (from login),
  // or finally create a default object if neither exists (though this case is less likely now).
  const userData: User = user || existingUser || {
    id: userId,
    name: userId,
    firstName: userId,
    role: userId.toLowerCase() === 'admin' ? 'admin' : 'user',
    balance: 1000,
  };

  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export async function deleteSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
