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

// Function to seed initial users if the collection is empty
const seedDatabase = async () => {
    const snapshot = await usersCollection.limit(1).get();
    if (snapshot.empty) {
        console.log('Users collection is empty, seeding initial users...');
        const batch = firestore.batch();
        seedUsers.forEach(user => {
            const docRef = usersCollection.doc(user.id);
            batch.set(docRef, user);
        });
        await batch.commit();
        console.log('Initial users seeded.');
    }
};

// We call seedDatabase at the module level.
// This will run once when the server starts.
seedDatabase().catch(console.error);


export async function findUserById(id: string): Promise<User | undefined> {
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
