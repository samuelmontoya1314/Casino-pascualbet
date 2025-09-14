import { firestore } from '@/lib/firebase';

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

const usersCollection = firestore.collection('users');

const seedUsers: User[] = [
    {
      id: "admin",
      password: "password",
      name: "Admin User",
      firstName: "Admin",
      firstLastName: "User",
      role: "admin",
      balance: 10000,
    },
    {
      id: "pascual",
      password: "password123",
      name: "Pascual",
      firstName: "Pascual",
      firstLastName: "Bet",
      role: "user",
      balance: 500,
    },
    {
      id: "usuario",
      password: "password",
      name: "Usuario de Prueba",
      firstName: "Usuario",
      firstLastName: "Prueba",
      role: "user",
      balance: 1000,
    },
];

// Function to seed initial users if they don't exist
const seedDatabase = async () => {
    console.log('Checking if seed users exist...');
    const batch = firestore.batch();
    let batchHasWrites = false;

    for (const user of seedUsers) {
        const userRef = usersCollection.doc(user.id);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.log(`User ${user.id} does not exist, adding to batch.`);
            batch.set(userRef, user);
            batchHasWrites = true;
        }
    }

    if (batchHasWrites) {
        console.log('Committing batch to seed users.');
        await batch.commit();
        console.log('Initial users seeded.');
    } else {
        console.log('All seed users already exist.');
    }
};

// We call seedDatabase at the module level.
// This will run once when the server starts.
// Adding a catch to prevent unhandled promise rejections
seedDatabase().catch(error => {
    console.error("Error during database seeding:", error);
});


export async function findUserById(id: string): Promise<User | undefined> {
  // Ensure seed users are checked before trying to find one
  // This helps in serverless environments where startup logic might be inconsistent
  await seedDatabase(); 
  const userDoc = await usersCollection.doc(id).get();
  if (!userDoc.exists) {
    return undefined;
  }
  return userDoc.data() as User;
}

export async function addUser(user: User): Promise<void> {
  const userDocRef = usersCollection.doc(user.id);
  const userDoc = await userDocRef.get();

  if (userDoc.exists) {
    throw new Error('User already exists');
  }
  
  await userDocRef.set(user);
}

export async function updateUserBalance(id: string, newBalance: number): Promise<void> {
  const userDocRef = usersCollection.doc(id);
  const userDoc = await userDocRef.get();
  
  if (userDoc.exists) {
    await userDocRef.update({ balance: newBalance });
  } else {
    console.error(`Attempted to update balance for a non-existent user: ${id}`);
    throw new Error('User not found');
  }
}
