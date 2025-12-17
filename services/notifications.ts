import { getToken, onMessage, Messaging } from "firebase/messaging";
import { messagingPromise } from "../firebase/client";

const VAPID_KEY = "BFL-T2HJMbYYetA0Haw4sZ7-q6OMV9hTOey7J0UduAG4mXmcfIwKQmr7jguKiostLEWVs0AUGghcyTjq93akmyg";

export const requestNotificationPermission = async (): Promise<string | null> => {
  const messaging: Messaging | null = await messagingPromise;
  
  if (!messaging) {
    console.warn("Messaging não suportado neste navegador.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Permissão de notificação concedida.');
      
      const currentToken = await getToken(messaging, { 
        vapidKey: VAPID_KEY 
      });

      if (currentToken) {
        console.log('Token FCM obtido:', currentToken);
        return currentToken;
      } else {
        console.log('Nenhum token de registro disponível.');
        return null;
      }
    } else {
      console.log('Permissão de notificação negada.');
      return null;
    }
  } catch (error) {
    console.error('Um erro ocorreu ao tentar recuperar o token.', error);
    return null;
  }
};

export const onForegroundMessage = async () => {
  const messaging: Messaging | null = await messagingPromise;
  if (!messaging) return;
  
  return onMessage(messaging, (payload) => {
    console.log('Mensagem recebida em primeiro plano:', payload);
  });
};