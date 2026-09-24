import { reactive } from 'vue';
import { db, auth } from './firebase'; 
import { 
    doc, setDoc, getDoc, onSnapshot, collection, addDoc, serverTimestamp, query, orderBy, limit 
} from 'firebase/firestore'; 
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile 
} from 'firebase/auth';

const USER_KEY = 'ra_user_session'; 
const CONTENT_KEY = 'ra_site_content';
const APP_VERSION = 'v2.10'; 

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
        const parsed = JSON.parse(saved);
        // Force cache wipe if version mismatch to clear stale data
        if (parsed.version !== APP_VERSION) {
            localStorage.removeItem(CONTENT_KEY);
            return null;
        }
        return parsed.data;
    } catch (e) { return null; }
};

const savedUser = loadUser();

// --- STORE DEFINITION ---
export const store = reactive({
  user: savedUser,         
  isLoginModalOpen: false,
  isLogoutModalOpen: false,
  isAdmin: savedUser?.role === 'admin', 
  intent: null,
  userProfile: { surveyCompleted: false },
  
  activityLogs: [],
  isLoadingLogs: true,
  isDataReady: false,

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
    pageBackgrounds: {
        insights: '',
        contact: '',
        careers: '',
        partners: '',
        services: '',
        about: '',
        focus_job: '',
        focus_curriculum: '',
        focus_tools: ''
    },
    phoneNumber: '+254768980297',
    policies: 'By creating an account, you consent to participate in the AI Readiness in Education research study.\n\nEmail Usage: Your email address will be securely stored in our database. We will use it exclusively to notify you when the Main AI Readiness Assessment survey is available.\n\nData Privacy: All data collected is strictly confidential and will only be used for research purposes. We will not share your personal information with third parties.',
    mission: 'To spearhead data-driven research that explores how generative AI impacts higher education and graduate employability across East Africa.',
    vision: 'To provide universities and policymakers with actionable, evidence-based insights that bridge the gap between academic curricula and the evolving demands of an AI-driven labor market.',
    whatsappLink: 'https://chat.whatsapp.com/FDJbRo6Uhhe1nAeMQqiSbU',
    qualtricsLink: 'https://qualtricsxmqzrhrhsd5.qualtrics.com/jfe/form/SV_aXAMpt2gs4KWPdA',
    team: [
        { 
            name: 'Khan Ulberg', 
            role: 'Lead Researcher',
            description: 'Based in the UK, Khan is the lead researcher behind the AI Readiness Project and the primary author of the upcoming foundational research paper.',
            imageUrl: 'https://ui-avatars.com/api/?name=UK&background=1b2c57&color=fff'
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

  // 1.5 GLOBAL CONTENT LISTENER
  initContentListener() {
      const docRef = doc(db, "global_content", "main_data");
      onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
              Object.assign(this.content, snap.data());
              localStorage.setItem(CONTENT_KEY, JSON.stringify({ version: APP_VERSION, data: this.content }));
          } else {
              // First time setup, save default content to DB
              this.saveContent();
          }
          this.isDataReady = true;
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

  // --- USER PROFILE & SURVEY TRACKING ---
  async syncUserProfile() {
      if (!this.user || this.isAdmin) return;
      try {
          const docRef = doc(db, "participants", this.user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
              this.userProfile = snap.data();
          } else {
              this.userProfile = { surveyCompleted: false, joined: new Date().toISOString() };
              await setDoc(docRef, this.userProfile);
          }
      } catch (e) {
          console.error("Profile Sync Error", e);
      }
  },

  startSurveyFlow() {
      if (this.user) {
          localStorage.setItem('pending_survey_verification', 'true');
          window.open(this.content.qualtricsLink, '_blank');
      } else {
          this.intent = 'survey';
          this.isLoginModalOpen = true;
      }
  },

  async markSurveyCompleted() {
      if (!this.user || this.isAdmin) return;
      this.userProfile.surveyCompleted = true;
      try {
          await setDoc(doc(db, "participants", this.user.uid), { surveyCompleted: true }, { merge: true });
          this.trackActivity("Survey Completed", "Participant completed the main survey.");
      } catch (e) {
          console.error("Survey Mark Error", e);
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
        await this.syncUserProfile();
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
    await this.syncUserProfile();
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
          
          await this.syncUserProfile();
          
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
      return setDoc(doc(db, "global_content", "main_data"), JSON.parse(JSON.stringify(this.content)))
        .catch(e => {
            console.error("Save Error:", e);
            throw e;
        });
  },

  async uploadImage(file, path, onProgress) {
      return new Promise((resolve, reject) => {
          // Simulate a fast progress bar for UI liveliness
          let progress = 0;
          const interval = setInterval(() => {
              progress += 20;
              if (progress > 90) progress = 90;
              if (onProgress) onProgress(progress);
          }, 50);

          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = event => {
              const img = new Image();
              img.src = event.target.result;
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const MAX_WIDTH = 1200;
                  const MAX_HEIGHT = 1200;
                  let width = img.width;
                  let height = img.height;

                  // Maintain aspect ratio while downscaling
                  if (width > height) {
                      if (width > MAX_WIDTH) {
                          height *= MAX_WIDTH / width;
                          width = MAX_WIDTH;
                      }
                  } else {
                      if (height > MAX_HEIGHT) {
                          width *= MAX_HEIGHT / height;
                          height = MAX_HEIGHT;
                      }
                  }
                  canvas.width = width;
                  canvas.height = height;
                  
                  // Draw and compress
                  const ctx = canvas.getContext('2d');
                  ctx.drawImage(img, 0, 0, width, height);
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                  
                  clearInterval(interval);
                  if (onProgress) onProgress(100);
                  
                  // Return the highly compressed string directly to be saved in Firestore Database
                  resolve(dataUrl);
              };
              img.onerror = () => {
                  clearInterval(interval);
                  reject(new Error("Image processing failed."));
              };
          };
          reader.onerror = () => {
              clearInterval(interval);
              reject(new Error("File read failed."));
          };
      });
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