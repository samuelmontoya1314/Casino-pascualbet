import { cookies } from 'next/headers';
import { users } from './users';

// In a real app, you would use a library like 'jose' or 'iron-session' to encrypt the session cookie.
// For this demo, we'll store the user ID directly in the cookie for simplicity.
const SESSION_COOKIE_NAME = 'secure-access-session';

export async function getSession() {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const user = users.find(u => u.id === sessionId);
  if (!user) return null;

  // Return a session object without the password hash
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
