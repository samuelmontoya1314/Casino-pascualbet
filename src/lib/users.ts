// In-memory user store for demonstration
// In a real application, this would be a database.
import { db } from './firebase-admin';

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


const usersCollection = db.collection('users');

const seedUsers: User[] = [
    {
      id: "admin",
      password: "password",
      name: "Admin User",
      firstName: "Admin",
      firstLastName: "User",
      role: "admin",
      balance: 10000
    },
    {
      id: "pascual",
      password: "password123",
      name: "Pascual",
      firstName: "Pascual",
      firstLastName: "Bet",
      role: "user",
      balance: 500
    },
    {
      id: "usuario",
      password: "password",
      name: "Usuario de Prueba",
      firstName: "Usuario",
      firstLastName: "Prueba",
      role: "user",
      balance: 1000
    }
];

// Function to seed the database with initial users if they don't exist
async function seedDatabase() {
  try {
    const batch = db.batch();
    let batchHasWrites = false;

    for (const user of seedUsers) {
        const userRef = usersCollection.doc(user.id);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            batch.set(userRef, user);
            batchHasWrites = true;
        }
    }

    if (batchHasWrites) {
        await batch.commit();
        console.log('Database seeded successfully.');
    }
  } catch(error) {
      console.error("Error seeding database: ", error);
      // We don't re-throw the error to avoid crashing the server on startup
      // The find/add functions will just fail later if the connection is truly down
  }
}

// We call this to ensure the database is seeded when the server starts up.
// Note: In a stateless serverless environment, this might run more often than expected.
// The logic inside seedDatabase is idempotent, so it's safe.
const seedingPromise = seedDatabase();


export async function findUserById(id: string): Promise<User | undefined> {
  await seedingPromise; // Ensure seeding is attempted before any read
  const userDoc = await usersCollection.doc(id).get();
  if (!userDoc.exists) {
    return undefined;
  }
  return userDoc.data() as User;
}

export async function addUser(user: User): Promise<void> {
  await seedingPromise; // Ensure seeding is attempted before any write
  const userRef = usersCollection.doc(user.id);
  const userDoc = await userRef.get();
  if (userDoc.exists) {
      throw new Error('User already exists');
  }
  await userRef.set(user);
}

export async function updateUserBalance(id: string, newBalance: number): Promise<void> {
  const userRef = usersCollection.doc(id);
  await userRef.update({ balance: newBalance });
}
