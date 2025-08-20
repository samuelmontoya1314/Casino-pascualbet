
// In a real application, this data would come from a database.
// Passwords would be properly hashed using a library like bcrypt.

export type User = {
  id: string;
  password: string; // This is a placeholder for a real, salted hash
  name: string;
  role: 'admin' | 'user';
};

export const users: User[] = [
  {
    id: 'admin',
    password: 'password_admin_hashed',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 'user123',
    password: 'password_user_hashed',
    name: 'Regular User',
    role: 'user',
  },
];
