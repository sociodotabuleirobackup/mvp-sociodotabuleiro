import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase/client";

// Chave pública VAPID fornecida
const VAPID_KEY = "BFL-T2HJMbYYetA0Haw4sZ7-q6OMV9hTOey7J0UduAG4mXmcfIwKQmr7jguKiostLEWVs0AUGghcyTjq93akmyg";

export const requestNotificationPermission = async (): Promise<string | null> => {
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
        // TODO: Enviar este token para o backend (Firestore) para salvar no perfil do usuário
        return currentToken;
      } else {
        console.log('Nenhum token de registro disponível. Solicite permissão para gerar um.');
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

// Listener para mensagens recebidas enquanto o app está em primeiro plano (Foreground)
export const onForegroundMessage = () => {
  if (!messaging) return;
  
  return onMessage(messaging, (payload) => {
    console.log('Mensagem recebida em primeiro plano:', payload);
    // Aqui você pode disparar um toast/alerta na UI
    // Ex: new Notification(payload.notification.title, { body: payload.notification.body });
  });
};