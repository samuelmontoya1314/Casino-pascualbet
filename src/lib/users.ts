
import admin from 'firebase-admin';

export type User = {
  id: string;
  password?: string; // Password should not be stored in plain text in a real app
  name: string;
  role: 'admin' | 'user';
  balance: number;
};

// Initialize Firebase Admin SDK.
// When deployed to a Google Cloud environment like App Hosting,
// the SDK automatically detects the service account credentials.
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
            // Return a plain object to ensure it's serializable for client components
            const userData = userDoc.data();
            return {
                id: userDoc.id,
                name: userData.name,
                role: userData.role,
                balance: userData.balance,
            } as User;
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
        await userDocRef.update({ balance: newBalance });
    } catch(error) {
        console.error("Error updating user balance:", error);
    }
}
