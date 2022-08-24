importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBQ29BzygLnbi_Kik040CJdD23VQGTS8JI",
  authDomain: "florida-man-stories.firebaseapp.com",
  projectId: "florida-man-stories",
  storageBucket: "florida-man-stories.appspot.com",
  messagingSenderId: "115019497136",
  appId: "1:115019497136:web:13f78026a58f2f1314c575",
  measurementId: "G-N9L93WEEF4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log(
    'FloridaManStories: Received background message ',
    payload,
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});
self.addEventListener('notificationclick', (event) => {
  console.log(event);
});
