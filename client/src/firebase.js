// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-99596.firebaseapp.com",
  projectId: "blog-app-99596",
  storageBucket: "blog-app-99596.firebasestorage.app",
  messagingSenderId: "796729104193",    
  appId: "1:796729104193:web:9bdf567e8c95d383cef3c0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);