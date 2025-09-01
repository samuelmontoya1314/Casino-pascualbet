import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "casino-skwof",
  appId: "1:28193877161:web:73ab8c68a4ba052a610db8",
  storageBucket: "casino-skwof.firebasestorage.app",
  apiKey: "AIzaSyDVtFeC746tTF6VK6qZexcoXGlbOZ6l76c",
  authDomain: "casino-skwof.firebaseapp.com",
  messagingSenderId: "28193877161",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
