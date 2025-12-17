
/**
 * Service de Notificações
 * Refatorado para remover Firebase. 
 * Futuramente pode integrar com Supabase Realtime ou Web Push nativo.
 */

export const requestNotificationPermission = async (): Promise<string | null> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn("Notificações não suportadas neste navegador.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Permissão de notificação concedida.');
      // Simula um token para manter compatibilidade com a UI
      return "mock_push_token_" + Math.random().toString(36).substring(7);
    } else {
      console.log('Permissão de notificação negada.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação.', error);
    return null;
  }
};

export const onForegroundMessage = async () => {
  // Placeholder para lógica de escuta em tempo real via Supabase
  console.log('Listener de mensagens em primeiro plano ativado (Stub).');
  return () => {};
};
