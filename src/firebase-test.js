// Firebase Configuration Test
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Test Firebase configuration
const testFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Firebase Config:", testFirebaseConfig);

// Test Firebase initialization
try {
  const app = initializeApp(testFirebaseConfig);
  console.log("Firebase app initialized successfully");
  
  const auth = getAuth(app);
  console.log("Firebase auth initialized successfully");
  
  const db = getFirestore(app);
  console.log("Firebase Firestore initialized successfully");
  
  // Test Firestore write
  const testDoc = doc(db, "test", "config-test");
  await setDoc(testDoc, {
    test: true,
    timestamp: serverTimestamp()
  });
  console.log("Firebase Firestore write test successful");
  
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { testFirebaseConfig };
