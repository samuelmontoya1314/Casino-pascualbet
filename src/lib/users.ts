
// In a real application, this data would come from a database.
// Passwords would be properly hashed using a library like bcrypt.

export type User = {
  id: string;
  password: string; // This is a placeholder for a real, salted hash
  name: string;
  role: 'admin' | 'user';
  balance: number;
};

// Changed to 'let' to allow adding new users during runtime for the demo.
export let users: User[] = [
  {
    id: 'admin',
    password: 'password_admin_hashed',
    name: 'Admin User',
    role: 'admin',
    balance: 10000,
  },
  {
    id: 'user123',
    password: 'password_user_hashed',
    name: 'Regular User',
    role: 'user',
    balance: 1000,
  },
];
