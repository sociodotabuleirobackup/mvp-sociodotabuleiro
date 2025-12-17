
/**
 * Service de Notificações
 * Utiliza a API nativa de Notifications do navegador.
 * Preparado para integração futura com Supabase Realtime.
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
      // Retorna um identificador fake para manter a compatibilidade com o fluxo da UI
      return "browser_push_id_" + Math.random().toString(36).substring(7);
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
  // Listener genérico para mensagens em tempo real
  console.log('Listener de mensagens nativas ativado.');
  return () => {
    console.log('Listener desativado.');
  };
};
