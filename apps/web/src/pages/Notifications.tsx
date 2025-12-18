import React, { useState } from 'react';
import { useAuth } from '../store';
// Changed react-router-dom to react-router to fix missing export errors
import { useNavigate } from 'react-router';
import { requestNotificationPermission } from '../services/notifications';

export const Notifications: React.FC = () => {
  const { notifications, markAsRead } = useAuth();
  const navigate = useNavigate();
  const [permissionStatus, setPermissionStatus] = useState(
    Notification.permission
  );

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      navigate(link);
    }
  };

  const handleEnableNotifications = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setPermissionStatus('granted');
      alert('Notificações ativadas! (Token gerado no console para debug)');
    } else {
      setPermissionStatus('denied');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOKING':
        return 'confirmation_number';
      case 'PAYMENT':
        return 'payments';
      case 'CHAT':
        return 'chat';
      default:
        return 'notifications';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'BOOKING':
        return 'text-accent';
      case 'PAYMENT':
        return 'text-green-400';
      case 'CHAT':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-display font-bold">Notificações</h1>
        <div className="flex gap-4 items-center">
          {permissionStatus === 'default' && (
            <button
              onClick={handleEnableNotifications}
              className="flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary border border-primary/50 rounded-lg text-xs font-bold hover:bg-primary/30 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                notifications_active
              </span>
              Ativar Push
            </button>
          )}
          <button className="text-xs text-primary hover:underline">
            Marcar todas como lidas
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">
              notifications_off
            </span>
            <p>Nenhuma notificação por enquanto.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() =>
                handleNotificationClick(notif.id, notif.actionLink)
              }
              className={`p-4 rounded-xl flex gap-4 cursor-pointer transition-all hover:translate-x-1 ${notif.read ? 'bg-surface/30 border border-transparent' : 'bg-surface border-l-4 border-primary shadow-lg'}`}
            >
              <div
                className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 ${getColor(notif.type)}`}
              >
                <span className="material-symbols-outlined">
                  {getIcon(notif.type)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3
                    className={`text-sm font-bold mb-1 ${notif.read ? 'text-gray-400' : 'text-white'}`}
                  >
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-gray-600">
                    {notif.date}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div className="self-center">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
