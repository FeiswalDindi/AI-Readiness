import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSdouCS5OGRZ_0rZnZEj5e8bAFivjdsOw",
  authDomain: "ai-readiness-b3883.firebaseapp.com",
  projectId: "ai-readiness-b3883",
  storageBucket: "ai-readiness-b3883.firebasestorage.app",
  messagingSenderId: "480767747886",
  appId: "1:480767747886:web:f9b743198bb3ee207afcbf",
  measurementId: "G-E2BQXJN380"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function setup() {
    try {
        await signInAnonymously(auth);
        console.log("Anonymous Auth SUCCESS! UID:", auth.currentUser.uid);
    } catch(e) {
        console.error("Anonymous Auth FAILED!", e.message);
    }
    process.exit(0);
}
setup();
