import admin from 'firebase-admin';

// Check if the app is already initialized to prevent re-initialization
if (!admin.apps.length) {
  try {
    // When running on App Hosting, the SDK will automatically find the credentials
    admin.initializeApp();
  } catch (e) {
    console.error('Firebase admin initialization error', e);
  }
}

const firestore = admin.firestore();

export { admin, firestore };
