import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBSdouCS5OGRZ_0rZnZEj5e8bAFivjdsOw",
  authDomain: "ai-readiness-b3883.firebaseapp.com",
  projectId: "ai-readiness-b3883",
  databaseURL: "https://ai-readiness-b3883-default-rtdb.firebaseio.com",
  storageBucket: "ai-readiness-b3883.firebasestorage.app",
  messagingSenderId: "480767747886",
  appId: "1:480767747886:web:f9b743198bb3ee207afcbf",
  measurementId: "G-E2BQXJN380"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function setup() {
    try {
        await set(ref(db, 'ping'), { time: Date.now() });
        console.log("RTDB write SUCCESS!");
    } catch(e) {
        console.error("RTDB write FAILED!", e.message);
    }
    process.exit(0);
}
setup();
