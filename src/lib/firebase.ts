import admin from 'firebase-admin';

// Check if the app is already initialized to prevent re-initialization
if (!admin.apps.length) {
  admin.initializeApp({
    // The SDK will automatically detect the project ID and credentials
    // from the environment when deployed to Firebase App Hosting.
  });
}

const firestore = admin.firestore();

export { admin, firestore };
