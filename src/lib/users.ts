// In-memory user store for demonstration
// In a real application, this would be a database.

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

// Using a Map for an in-memory store
const users = new Map<string, User>([
  [
    "admin",
    {
      id: "admin",
      password: "password",
      name: "Admin User",
      firstName: "Admin",
      firstLastName: "User",
      role: "admin",
      balance: 10000
    }
  ],
  [
    "pascual",
    {
      id: "pascual",
      password: "password123",
      name: "Pascual",
      firstName: "Pascual",
      firstLastName: "Bet",
      role: "user",
      balance: 500
    }
  ],
  [
    "usuario",
    {
      id: "usuario",
      password: "password",
      name: "Usuario de Prueba",
      firstName: "Usuario",
      firstLastName: "Prueba",
      role: "user",
      balance: 1000
    }
  ],
]);


export async function findUserById(id: string): Promise<User | undefined> {
  return users.get(id);
}

export async function addUser(user: User): Promise<void> {
  if (users.has(user.id)) {
    throw new Error('User already exists');
  }
  users.set(user.id, user);
}

export async function updateUserBalance(id: string, newBalance: number): Promise<void> {
  const user = users.get(id);
  if (user) {
    user.balance = newBalance;
    users.set(id, user);
  }
}
