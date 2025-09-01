import { Firestore } from '@google-cloud/firestore';

// In a hosted environment like Firebase App Hosting, the SDK will automatically
// find the service account credentials via Application Default Credentials.
const db = new Firestore();

export type User = {
  id: string;
  password?: string;
  name: string;
  role: 'admin' | 'user';
  balance: number;
};

const usersCollection = db.collection('users');

export async function findUserById(id: string): Promise<User | undefined> {
    try {
        const userDocRef = usersCollection.doc(id);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            const data = userDoc.data();
            // Return a plain object to ensure it's serializable for client components
            return {
                id: userDoc.id,
                name: data.name,
                role: data.role,
                balance: data.balance,
                password: data.password,
            } as User;
        }
    } catch (error) {
        console.error("Error finding user by ID:", error);
        // Propagate the error to be handled by the caller
        throw new Error(`Failed to find user: ${error.message}`);
    }
    return undefined;
}

export async function addUser(user: User): Promise<void> {
    try {
        const userDocRef = usersCollection.doc(user.id);
        await userDocRef.set(user);
    } catch (error) {
        console.error("Error adding user:", error);
        throw new Error(`Failed to add user: ${error.message}`);
    }
}

export async function updateUserBalance(id: string, newBalance: number): Promise<void> {
    try {
        const userDocRef = usersCollection.doc(id);
        await userDocRef.update({ balance: newBalance });
    } catch(error) {
        console.error("Error updating user balance:", error);
        throw new Error(`Failed to update balance: ${error.message}`);
    }
}
