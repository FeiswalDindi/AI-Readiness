import { reactive } from 'vue';
import { db, auth, storage } from './firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { compressImage } from './utils/imageCompressor';
import { getDocSizeDetails, checkStorageStatus } from './utils/firebaseDiagnostics';
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
const APP_VERSION = 'v2.11'; 

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
  storageHealth: null,
  docSizeInfo: null,

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
              
              // DB MIGRATION PATCH: Force Khan's avatar to read 'UK'
              if (this.content.team && this.content.team.length > 0 && this.content.team[0].name.includes('Khan')) {
                  if (this.content.team[0].imageUrl.includes('Khan+Ulberg')) {
                      this.content.team[0].imageUrl = 'https://ui-avatars.com/api/?name=UK&background=1b2c57&color=fff';
                      this.saveContent(); 
                  }
              }

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
      const sizeInfo = getDocSizeDetails(this.content);
      this.docSizeInfo = sizeInfo;
      
      if (sizeInfo.sizeBytes >= 1048576) {
          const errMsg = `Cannot save! Content size is ${(sizeInfo.sizeBytes / 1024).toFixed(1)} KB, which exceeds the 1,024 KB Firestore limit. Please click 'Optimize Database' to shrink embedded images or use Firebase Storage.`;
          console.error(errMsg);
          alert(errMsg);
          return Promise.reject(new Error(errMsg));
      }

      localStorage.setItem(CONTENT_KEY, JSON.stringify({ version: APP_VERSION, data: this.content }));
      return setDoc(doc(db, "global_content", "main_data"), JSON.parse(JSON.stringify(this.content)))
        .catch(e => {
            console.error("Save Error:", e);
            if (e.code === 'permission-denied') {
                alert("Permission denied! Your Cloud Firestore rules may have expired (Test Mode expires in 30 days). Please update your Firestore Database Rules in Firebase Console to: allow read, write: if true;");
            } else if (e.code === 'resource-exhausted' || (e.message && e.message.includes('1,048,576'))) {
                alert("Database limit exceeded! The content is too large (over 1MB). Please click 'Optimize Database' in the admin panel to compress oversized images.");
            } else {
                alert("Failed to save changes: " + e.message);
            }
            throw e;
        });
  },

  async uploadImage(file, pathStr, onProgress, options = {}) {
      // 1. Client-Side Image Compression (shrinks 5MB photos down to ~30KB-80KB in 50ms)
      let compressed = null;
      try {
          compressed = await compressImage(file, {
              maxWidth: options.maxWidth || (pathStr === 'team' ? 400 : 1600),
              maxHeight: options.maxHeight || (pathStr === 'team' ? 400 : 1600),
              quality: options.quality || 0.75
          });
      } catch (compErr) {
          console.warn("Client compression skipped/failed:", compErr);
      }

      const fileToUpload = compressed ? compressed.file : file;
      const fallbackDataUrl = compressed ? compressed.dataUrl : null;

      // 2. Attempt Firebase Cloud Storage Upload
      return new Promise((resolve, reject) => {
          const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const fullPath = `${pathStr}/${fileName}`;
          const fileRef = storageRef(storage, fullPath);
          const uploadTask = uploadBytesResumable(fileRef, fileToUpload);

          // 15-second safety timeout so UI never hangs indefinitely at 0%
          const timeoutId = setTimeout(() => {
              uploadTask.cancel();
              const err = new Error("Firebase Storage upload timed out. The storage bucket may not be activated yet in Firebase Console.");
              err.code = 'STORAGE_TIMEOUT';
              err.fallbackDataUrl = fallbackDataUrl;
              reject(err);
          }, 15000);

          uploadTask.on(
              'state_changed',
              (snapshot) => {
                  if (snapshot.totalBytes > 0) {
                      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      if (onProgress) onProgress(progress);
                  }
              },
              (error) => {
                  clearTimeout(timeoutId);
                  console.error("Firebase Storage Upload Error:", error);

                  let readableMsg = error.message;
                  let errCode = error.code || 'storage/unknown';

                  if (errCode === 'storage/unknown' || error.message?.includes('unknown') || error.message?.includes('404')) {
                      readableMsg = "Cloud Storage bucket does not exist or has not been activated yet in Firebase Console. Go to Firebase Console -> Storage -> Click 'Get started'.";
                      errCode = 'BUCKET_NOT_FOUND';
                  } else if (errCode === 'storage/unauthorized') {
                      readableMsg = "Storage Security Rules rejected the upload. Go to Firebase Console -> Storage -> Rules and set: allow read, write: if true;";
                      errCode = 'PERMISSION_DENIED';
                  }

                  const enrichedErr = new Error(readableMsg);
                  enrichedErr.code = errCode;
                  enrichedErr.originalError = error;
                  enrichedErr.fallbackDataUrl = fallbackDataUrl;
                  reject(enrichedErr);
              },
              async () => {
                  clearTimeout(timeoutId);
                  try {
                      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                      if (onProgress) onProgress(100);
                      resolve(downloadURL);
                  } catch (urlErr) {
                      reject(urlErr);
                  }
              }
          );
      });
  },

  async optimizeContentStorage() {
      let count = 0;
      const originalBytes = JSON.stringify(this.content).length;

      const tryShrink = async (dataUrl, maxDim = 1200, quality = 0.7) => {
          if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
              return dataUrl;
          }
          if (dataUrl.length < 15000) return dataUrl; // already small
          try {
              const res = await compressImage(dataUrl, { maxWidth: maxDim, maxHeight: maxDim, quality });
              count++;
              return res.dataUrl;
          } catch (e) {
              return dataUrl;
          }
      };

      if (this.content.logoUrl) {
          this.content.logoUrl = await tryShrink(this.content.logoUrl, 300, 0.8);
      }
      if (this.content.posterUrl) {
          this.content.posterUrl = await tryShrink(this.content.posterUrl, 1200, 0.7);
      }
      if (Array.isArray(this.content.heroSlides)) {
          for (let s of this.content.heroSlides) {
              if (s && s.image) s.image = await tryShrink(s.image, 1200, 0.7);
          }
      }
      if (Array.isArray(this.content.team)) {
          for (let m of this.content.team) {
              if (m && m.imageUrl) m.imageUrl = await tryShrink(m.imageUrl, 300, 0.75);
          }
      }
      if (this.content.pageBackgrounds) {
          for (let k of Object.keys(this.content.pageBackgrounds)) {
              if (this.content.pageBackgrounds[k]) {
                  this.content.pageBackgrounds[k] = await tryShrink(this.content.pageBackgrounds[k], 1000, 0.65);
              }
          }
      }

      await this.saveContent();
      const newBytes = JSON.stringify(this.content).length;
      return {
          optimizedCount: count,
          freedKB: ((originalBytes - newBytes) / 1024).toFixed(1),
          newSizeKB: (newBytes / 1024).toFixed(1)
      };
  },

  async refreshDiagnostics() {
      const storageRes = await checkStorageStatus();
      this.storageHealth = storageRes;
      this.docSizeInfo = getDocSizeDetails(this.content);
      return { storage: storageRes, docSize: this.docSizeInfo };
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