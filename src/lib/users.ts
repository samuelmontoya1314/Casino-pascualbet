import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from './firebase'; // Use client-side db instance

export type User = {
  id: string;
  password?: string; // Password should not be stored in plain text in a real app
  name: string;
  role: 'admin' | 'user';
  balance: number;
};

const usersCollection = collection(db, 'users');

export async function findUserById(id: string): Promise<User | undefined> {
    try {
        const userDocRef = doc(usersCollection, id);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const data = userDoc.data();
            // Return a plain object to ensure it's serializable for client components
            return {
                id: userDoc.id,
                name: data.name,
                role: data.role,
                balance: data.balance,
                password: data.password, // Include password for login check
            } as User;
        }
    } catch (error) {
        console.error("Error finding user by ID:", error);
    }
    return undefined;
}

export async function addUser(user: User): Promise<void> {
    try {
        const userDocRef = doc(usersCollection, user.id);
        await setDoc(userDocRef, user);
    } catch (error) {
        console.error("Error adding user:", error);
    }
}

export async function updateUserBalance(id: string, newBalance: number): Promise<void> {
    try {
        const userDocRef = doc(usersCollection, id);
        await updateDoc(userDocRef, { balance: newBalance });
    } catch(error) {
        console.error("Error updating user balance:", error);
    }
}
