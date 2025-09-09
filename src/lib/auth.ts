import { cookies } from 'next/headers';
import type { User } from './users';
import { getLocaleFromPhone } from './i18n';

const SESSION_COOKIE_NAME = 'secure-access-session';

export async function getSession(): Promise<User | null> {
  const sessionValue = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionValue) return null;

  try {
    // The session value is a stringified User object
    const user: User = JSON.parse(sessionValue);
    // Let's ensure a default locale if it's missing for older sessions
    if (!user.locale) {
      user.locale = 'es';
    }
    return user;
  } catch (error) {
    // If parsing fails, the cookie is invalid
    return null;
  }
}

export async function createSession(userId: string, user?: Omit<User, 'password'>) {
  const userData: User = user || {
    id: userId,
    name: userId,
    role: userId.toLowerCase() === 'admin' ? 'admin' : 'user',
    balance: 1000,
    locale: 'es', // Default to Spanish
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
