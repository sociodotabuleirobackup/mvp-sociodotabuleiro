import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Fallback seguro para evitar crash se import.meta.env não existir (comum em setups sem Vite puro)
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

// Messaging e Analytics seguros para browser
export const messaging = typeof window !== 'undefined' ? (async () => {
    try {
        return getMessaging(app); 
    } catch (e) {
        console.warn("Messaging not supported"); 
        return null;
    }
})() : null;

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Conectar ao emulador apenas se configurado explicitamente
if (typeof window !== 'undefined' && location.hostname === "localhost" && env.VITE_USE_EMULATOR === 'true') {
  console.log('🔥 Conectando ao Firebase Emulator Suite...');
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}