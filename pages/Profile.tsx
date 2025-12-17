import React, { useState } from 'react';
import { useAuth } from '../store';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-display font-bold">Perfil</h1>
         <button 
           onClick={() => setIsEditing(!isEditing)}
           className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-sm font-bold transition-colors"
         >
           {isEditing ? 'Cancelar' : 'Editar Perfil'}
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4 h-fit">
           <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-primary to-accent">
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover border-4 border-background" />
           </div>
           <div>
             <h2 className="text-xl font-bold font-display">{user.name}</h2>
             <span className="text-xs uppercase tracking-widest text-primary font-bold px-3 py-1 bg-primary/10 rounded-full mt-2 inline-block">
               {user.role}
             </span>
           </div>
           <div className="w-full pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-2xl font-bold font-display">12</span>
                <span className="text-[10px] text-gray-500 uppercase">Sessões</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-display text-accent">4.9</span>
                <span className="text-[10px] text-gray-500 uppercase">Avaliação</span>
              </div>
           </div>
        </div>

        {/* Right Column: Details & Settings */}
        <div className="md:col-span-2 glass-panel p-8 rounded-2xl space-y-8">
           
           {/* Account Info */}
           <section className="space-y-4">
             <h3 className="text-lg font-bold border-b border-white/10 pb-2 flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">badge</span>
               Dados da Conta
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email</label>
                 <input disabled value={user.email} className="w-full bg-surface/50 border border-white/5 rounded p-2 text-gray-400 cursor-not-allowed" />
               </div>
               <div>
                 <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">ID de Usuário</label>
                 <div className="flex items-center gap-2">
                   <input disabled value={user.uid} className="w-full bg-surface/50 border border-white/5 rounded p-2 text-gray-400 font-mono text-xs" />
                   <button className="text-gray-500 hover:text-white"><span className="material-symbols-outlined text-sm">content_copy</span></button>
                 </div>
               </div>
             </div>
           </section>

           {/* Role Specific Settings */}
           <section className="space-y-4">
             <h3 className="text-lg font-bold border-b border-white/10 pb-2 flex items-center gap-2">
               <span className="material-symbols-outlined text-accent">tune</span>
               Preferências
             </h3>
             
             <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/5 rounded-lg text-sm border border-white/10">D&D 5e</span>
                <span className="px-3 py-1 bg-white/5 rounded-lg text-sm border border-white/10">Cyberpunk</span>
                <button className="px-3 py-1 bg-transparent border border-dashed border-gray-600 text-gray-500 rounded-lg text-sm hover:text-white hover:border-white transition-colors">+ Adicionar Tag</button>
             </div>
           </section>

           {/* Legal & Danger Zone */}
           <section className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                 <button className="text-gray-400 hover:text-white text-sm underline">Termos de Uso</button>
                 <button className="text-red-500 hover:text-red-400 text-sm font-bold">Sair da Conta</button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};