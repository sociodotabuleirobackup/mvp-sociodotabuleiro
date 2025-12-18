import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Carrega variáveis de ambiente
dotenv.config();

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error("❌ VITE_FIREBASE_PROJECT_ID não definido no .env");
}

let app: App;

// Evita inicializar múltiplas vezes se o script for importado em vários lugares
if (getApps().length > 0) {
  app = getApps()[0];
} else {
  let credential;

  // 1. Tenta carregar o JSON via String no .env (Bom para CI/CD e Railway/Vercel)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      credential = cert(serviceAccount);
      console.log("🔒 Firebase Admin: Autenticado via JSON String (.env).");
    } catch (e) {
      console.error("❌ Erro ao fazer parse do FIREBASE_SERVICE_ACCOUNT_JSON:", e);
    }
  } 
  // 2. Tenta carregar via Caminho de Arquivo (Bom para Dev Local)
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const keyPath = path.resolve((process as any).cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    if (fs.existsSync(keyPath)) {
      try {
        const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        credential = cert(serviceAccount);
        console.log(`🔒 Firebase Admin: Autenticado via arquivo (${process.env.FIREBASE_SERVICE_ACCOUNT_PATH}).`);
      } catch (e) {
        console.error("❌ Erro ao ler arquivo de credencial:", e);
      }
    } else {
      console.warn(`⚠️ Arquivo de credencial não encontrado em: ${keyPath}`);
    }
  }

  // 3. Fallback: Application Default Credentials (GCP) ou Emulador
  // Se 'credential' for undefined, o initializeApp tentará descobrir automaticamente
  // (útil se rodando dentro do Google Cloud Functions ou se o emulador estiver ativo)
  
  if (!credential) {
    console.log("⚠️ Firebase Admin: Usando Application Default Credentials ou Emulador.");
  }

  app = initializeApp({
    credential,
    projectId
  });
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
export const adminApp = app;