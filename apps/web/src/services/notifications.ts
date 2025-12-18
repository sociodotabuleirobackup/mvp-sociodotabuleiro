/**
 * Service de Notificações
 * Foca em Notificações Push do Navegador (Client-side)
 * Resolve conflitos de tipos entre Firebase Admin e o bundle de frontend.
 */

export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Notificações não são suportadas por este navegador.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Permissão de notificação concedida.');
      // Simula a geração de um token para manter compatibilidade com o fluxo
      return 'browser_push_id_' + Math.random().toString(36).substring(7);
    } else {
      console.log('Permissão de notificação negada.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação.', error);
    return null;
  }
};

/**
 * Escuta mensagens enquanto o app está aberto.
 * Utiliza o BroadcastChannel ou eventos de window para simular push em foreground.
 */
export const onForegroundMessage = (callback: (payload: any) => void) => {
  console.log('Listener de notificações ativado.');

  const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'RPG_NOTIFICATION') {
      callback(event.data.payload);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('message', handleMessage);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', handleMessage);
    }
  };
};
