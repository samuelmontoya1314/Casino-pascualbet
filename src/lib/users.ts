import admin from 'firebase-admin';

export type User = {
  id: string;
  password?: string; // Password should not be stored in plain text in a real app
  name: string;
  role: 'admin' | 'user';
  balance: number;
};

// Initialize Firebase Admin
// When no config is provided, the SDK will automatically look for credentials
// from the environment, which is the standard and secure way in Google Cloud environments.
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const usersCollection = db.collection('users');

export async function findUserById(id: string): Promise<User | undefined> {
    try {
        const userDocRef = usersCollection.doc(id);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            return { id: userDoc.id, ...userDoc.data() } as User;
        }
    } catch (error) {
        console.error("Error finding user by ID:", error);
    }
    return undefined;
}

export async function addUser(user: User): Promise<void> {
    try {
        const userDocRef = usersCollection.doc(user.id);
        await userDocRef.set(user);
    } catch (error) {
        console.error("Error adding user:", error);
    }
}

export async function updateUserBalance(id: string, newBalance: number): Promise<void> {
    try {
        const userDocRef = usersCollection.doc(id);
        await userDocRef.set({ balance: newBalance }, { merge: true });
    } catch(error) {
        console.error("Error updating user balance:", error);
    }
}
