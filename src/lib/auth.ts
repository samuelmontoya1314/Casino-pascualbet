import { cookies } from 'next/headers';
import { findUserById } from './users';

const SESSION_COOKIE_NAME = 'secure-access-session';

export async function getSession() {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const user = findUserById(sessionId);
  if (!user) return null;

  const { password, ...sessionData } = user;
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
