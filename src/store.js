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
    hero: { buttonText: 'Take Pilot Survey' },
    about: { 
        title: 'AI Readiness in Education', 
        text: 'Offering highly scalable insights for universities and policymakers seeking to enhance AI readiness among graduates in rapidly evolving labour markets.\n\nGiven the low cost of this light-touch information intervention - a short, online awareness training, we expect any modest, positive results to offer a scalable policy lever for educational institutions and policymakers in Kenya and similar contexts to improve the job search processes and job market readiness of their students to the evolving job market needs.\n\nAny potential effects on willingness-to-pay for further training may also have implications for local institutions on how to improve curriculum design and post-graduate program offerings.' 
    },
    countdownDate: '2026-12-01T10:00:00',
    posterUrl: '',
    logoUrl: '',
    phoneNumber: '+254768980297',
    mission: 'To spearhead data-driven research that explores how generative AI impacts higher education and graduate employability across East Africa.',
    vision: 'To provide universities and policymakers with actionable, evidence-based insights that bridge the gap between academic curricula and the evolving demands of an AI-driven labor market.',
    whatsappLink: 'https://chat.whatsapp.com/FDJbRo6Uhhe1nAeMQqiSbU',
    qualtricsLink: 'https://qualtricsxmqzrhrhsd5.qualtrics.com/jfe/form/SV_aXAMpt2gs4KWPdA',
    team: [
        { 
            name: 'Khan Ulberg', 
            role: 'Lead Researcher',
            description: 'Based in the UK, Khan is the lead researcher behind the AI Readiness Project and the primary author of the upcoming foundational research paper.',
            imageUrl: 'https://ui-avatars.com/api/?name=Khan+Ulberg&background=1b2c57&color=fff'
        },
        { 
            name: 'Madam Lucy Nabalanga', 
            role: 'Professor & Coordinator',
            description: 'A Professor at KCA University, acting as the primary liaison connecting the UK research team with academic institutions in Kenya.',
            imageUrl: 'https://ui-avatars.com/api/?name=Lucy+Nabalanga&background=bea429&color=fff'
        },
        { 
            name: 'Alexander Njuguna', 
            role: 'Project Supervisor',
            description: 'Serving as a supervisor and assistant to Madam Lucy, Alexander oversees on-the-ground survey logistics and coordination.',
            imageUrl: 'https://ui-avatars.com/api/?name=Alexander+Njuguna&background=1b2c57&color=fff'
        },
        { 
            name: 'Feiswal Dindi Nyango', 
            role: 'Software Developer & Field Assistant',
            description: 'Technical lead for the project platform and an active field assistant, conducting surveys and gathering participant data.',
            imageUrl: 'https://ui-avatars.com/api/?name=Feiswal+Dindi&background=bea429&color=fff'
        },
        { 
            name: 'Stephen Masharia', 
            role: 'Software Developer & Field Assistant',
            description: 'Core software developer and field assistant, building the digital infrastructure and supporting field survey collection.',
            imageUrl: 'https://ui-avatars.com/api/?name=Stephen+Masharia&background=1b2c57&color=fff'
        }
    ],
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

  async uploadImage(file, path) {
      // Inline import to prevent loading storage SDK until needed
      const { ref: storageRef, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('./firebase');
      
      const fileRef = storageRef(storage, `${path}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      return url;
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