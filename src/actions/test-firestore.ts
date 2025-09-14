
'use server';

import { firestore } from '@/lib/firebase';

/**
 * An isolated server action to test the Firestore connection.
 * It attempts to write a simple document to a 'test-connection' collection.
 * This is not used by the UI and is for verification purposes only.
 */
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const docRef = firestore.collection('test-connection').doc('first-test');
    await docRef.set({
      status: 'success',
      timestamp: new Date(),
    });
    console.log('Firestore connection test successful. Document written.');
    return { success: true, message: 'Document successfully written to Firestore.' };
  } catch (error) {
    console.error('Error testing Firestore connection:', error);
    if (error instanceof Error) {
      return { success: false, message: `Firestore connection failed: ${error.message}` };
    }
    return { success: false, message: 'Firestore connection failed with an unknown error.' };
  }
}
