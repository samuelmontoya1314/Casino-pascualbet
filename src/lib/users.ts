// This is a mock in-memory database.
// In a real application, you would use a database like Firestore, PostgreSQL, etc.

export type User = {
  id: string;
  password?: string; // Password is now optional as we are not validating it
  name: string;
  firstName?: string;
  secondName?: string;
  firstLastName?: string;
  secondLastName?: string;
  birthDate?: string;
  nationality?: string;
  documentNumber?: string;
  documentIssuePlace?: string;
  role: 'admin' | 'user';
  balance: number;
};

// This map acts as a simple, volatile in-memory store.
// It will be reset on every server restart.
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
  // This function is only used on the server, so returning the full user object is safe.
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
    // In our new mock system, we might create a temporary user if they don't exist
    // to prevent crashes, but for now, we'll just log an error.
    console.error(`Attempted to update balance for a non-existent mock user: ${id}`);
  }
}
