import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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
        await createUserWithEmailAndPassword(auth, "cms_admin_system@aireadiness.com", "Admin!@#123");
        console.log("Created cms_admin_system@aireadiness.com");
    } catch(e) {
        console.log("Create failed (might already exist):", e.message);
        try {
            await signInWithEmailAndPassword(auth, "cms_admin_system@aireadiness.com", "Admin!@#123");
            console.log("Logged in successfully!");
        } catch (err) {
            console.error("Login failed:", err.message);
        }
    }
    process.exit(0);
}
setup();
