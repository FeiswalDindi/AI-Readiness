import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
const db = getFirestore(app);

async function setup() {
    try {
        console.log("Trying to login as admin...");
        await signInWithEmailAndPassword(auth, "system_admin_ra@example.com", "SuperSecret123!");
        console.log("Logged in!");
    } catch (e) {
        console.log("Login failed, creating...", e.code);
        try {
            await createUserWithEmailAndPassword(auth, "system_admin_ra@example.com", "SuperSecret123!");
            console.log("Created!");
        } catch (err) {
            console.error("Create failed", err);
        }
    }
    
    // Now try writing to Firestore to prove we have access
    try {
        await setDoc(doc(db, "global_content", "ping"), { time: Date.now() });
        console.log("Firestore write SUCCESS!");
    } catch(e) {
        console.error("Firestore write FAILED!", e.message);
    }
}
setup();
