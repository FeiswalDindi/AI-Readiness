import { reactive } from 'vue';
import { db, auth } from './firebase'; 
import { 
    doc, setDoc, onSnapshot, collection, addDoc, serverTimestamp, query, orderBy, limit 
} from 'firebase/firestore'; 
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile 
} from 'firebase/auth';

const USER_KEY = 'ra_user_session'; 
const CONTENT_KEY = 'ra_site_content';
const APP_VERSION = 'v2.8'; 

// --- HELPERS ---
const loadUser = () => {
    try {
        const saved = localStorage.getItem(USER_KEY);
        if (!saved) return null;
        return JSON.parse(saved);
    } catch (e) { return null; }
};

const loadContent = () => {
    try {
        const saved = localStorage.getItem(CONTENT_KEY);
        if (!saved) return null;
        return JSON.parse(saved).data;
    } catch (e) { return null; }
};

const savedUser = loadUser();

// --- STORE DEFINITION ---
export const store = reactive({
  user: savedUser,         
  isLoginModalOpen: false,
  isLogoutModalOpen: false,
  isAdmin: savedUser?.role === 'admin', 
  
  activityLogs: [],
  isLoadingLogs: true,

  content: loadContent() || {
    heroSlides: [], 
    hero: { buttonText: 'Explore Our Services' },
    about: { title: 'Who We Are', text: 'RA Strategic & Analytics Consulting Ltd is a multidisciplinary advisory firm...' },
    socialUpdates: [],
    resources: [] 
  },

  // 1. GLOBAL LOG LISTENER
  initLogListener() {
      const q = query(collection(db, "user_logs"), orderBy("timestamp", "desc"), limit(1000));
      onSnapshot(q, (snapshot) => {
          this.activityLogs = snapshot.docs.map(doc => {
              const data = doc.data();
              let jsDate = new Date();
              if (data.timestamp && data.timestamp.seconds) {
                  jsDate = new Date(data.timestamp.seconds * 1000);
              }
              return {
                  id: doc.id,
                  ...data,
                  time: jsDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
                  rawDate: jsDate 
              };
          });
          this.isLoadingLogs = false;
      });
  },

  // 2. UNIVERSAL TRACKER
  async trackActivity(actionType, details = "") {
      try {
          const identity = this.user ? {
              name: this.user.displayName,
              email: this.user.email,
              role: this.user.role || 'User'
          } : {
              name: 'Guest (Visitor)',
              email: 'N/A',
              role: 'Anonymous'
          };

          await addDoc(collection(db, "user_logs"), {
              userEmail: identity.email,
              userName: identity.name,
              userRole: identity.role,
              action: actionType,
              details: details,
              timestamp: serverTimestamp()
          });
      } catch (e) {
          console.error("Tracking Error:", e);
      }
  },

  // --- AUTHENTICATION ---

  async login(email, password) {
    let loggedInUser = null;

    if (email === 'admin123@gmail.com' && password === 'admin') {
        loggedInUser = { 
            displayName: 'Feisal Dindi', 
            email: email, 
            role: 'admin',
            uid: 'admin_master_01',
            avatar: 'https://ui-avatars.com/api/?name=Feisal+Dindi&background=1a2b49&color=fff' 
        };
        this.isAdmin = true;
    }
    else if (email === 'client@demo.com' && password === 'client123') {
        loggedInUser = { 
            displayName: 'Demo Client', 
            email: email, 
            role: 'client', 
            uid: 'demo_client_01',
            avatar: 'https://ui-avatars.com/api/?name=Demo+Client&background=0ea5e9&color=fff' 
        };
        this.isAdmin = false;
    }
    else {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            
            loggedInUser = {
                displayName: firebaseUser.displayName || 'Valued Client',
                email: firebaseUser.email,
                role: 'client',
                uid: firebaseUser.uid,
                avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email}&background=0ea5e9&color=fff`
            };
            this.isAdmin = false;
        } catch (error) {
            console.error("Login Failed:", error.message);
            return false;
        }
    }

    // FINAL: SAVE SESSION & PREVENT DOUBLE LOGGING
    if (loggedInUser) {
        this.user = loggedInUser;
        sessionStorage.setItem('ra_session_active', 'true'); // <-- SET SESSION ACTIVE
        localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
        this.trackActivity("Login", `User logged in: ${loggedInUser.email}`);
        return true;
    }
    return false;
  },

  async googleLogin(firebaseUser) {
    const loggedInUser = {
        displayName: firebaseUser.displayName || 'Valued Client',
        email: firebaseUser.email,
        role: 'client',
        uid: firebaseUser.uid,
        avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email}&background=0ea5e9&color=fff`
    };
    
    this.user = loggedInUser;
    this.isAdmin = false;
    sessionStorage.setItem('ra_session_active', 'true');
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    this.trackActivity("Login", `User logged in via Google: ${loggedInUser.email}`);
    return true;
  },

  async signup(name, email, password) {
      try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          await updateProfile(user, {
              displayName: name,
              photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=28a745&color=fff`
          });

          const newUserProfile = {
              uid: user.uid,
              displayName: name,
              email: email,
              role: 'client',
              createdAt: serverTimestamp()
          };

          await setDoc(doc(db, "users", user.uid), newUserProfile);

          this.user = {
              ...newUserProfile,
              avatar: user.photoURL
          };
          this.isAdmin = false;
          
          sessionStorage.setItem('ra_session_active', 'true'); // <-- SET SESSION ACTIVE
          localStorage.setItem(USER_KEY, JSON.stringify(this.user));
          
          this.trackActivity("Sign Up", "New Account Created via Portal");
          return true;

      } catch (error) {
          console.error("Signup Error:", error);
          alert(error.message); 
          return false;
      }
  },
  
  async logout() {
      try {
          await signOut(auth); 
          this.trackActivity("Logout", "User signed out");
          this.user = null;
          this.isAdmin = false;
          localStorage.removeItem(USER_KEY);
          sessionStorage.removeItem('ra_session_active'); // <-- DESTROY SESSION
          this.isLogoutModalOpen = false;
      } catch (e) {
          console.error("Logout Error", e);
      }
  },

  // --- CMS ACTIONS ---
  saveContent() {
      localStorage.setItem(CONTENT_KEY, JSON.stringify({ version: APP_VERSION, data: this.content }));
      setDoc(doc(db, "global_content", "main_data"), JSON.parse(JSON.stringify(this.content)))
        .catch(e => console.error("Save Error:", e));
  },

  addResource(resource) {
      if (!this.content.resources) this.content.resources = [];
      this.content.resources.unshift(resource);
      this.saveContent();
      this.trackActivity("Content Update", `Admin uploaded file: ${resource.fileName}`);
  },

  deleteResource(index) {
      const removed = this.content.resources[index];
      this.content.resources.splice(index, 1);
      this.saveContent();
      this.trackActivity("Content Update", `Admin deleted file: ${removed.title}`);
  },

  openModal() { this.isLoginModalOpen = true; },
  closeModal() { this.isLoginModalOpen = false; }
});

// START LISTENERS
store.initLogListener();
onSnapshot(doc(db, "global_content", "main_data"), (doc) => {
    if (doc.exists()) {
        store.content = doc.data();
        localStorage.setItem(CONTENT_KEY, JSON.stringify({ version: APP_VERSION, data: store.content }));
    }
});

// --- NEW: CATCH HARDCODED USERS RETURNING ---
if (store.user && !sessionStorage.getItem('ra_session_active')) {
    sessionStorage.setItem('ra_session_active', 'true');
    store.trackActivity("Session Resumed", `User returned to the portal: ${store.user.email}`);
}