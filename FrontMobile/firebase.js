// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVQVW4BD7xDcVOgwUQ3jg0b2yHQj88F_I",
  authDomain: "kounouz-al-najah.firebaseapp.com",
  projectId: "kounouz-al-najah",
  storageBucket: "kounouz-al-najah.firebasestorage.app",
  messagingSenderId: "663428074161",
  appId: "1:663428074161:web:1139b511c603c019e0f090",
  measurementId: "G-124WH6WM6N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
