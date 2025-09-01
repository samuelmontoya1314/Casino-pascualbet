// This is a mock in-memory database.
// In a real application, you would use a database like Firestore, PostgreSQL, etc.

export type User = {
  id: string;
  password?: string;
  name: string;
  role: 'admin' | 'user';
  balance: number;
};

// Start with a default admin user for convenience.
const users: Map<string, User> = new Map([
  [
    "admin",
    {
      id: "admin",
      password: "password",
      name: "Admin User",
      role: "admin",
      balance: 10000,
    },
  ],
]);


export async function findUserById(id: string): Promise<User | undefined> {
  // Simulate async database call
  await new Promise(resolve => setTimeout(resolve, 50)); 
  const user = users.get(id);
  // For server-side validation, we return the full user object including password
  if (user) {
    return { ...user };
  }
  return undefined;
}

export async function addUser(user: User): Promise<void> {
  // Simulate async database call
  await new Promise(resolve => setTimeout(resolve, 50));
  if (users.has(user.id)) {
    throw new Error('User already exists');
  }
  users.set(user.id, { ...user });
}

export async function updateUserBalance(id: string, newBalance: number): Promise<void> {
    // Simulate async database call
  await new Promise(resolve => setTimeout(resolve, 50));
  const user = users.get(id);
  if (user) {
    user.balance = newBalance;
    users.set(id, user);
  } else {
    throw new Error('User not found');
  }
}
