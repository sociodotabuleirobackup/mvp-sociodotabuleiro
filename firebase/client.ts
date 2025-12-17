import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getMessaging, Messaging } from "firebase/messaging";

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "mock_key",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "mock_domain",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "mock_project",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Exportamos como uma Promise para lidar com a inicialização assíncrona
export const messagingPromise: Promise<Messaging | null> = typeof window !== 'undefined' ? (async () => {
    try {
        return getMessaging(app); 
    } catch (e) {
        console.warn("Messaging not supported"); 
        return null;
    }
})() : Promise.resolve(null);

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

if (typeof window !== 'undefined' && location.hostname === "localhost" && env.VITE_USE_EMULATOR === 'true') {
  console.log('🔥 Conectando ao Firebase Emulator Suite...');
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}