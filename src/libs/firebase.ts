import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCzhftdHfnCozHmDzotUhqc1tOa31oWuFg",
    authDomain: "test-notification-3a458.firebaseapp.com",
    projectId: "test-notification-3a458",
    storageBucket: "test-notification-3a458.appspot.com",
    messagingSenderId: "60163606203",
    appId: "1:60163606203:web:0fd785623365b2d74d4b9e",
    measurementId: "G-ZEENM2L5KM"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app
