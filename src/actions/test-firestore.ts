
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
    return { success: true, message: '¡Conexión Exitosa! Se escribió un documento en Firestore.' };
  } catch (error: any) {
    console.error("Firestore connection error:", error);
    
    let errorMessage = 'No se pudo conectar a Firestore. Revisa la consola del servidor para más detalles.';
    if (error.message) {
        errorMessage = `Error de Conexión: ${error.message}`;
    }
    
    return { success: false, message: errorMessage };
  }
}
