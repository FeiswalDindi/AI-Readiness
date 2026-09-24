import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
const db = getFirestore(app);

async function setup() {
    try {
        await getDoc(doc(db, "global_content", "main_data"));
        console.log("Firestore read SUCCESS!");
    } catch(e) {
        console.error("Firestore read FAILED!", e.message);
    }
    process.exit(0);
}
setup();
