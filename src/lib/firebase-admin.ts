import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// This is the service account ID, NOT a private key.
// It's safe to have this in the code as it only identifies the account.
// Permissions are managed in Google Cloud IAM.
const serviceAccount = process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_ID;

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      // If serviceAccount is provided, the SDK will use it to authenticate.
      // In App Hosting, this should correspond to the default service account.
      // If GOOGLE_APPLICATION_CREDENTIALS is set, it will use that.
      // Otherwise, it will try to use the application default credentials.
      credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
      // The databaseURL is not required for Firestore, but it's good practice.
      // We can get this from environment variables if needed.
      // databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`
    });
  }
} catch (error: any) {
  console.error('Firebase admin initialization error', error.stack);
}

export const db = getFirestore();
export const auth = admin.auth();
