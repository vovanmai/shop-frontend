importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCzhftdHfnCozHmDzotUhqc1tOa31oWuFg",
  authDomain: "test-notification-3a458.firebaseapp.com",
  projectId: "test-notification-3a458",
  storageBucket: "test-notification-3a458.appspot.com",
  messagingSenderId: "60163606203",
  appId: "1:60163606203:web:0fd785623365b2d74d4b9e",
  measurementId: "G-ZEENM2L5KM"
};

 firebase.initializeApp(firebaseConfig);

 const messaging = firebase.messaging();

 messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/next.svg'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});


// Xử lý sự kiện click vào thông báo
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Đóng thông báo khi người dùng nhấp vào nó
  // Mở trang cập nhật hoặc trang chính khi người dùng nhấp vào thông báo
  event.waitUntil(
    clients.openWindow('/')
  );
});