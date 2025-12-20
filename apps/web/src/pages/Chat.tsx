import React, { useState } from 'react';
import { ChatThread, ChatMessage, MessageType } from '@socio-do-tabuleiro/shared';

const CURRENT_USER_ID = 'me';
const OTHER_USER_ID = 'other';
const CHAT_ID = 'chat-1';

const THREADS: ChatThread[] = [
  {
    id: '1',
    participantName: 'Mestre Alex',
    participantAvatar: 'https://picsum.photos/seed/master1/50',
    lastMessage: 'Podemos começar às 19h?',
    lastMessageTime: '10:30',
    unreadCount: 1,
  },
  {
    id: '2',
    participantName: 'Grupo: A Maldição de Strahd',
    participantAvatar: 'https://picsum.photos/seed/strahd/50',
    lastMessage: 'João: Eu levo os snacks!',
    lastMessageTime: 'Ontem',
    unreadCount: 0,
  },
];

const MESSAGES: ChatMessage[] = [
  {
    id: '1',
    content: 'Olá! Tudo certo para a sessão de hoje?',
    type: MessageType.TEXT,
    userId: OTHER_USER_ID,
    chatId: CHAT_ID,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    content: 'Podemos começar às 19h?',
    type: MessageType.TEXT,
    userId: OTHER_USER_ID,
    chatId: CHAT_ID,
    createdAt: new Date().toISOString(),
  },
];

export const Chat: React.FC = () => {
  const [activeThreadId, setActiveThreadId] = useState<string>(THREADS[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(MESSAGES);

  const activeThread = THREADS.find(t => t.id === activeThreadId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      type: MessageType.TEXT,
      userId: CURRENT_USER_ID,
      chatId: CHAT_ID,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-background max-w-7xl mx-auto sm:px-4 sm:py-4">
      {/* Threads List (Sidebar) */}
      <div
        className={`w-full sm:w-80 md:w-96 flex-shrink-0 bg-surface sm:rounded-l-2xl border-r border-white/5 flex flex-col ${activeThreadId ? 'hidden sm:flex' : 'flex'}`}
      >
        <div className="p-4 border-b border-white/5">
          <h2 className="text-xl font-display font-bold">Mensagens</h2>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-black/20 border border-white/5 rounded-lg py-2 pl-8 pr-4 text-sm focus:border-primary/50 outline-none"
            />
            <span className="material-symbols-outlined absolute left-2 top-2 text-gray-500 text-lg">
              search
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {THREADS.map(thread => (
            <div
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-white/5 ${activeThreadId === thread.id ? 'bg-white/5 border-l-2 border-primary' : ''}`}
            >
              <div className="relative">
                <img
                  src={thread.participantAvatar}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                {thread.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-surface"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm truncate">
                    {thread.participantName}
                  </h3>
                  <span className="text-[10px] text-gray-500">
                    {thread.lastMessageTime}
                  </span>
                </div>
                <p
                  className={`text-xs truncate ${thread.unreadCount > 0 ? 'text-white font-bold' : 'text-gray-500'}`}
                >
                  {thread.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 bg-surface/50 sm:rounded-r-2xl flex flex-col ${!activeThreadId ? 'hidden sm:flex' : 'flex'}`}
      >
        {activeThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-surface">
              <button
                onClick={() => setActiveThreadId('')}
                className="sm:hidden text-gray-400"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <img
                src={activeThread.participantAvatar}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-bold text-sm">
                  {activeThread.participantName}
                </h3>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>{' '}
                  Online
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => {
                const isMe = msg.userId === CURRENT_USER_ID;
                const displayTime = new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}
                    >
                      <p>{msg.content}</p>
                      <span
                        className={`text-[10px] block mt-1 text-right ${isMe ? 'text-white/60' : 'text-gray-500'}`}
                      >
                        {displayTime}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-white/5 bg-surface"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                />
                <button
                  type="submit"
                  className="p-3 bg-primary hover:bg-primary-hover rounded-xl text-white transition-colors"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">
              forum
            </span>
            <p>Selecione uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  );
};
