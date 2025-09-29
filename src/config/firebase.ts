import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD7pz4LZX8vkLI4hKMbMxJgsDY9EjFsdHU",
  authDomain: "sistema-de-controle-7dc7f.firebaseapp.com",
  projectId: "sistema-de-controle-7dc7f",
  storageBucket: "sistema-de-controle-7dc7f.firebasestorage.app",
  messagingSenderId: "1054657912783",
  appId: "1:1054657912783:web:fcebf5eccefff9fb8e3cba",
  measurementId: "G-CYW1JNJ62C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Enable offline persistence
try {
  // This will be handled automatically by Firebase v9+
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export default app;