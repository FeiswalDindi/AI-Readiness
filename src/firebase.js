import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // [NEW] Import Database

// YOUR CONFIG (Keep your own keys here!)
const firebaseConfig = {
  apiKey: "AIzaSyAjb-zCuKRduJHdfhZmXVb8IUaRP_P_6LY",
  authDomain: "ra-consulting-app.firebaseapp.com",
  projectId: "ra-consulting-app",
  storageBucket: "ra-consulting-app.appspot.com",
  messagingSenderId: "123456...",
  appId: "1:123456..."
};

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Export Tools
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // [NEW] Export Database