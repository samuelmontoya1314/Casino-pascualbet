import { initializeApp, getApps, getApp } from 'firebase/app';
// Note: Firestore is not used directly from the client anymore in this file.
// Server-side operations are handled by firebase-admin in 'src/lib/users.ts'.

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "casino-skwof",
  appId: "1:28193877161:web:73ab8c68a4ba052a610db8",
  storageBucket: "casino-skwof.firebasestorage.app",
  apiKey: "AIzaSyDVtFeC746tTF6VK6qZexcoXGlbOZ6l76c",
  authDomain: "casino-skwof.firebaseapp.com",
  messagingSenderId: "28193877161",
};

// Initialize Firebase for client-side usage
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// We don't export 'db' from here anymore as client-side direct DB access is removed.
// All database operations are now routed through server actions.
export { app };
