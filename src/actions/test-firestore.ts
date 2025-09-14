'use server';

import { firestore } from '@/lib/firebase';

/**
 * Attempts to write a document to Firestore to verify the connection.
 * @returns A promise that resolves to an object indicating success or failure.
 */
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string; }> {
  try {
    const testDocRef = firestore.collection('test-connection').doc('first-test');
    await testDocRef.set({
      status: 'success',
      timestamp: new Date().toISOString(),
    });
    return { success: true, message: 'Successfully wrote to Firestore.' };
  } catch (error: any) {
    console.error("Firestore connection error:", error);
    
    let errorMessage = 'An unknown error occurred while connecting to Firestore.';
    if (error.code) {
        switch (error.code) {
            case 'PERMISSION_DENIED': // Firestore SDK v9+ uses string codes
            case 7: // Older SDKs used number codes
                errorMessage = 'Permission denied. Please check your Firestore security rules.';
                break;
            case 'UNAVAILABLE':
            case 14:
                errorMessage = 'The service is currently unavailable. This is a temporary condition and should be retried.';
                break;
            default:
                errorMessage = `A Firestore error occurred: ${error.message} (Code: ${error.code})`;
        }
    } else if (error.message) {
        errorMessage = error.message;
    }
    
    return { success: false, message: errorMessage };
  }
}
