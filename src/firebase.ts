import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'dummy_key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dummy_project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'dummy_sender',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'dummy_app_id'
};

let app, db: any, auth: any;

try {
  // Diagnostic logs (safe to leave during debugging)
  const missingKeys = [];
  if (firebaseConfig.apiKey === 'dummy_key') missingKeys.push('VITE_FIREBASE_API_KEY');
  if (firebaseConfig.authDomain === 'dummy.firebaseapp.com') missingKeys.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (firebaseConfig.projectId === 'dummy_project') missingKeys.push('VITE_FIREBASE_PROJECT_ID');

  if (missingKeys.length > 0) {
    console.error("Firebase Configuration Error: The following environment variables are missing or using dummy values:", missingKeys);
    console.warn("Ensure your .env.local file contains these keys and that they are prefixed with 'VITE_'.");
  }
  
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { db, auth };
