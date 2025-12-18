// Scripts do Firebase (versão compatível com Service Worker)
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

// Configuração do Firebase no Service Worker
// Nota: Service Workers não têm acesso a variáveis de ambiente (.env) em tempo de execução
// da mesma forma que o bundle principal, então as chaves públicas são definidas aqui.
firebase.initializeApp({
  apiKey: 'AIzaSyBXDHvCBWP1kV6Oc7sFZZqkyAmk_BmfvrM',
  authDomain: 'sociodotabuleiro-3f0af.firebaseapp.com',
  projectId: 'sociodotabuleiro-3f0af',
  storageBucket: 'sociodotabuleiro-3f0af.firebasestorage.app',
  messagingSenderId: '1034603961376',
  appId: '1:1034603961376:web:76f000637c0fb30a6db045',
  measurementId: 'G-07LY11GES2',
});

const messaging = firebase.messaging();

// Handler opcional para notificações recebidas enquanto o app está em background
messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Notificação recebida em background ',
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png', // Certifique-se de ter um ícone ou remova esta linha
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
