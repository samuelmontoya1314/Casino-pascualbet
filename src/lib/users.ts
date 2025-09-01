import { db } from './firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

export type User = {
  id: string;
  password?: string; // Password should not be stored in plain text in a real app
  name: string;
  role: 'admin' | 'user';
  balance: number;
};

const usersCollection = collection(db, 'users');

export async function findUserById(id: string): Promise<User | undefined> {
    const userDocRef = doc(usersCollection, id);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return undefined;
}

export async function addUser(user: User): Promise<void> {
    const userDocRef = doc(usersCollection, user.id);
    await setDoc(userDocRef, user);
}

export async function updateUserBalance(id: string, newBalance: number): Promise<void> {
    const userDocRef = doc(usersCollection, id);
    await setDoc(userDocRef, { balance: newBalance }, { merge: true });
}
