import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Configuração do Firebase via Variáveis de Ambiente (Vite)
// As chaves estão no arquivo .env na raiz do projeto
// Casting to any to avoid TypeScript errors with import.meta.env if types are missing
const env = (import.meta as any).env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
// Messaging é suportado apenas em ambientes seguros (HTTPS ou localhost)
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// Inicializa Analytics apenas no ambiente do navegador
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Conectar automaticamente ao emulador se estivermos em ambiente de desenvolvimento local
// Defina VITE_USE_EMULATOR=true no .env para ativar, caso contrário usa o projeto real
if (typeof window !== 'undefined' && location.hostname === "localhost" && env?.VITE_USE_EMULATOR === 'true') {
  console.log('🔥 Conectando ao Firebase Emulator Suite...');
  // Auth Emulator na porta 9099
  // connectAuthEmulator(auth, "http://127.0.0.1:9099");
  
  // Firestore Emulator na porta 8080
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}