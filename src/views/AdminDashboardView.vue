<script setup>
import confetti from 'canvas-confetti';
import { ref, watch, onMounted, computed } from 'vue';
import { getDocSizeDetails, checkStorageStatus, checkFirestoreExpiry } from '../utils/firebaseDiagnostics';
import { store } from '../store';
import { useRouter } from 'vue-router';

import AdminAnalytics from '../components/admin/AdminAnalytics.vue';
import AdminHeroEditor from '../components/admin/AdminHeroEditor.vue';
import AdminAboutEditor from '../components/admin/AdminAboutEditor.vue';
import AdminSocialsEditor from '../components/admin/AdminSocialsEditor.vue';
import AdminFileManager from '../components/admin/AdminFileManager.vue';

const router = useRouter();
if (!store.isAdmin) router.push('/');

const draftContent = ref(JSON.parse(JSON.stringify(store.content)));
const isLogsExpanded = ref(true);
const activeTab = ref('dashboard');
const showMobileMenu = ref(false);

const uploadingState = ref({});
const uploadProgress = ref({});
const storageHealth = ref(null);
const isCheckingStorage = ref(false);
const isOptimizing = ref(false);
const optimizeResult = ref(null);
const showStorageModal = ref(false);
const showFirestoreExpiryModal = ref(false);
const showUploadErrorModal = ref(false);
const uploadErrorData = ref(null);
const ruleCopied = ref(false);
const firestoreExpiry = ref(checkFirestoreExpiry());

const docSize = computed(() => getDocSizeDetails(draftContent.value || store.content));

const checkStorageNow = async () => {
    isCheckingStorage.value = true;
    storageHealth.value = await checkStorageStatus();
    isCheckingStorage.value = false;
};

onMounted(async () => {
    await checkStorageNow();
});

const applyImageUrl = (fieldName, url, isTeamMember, teamIndex) => {
    if (isTeamMember) {
        draftContent.value.team[teamIndex][fieldName] = url;
        saveSection(['team']);
    } else if (fieldName.includes('.')) {
        const [parent, child] = fieldName.split('.');
        draftContent.value[parent][child] = url;
        saveSection([parent]);
    } else {
        draftContent.value[fieldName] = url;
        saveSection(['countdownDate', 'posterUrl', 'logoUrl', 'phoneNumber']);
    }
};

const useFallbackImage = () => {
    if (!uploadErrorData.value?.fallbackDataUrl) return;
    const { fieldName, fallbackDataUrl, isTeamMember, teamIndex } = uploadErrorData.value;
    applyImageUrl(fieldName, fallbackDataUrl, isTeamMember, teamIndex);
    showUploadErrorModal.value = false;
    confetti({ particleCount: 70, spread: 60 });
};

const handleOptimizeDb = async () => {
    if (isOptimizing.value) return;
    isOptimizing.value = true;
    optimizeResult.value = null;
    try {
        const res = await store.optimizeContentStorage();
        draftContent.value = JSON.parse(JSON.stringify(store.content));
        optimizeResult.value = res;
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
        alert("Optimization error: " + err.message);
    } finally {
        isOptimizing.value = false;
    }
};

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        ruleCopied.value = true;
        setTimeout(() => { ruleCopied.value = false; }, 2500);
    } catch (e) {
        alert("Copied text:\n" + text);
    }
};
const handleImageUpload = async (event, fieldName, isTeamMember = false, teamIndex = null) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const uploadKey = isTeamMember ? `team_${teamIndex}` : fieldName;
    uploadingState.value = { ...uploadingState.value, [uploadKey]: true };
    uploadProgress.value = { ...uploadProgress.value, [uploadKey]: 0 };
    
    try {
        const url = await store.uploadImage(file, isTeamMember ? 'team' : 'uploads', (prog) => {
            uploadProgress.value = { ...uploadProgress.value, [uploadKey]: Math.round(prog) };
        });
        applyImageUrl(fieldName, url, isTeamMember, teamIndex);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (e) {
        console.error("Upload handler caught error:", e);
        uploadErrorData.value = {
            title: e.code === 'BUCKET_NOT_FOUND' ? 'Cloud Storage Bucket Not Activated' : (e.code === 'PERMISSION_DENIED' ? 'Storage Security Rules Denied' : 'Image Upload Failed'),
            message: e.message || 'Upload failed.',
            code: e.code || 'UNKNOWN',
            fieldName,
            isTeamMember,
            teamIndex,
            fallbackDataUrl: e.fallbackDataUrl
        };
        showUploadErrorModal.value = true;
    } finally {
        uploadingState.value = { ...uploadingState.value, [uploadKey]: false };
        uploadProgress.value = { ...uploadProgress.value, [uploadKey]: 0 };
        event.target.value = '';
    }
};

const showReportModal = ref(false);
const reportType = ref('daily');
const reportDate = ref(new Date().toISOString().slice(0, 10));

watch(() => store.isDataReady, (ready) => {
    if (ready) {
        draftContent.value = JSON.parse(JSON.stringify(store.content));
        if (!draftContent.value.heroSlides) draftContent.value.heroSlides = [];
        if (!draftContent.value.socialUpdates) draftContent.value.socialUpdates = [];
        if (!draftContent.value.about) draftContent.value.about = { title: '', text: '' };
        if (!draftContent.value.team) draftContent.value.team = [];
        if (!draftContent.value.pageBackgrounds) draftContent.value.pageBackgrounds = { insights: '', contact: '', careers: '', partners: '', services: '', about: '' };
        if (!draftContent.value.policies) draftContent.value.policies = 'By creating an account, you consent to participate in the AI Readiness in Education research study.\n\nEmail Usage: Your email address will be securely stored in our database. We will use it exclusively to notify you when the Main AI Readiness Assessment survey is available.\n\nData Privacy: All data collected is strictly confidential and will only be used for research purposes. We will not share your personal information with third parties.';
    }
}, { immediate: true });

// --- SMART SAVE LOGIC ---
const isDirty = computed(() => JSON.stringify(draftContent.value) !== JSON.stringify(store.content));

const isSectionDirty = (fields) => {
    return fields.some(field => JSON.stringify(draftContent.value[field]) !== JSON.stringify(store.content[field]));
};

const saveSection = (fields) => {
    fields.forEach(field => {
        store.content[field] = JSON.parse(JSON.stringify(draftContent.value[field]));
    });
    store.saveContent();
    store.trackActivity("CMS Update", `Admin saved sections: ${fields.join(', ')}`);
};

const addTeamMember = () => {
    if (!draftContent.value.team) draftContent.value.team = [];
    draftContent.value.team = [
        ...draftContent.value.team, 
        { name: 'New Member', role: 'Role', location: 'Location', description: '', imageUrl: '' }
    ];
};

const addHeroSlide = () => {
    if (!draftContent.value.heroSlides) draftContent.value.heroSlides = [];
    draftContent.value.heroSlides = [
        ...draftContent.value.heroSlides,
        { id: Date.now(), image: 'https://images.unsplash.com/photo-1497366216548-37526070297c', title: 'New Headline', subtitle: 'New Subtitle' }
    ];
};

const removeHeroSlide = (index) => {
    const newSlides = [...draftContent.value.heroSlides];
    newSlides.splice(index, 1);
    draftContent.value.heroSlides = newSlides;
};

const addSocialPost = () => {
    if (!draftContent.value.socialUpdates) draftContent.value.socialUpdates = [];
    draftContent.value.socialUpdates = [
        { id: Date.now(), platform: 'LinkedIn', date: new Date().toISOString(), text: 'New update...', link: '#' },
        ...draftContent.value.socialUpdates
    ];
};

const removeSocialPost = (index) => {
    const newUpdates = [...draftContent.value.socialUpdates];
    newUpdates.splice(index, 1);
    draftContent.value.socialUpdates = newUpdates;
};

const publishChanges = async () => {
    store.content = JSON.parse(JSON.stringify(draftContent.value));
    
    try {
        await store.saveContent();
        store.trackActivity("CMS Update", "Admin published global content changes");
        alert("✅ All Changes Published Live!");
    } catch (error) {
        if (error.code === 'permission-denied' || error.message.includes('not been used') || error.message.includes('PERMISSION_DENIED')) {
            alert("❌ FAILED TO SAVE: Cloud Firestore is NOT enabled in your Firebase project! Please go to your Firebase Console, click 'Firestore Database' on the left menu, and click 'Create Database' to enable it. Once created, your changes will sync properly.");
        } else {
            alert("❌ FAILED TO SAVE: " + error.message);
        }
    }
};

const discardChanges = () => {
    if(confirm("Discard all unsaved changes?")) draftContent.value = JSON.parse(JSON.stringify(store.content));
};

const goToFirestore = () => window.open('https://console.firebase.google.com/', '_blank');

const openReportModal = () => { showReportModal.value = true; };
const closeReportModal = () => { showReportModal.value = false; };

const generateReport = () => {
    const selected = new Date(reportDate.value);
    let filteredLogs = [];
    let filename = "Report.csv";

    const getLogDate = (log) => {
        if (log.timestamp && log.timestamp.seconds) return new Date(log.timestamp.seconds * 1000);
        if (log.rawDate) return new Date(log.rawDate);
        return new Date();
    };

    if (reportType.value === 'daily') {
        filename = `Daily_Report_${reportDate.value}.csv`;
        filteredLogs = store.activityLogs.filter(log => {
            const d = getLogDate(log);
            return d.toISOString().slice(0, 10) === reportDate.value;
        });
    } else if (reportType.value === 'weekly') {
        filename = `Weekly_Report_${reportDate.value}.csv`;
        const start = new Date(reportDate.value);
        const end = new Date(start);
        end.setDate(start.getDate() + 7);
        filteredLogs = store.activityLogs.filter(log => {
            const d = getLogDate(log);
            return d >= start && d <= end;
        });
    } else if (reportType.value === 'monthly') {
        filename = `Monthly_Report_${reportDate.value}.csv`;
        const [year, month] = reportDate.value.split('-');
        filteredLogs = store.activityLogs.filter(log => {
            const d = getLogDate(log);
            return d.getFullYear() === parseInt(year) && (d.getMonth() + 1) === parseInt(month);
        });
    }

    if (filteredLogs.length === 0) {
        alert("No records found for this period.");
        return;
    }

    const headers = ["Time", "User", "Role", "Action", "Details"];
    const rows = filteredLogs.map(log => [
        `"${log.time}"`, `"${log.userName}"`, `"${log.userRole}"`, `"${log.action}"`, `"${log.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    closeReportModal();
};
</script>

<template>
  <main class="admin-page py-5 mt-5 bg-light min-vh-100">
    <div class="container py-4 mt-4">
      
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 border-bottom pb-4 gap-4">
          <div class="text-center text-md-start">
              <h6 class="text-gold fw-bold ls-2 small text-uppercase mb-1">Management Console</h6>
              <h1 class="display-5 fw-bold text-navy mb-0">Administration</h1>
          </div>
          <div class="d-flex flex-wrap gap-3 justify-content-center">
              <button @click="goToFirestore" class="btn btn-white border shadow-sm btn-sm px-3 py-2 rounded-0 d-flex align-items-center gap-2 text-navy fw-bold hover-lift">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                  <span>Database</span>
              </button>
              <button @click="openReportModal" class="btn btn-white border shadow-sm btn-sm px-3 py-2 rounded-0 d-flex align-items-center gap-2 text-navy fw-bold hover-lift">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>Export Reports</span>
              </button>
              <div class="vr mx-2 text-muted opacity-25 d-none d-md-block"></div>
              
              <transition name="fade">
                  <div v-if="isDirty" class="d-flex gap-3">
                      <button @click="discardChanges" class="btn btn-outline-danger rounded-0 px-4 btn-sm d-flex align-items-center gap-2 fw-bold hover-lift">Discard</button>
                      <button @click="publishChanges" class="btn btn-navy rounded-0 fw-bold px-4 py-2 d-flex align-items-center gap-2 shadow-sm hover-lift pulse-btn">Publish All Changes</button>
                  </div>
              </transition>
          </div>
      </div>

      
      <!-- FIRESTORE EXPIRATION ALERT BANNER -->
      <div v-if="firestoreExpiry.isExpiringSoon || firestoreExpiry.isExpired" class="alert alert-warning border-0 rounded-0 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-center p-3 mb-4 gap-3">
          <div class="d-flex align-items-center gap-3">
              <span class="fs-3">⚠️</span>
              <div>
                  <strong class="text-dark">Firebase Firestore Action Needed:</strong> 
                  Your database 30-Day Test Mode rules expire on <span class="badge bg-dark rounded-0">{{ firestoreExpiry.expiryDate }}</span> (in {{ firestoreExpiry.daysLeft }} day{{ firestoreExpiry.daysLeft === 1 ? '' : 's' }}). Update rules to avoid client access lockout.
              </div>
          </div>
          <button @click="showFirestoreExpiryModal = true" class="btn btn-navy btn-sm rounded-0 fw-bold px-3 py-2 text-nowrap">
              View 1-Step Fix Guide
          </button>
      </div>

      <!-- SYSTEM STORAGE & CLOUD HEALTH PANEL -->
      <div class="row g-3 mb-4">
          <!-- CARD 1: FIRESTORE DOCUMENT SIZE -->
          <div class="col-md-6">
              <div class="card border-0 shadow-sm p-4 bg-white rounded-0 h-100 position-relative">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                      <div>
                          <h6 class="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="text-gold"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                              Database Storage (Firestore Document)
                          </h6>
                          <small class="text-muted">Strict limit: 1,024 KB per document</small>
                      </div>
                      <span class="badge rounded-0 px-2 py-1 fw-bold" :class="docSize.badgeClass">
                          {{ docSize.percentUsed }}% Used
                      </span>
                  </div>

                  <div class="progress rounded-0 my-2" style="height: 10px;">
                      <div class="progress-bar" :class="docSize.percentUsed > 85 ? 'bg-danger' : (docSize.percentUsed > 65 ? 'bg-warning' : 'bg-success')" :style="{ width: docSize.percentUsed + '%' }"></div>
                  </div>

                  <div class="d-flex justify-content-between small text-muted mb-3">
                      <span><strong>{{ docSize.sizeKB }} KB</strong> used</span>
                      <span><strong>{{ docSize.remainingKB }} KB</strong> remaining</span>
                  </div>

                  <div v-if="optimizeResult" class="alert alert-success py-2 px-3 small rounded-0 mb-3">
                      ✅ Freed <strong>{{ optimizeResult.freedKB }} KB</strong>! Current size is now <strong>{{ optimizeResult.newSizeKB }} KB</strong>.
                  </div>

                  <div class="d-flex gap-2 mt-auto">
                      <button @click="handleOptimizeDb" class="btn btn-outline-primary btn-sm rounded-0 fw-bold d-flex align-items-center gap-1" :disabled="isOptimizing">
                          <span v-if="isOptimizing" class="spinner-border spinner-border-sm me-1"></span>
                          <span>{{ isOptimizing ? 'Optimizing...' : '⚡ Optimize Database (Free Up Space)' }}</span>
                      </button>
                  </div>
              </div>
          </div>

          <!-- CARD 2: FIREBASE CLOUD STORAGE -->
          <div class="col-md-6">
              <div class="card border-0 shadow-sm p-4 bg-white rounded-0 h-100 position-relative">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                      <div>
                          <h6 class="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="text-gold"><path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                              Image Vault (Firebase Cloud Storage)
                          </h6>
                          <small class="text-muted">Dedicated storage for photos, posters & backgrounds</small>
                      </div>
                      <span v-if="storageHealth" class="badge rounded-0 px-2 py-1 fw-bold" :class="storageHealth.badgeClass">
                          {{ storageHealth.badge }}
                      </span>
                      <span v-else class="badge bg-secondary rounded-0 px-2 py-1">Checking...</span>
                  </div>

                  <p class="small text-muted my-2">
                      <span v-if="storageHealth?.status === 'OK' || storageHealth?.status === 'BUCKET_EXISTS'" class="text-success fw-bold">
                          ● Connected: Images upload directly to Google Cloud Storage.
                      </span>
                      <span v-else-if="storageHealth?.status === 'NOT_FOUND'" class="text-danger fw-bold">
                          ⚠ Storage bucket is not created yet in Google Cloud. Click "Setup Guide" below.
                      </span>
                      <span v-else class="text-muted">
                          Checking Firebase Cloud Storage connection...
                      </span>
                  </p>

                  <div class="d-flex gap-2 mt-auto">
                      <button @click="showStorageModal = true" class="btn btn-navy btn-sm rounded-0 fw-bold">
                          📖 Storage Setup & Rules Guide
                      </button>
                      <button @click="checkStorageNow" class="btn btn-light border btn-sm rounded-0 fw-bold" :disabled="isCheckingStorage">
                          <span v-if="isCheckingStorage" class="spinner-border spinner-border-sm me-1"></span>
                          <span>{{ isCheckingStorage ? 'Checking...' : '🔄 Check Status' }}</span>
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <!-- MOBILE SIDEBAR TOGGLE -->
      <div class="d-lg-none mb-4">
          <button @click="showMobileMenu = true" class="btn btn-navy w-100 fw-bold rounded-0 p-3 shadow">☰ Open Admin Menu</button>
      </div>

      <div class="row g-4">
          <!-- DESKTOP SIDEBAR -->
          <div class="col-lg-3 d-none d-lg-block">
              <div class="list-group shadow-sm rounded-0 border-0 sticky-top" style="top: 100px;">
                  <button @click="activeTab='dashboard'" :class="['list-group-item list-group-item-action fw-bold py-3 border-0 transition-all', activeTab==='dashboard'?'active bg-navy text-white':'text-navy']"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16"><path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z"/></svg>Dashboard & Analytics</button>
                  <button @click="activeTab='settings'" :class="['list-group-item list-group-item-action fw-bold py-3 border-0 transition-all', activeTab==='settings'?'active bg-navy text-white':'text-navy']"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>Global Settings</button>
                  <button @click="activeTab='assets'" :class="['list-group-item list-group-item-action fw-bold py-3 border-0 transition-all', activeTab==='assets'?'active bg-navy text-white':'text-navy']"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16"><path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07zM8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>Page Assets</button>
                  <button @click="activeTab='team'" :class="['list-group-item list-group-item-action fw-bold py-3 border-0 transition-all', activeTab==='team'?'active bg-navy text-white':'text-navy']"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H3zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>Team Management</button>
                  <button @click="activeTab='media'" :class="['list-group-item list-group-item-action fw-bold py-3 border-0 transition-all', activeTab==='media'?'active bg-navy text-white':'text-navy']"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16"><path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/></svg>Media & Socials</button>
              </div>
          </div>

          <!-- MAIN CONTENT -->
          <div class="col-lg-9">
              <div v-show="activeTab==='dashboard'">
                  <div class="card border-0 shadow-sm p-4 bg-white mb-5 rounded-0">
          <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold text-navy mb-0 d-flex align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="text-gold"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  Activity Intelligence
              </h5>
              <button @click="isLogsExpanded = !isLogsExpanded" class="btn btn-sm btn-light rounded-0 px-4 border fw-bold text-navy transition-all">
                  {{ isLogsExpanded ? 'Collapse' : 'Expand' }}
              </button>
          </div>
          <div v-if="isLogsExpanded" class="fade-in">
              <AdminAnalytics :logs="store.activityLogs" />
              
              <div class="table-responsive border rounded-0 mt-4" style="max-height: 350px; overflow-y: auto;">
                  <table class="table table-hover align-middle mb-0">
                      <thead class="bg-light sticky-top">
                          <tr>
                              <th class="ps-4 text-navy small fw-bold text-uppercase">Time</th>
                              <th class="text-navy small fw-bold text-uppercase">User</th>
                              <th class="text-navy small fw-bold text-uppercase">Role</th>
                              <th class="text-navy small fw-bold text-uppercase">Action</th>
                              <th class="text-navy small fw-bold text-uppercase">Details</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="log in store.activityLogs" :key="log.id">
                              <td class="small text-muted ps-4 text-nowrap">{{ log.time }}</td>
                              <td class="fw-bold small text-navy">{{ log.userName }}</td>
                              <td><span class="badge bg-light text-dark border px-2 py-1">{{ log.userRole }}</span></td>
                              <td><span class="badge bg-gold text-navy fw-bold px-2 py-1">{{ log.action }}</span></td>
                              <td class="small text-muted text-truncate" style="max-width: 250px;">{{ log.details }}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
              </div>

              <div v-show="activeTab==='settings'">
                  <!-- SURVEY & PROJECT SETTINGS -->
      <div class="card border-0 shadow-sm p-4 bg-white mb-5 rounded-0 position-relative">
          <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold text-navy mb-0 d-flex align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="text-gold" viewBox="0 0 16 16"><path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z"/><path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1"/></svg>
                  Project & Survey Settings
              </h5>
              <transition name="fade">
                  <button v-if="isSectionDirty(['countdownDate', 'posterUrl', 'logoUrl', 'phoneNumber'])" @click="saveSection(['countdownDate', 'posterUrl', 'logoUrl', 'phoneNumber'])" class="btn btn-sm btn-success fw-bold px-3 rounded-0">Save Settings</button>
              </transition>
          </div>
          <div class="row g-4">
              <div class="col-md-3">
                  <label class="form-label small fw-bold text-muted text-uppercase ls-1">Main Survey Date</label>
                  <input type="datetime-local" v-model="draftContent.countdownDate" class="form-control bg-light border-0 py-3">
              </div>
              <div class="col-md-3">
                  <label class="form-label small fw-bold text-muted text-uppercase ls-1">Poster Image URL</label>
                  <div class="d-flex gap-2">
                      <div v-if="draftContent.posterUrl" class="border rounded-0 shadow-sm overflow-hidden flex-shrink-0" style="width: 48px; height: 48px;">
                          <img :src="draftContent.posterUrl" class="w-100 h-100 object-fit-cover" alt="Preview">
                      </div>
                      <div class="input-group">
                          <input type="url" v-model="draftContent.posterUrl" class="form-control bg-light border-0 py-3" placeholder="https://example.com/poster.jpg">
                          <input type="file" @change="e => handleImageUpload(e, 'posterUrl')" class="d-none" id="posterUpload" accept="image/*">
                          <label for="posterUpload" class="input-group-text bg-white cursor-pointer fw-bold px-3 position-relative overflow-hidden">
                              <div v-if="uploadingState.posterUrl" class="position-absolute top-0 start-0 h-100 bg-success opacity-25" :style="{ width: uploadProgress.posterUrl + '%' }"></div>
                              <span v-if="uploadingState.posterUrl" class="position-relative z-2 small">{{ uploadProgress.posterUrl }}%</span>
                              <span v-else>Upload</span>
                          </label>
                      </div>
                  </div>
              </div>
              <div class="col-md-3">
                  <label class="form-label small fw-bold text-muted text-uppercase ls-1">Project Logo URL</label>
                  <div class="d-flex gap-2">
                      <div v-if="draftContent.logoUrl" class="border rounded-0 shadow-sm overflow-hidden flex-shrink-0" style="width: 48px; height: 48px;">
                          <img :src="draftContent.logoUrl" class="w-100 h-100 object-fit-cover" alt="Preview">
                      </div>
                      <div class="input-group">
                          <input type="url" v-model="draftContent.logoUrl" class="form-control bg-light border-0 py-3" placeholder="https://example.com/logo.jpg">
                          <input type="file" @change="e => handleImageUpload(e, 'logoUrl')" class="d-none" id="logoUpload" accept="image/*">
                          <label for="logoUpload" class="input-group-text bg-white cursor-pointer fw-bold px-3 position-relative overflow-hidden">
                              <div v-if="uploadingState.logoUrl" class="position-absolute top-0 start-0 h-100 bg-success opacity-25" :style="{ width: uploadProgress.logoUrl + '%' }"></div>
                              <span v-if="uploadingState.logoUrl" class="position-relative z-2 small">{{ uploadProgress.logoUrl }}%</span>
                              <span v-else>Upload</span>
                          </label>
                      </div>
                  </div>
              </div>
              <div class="col-md-3">
                  <label class="form-label small fw-bold text-muted text-uppercase ls-1">Phone Number</label>
                  <input type="text" v-model="draftContent.phoneNumber" class="form-control bg-light border-0 py-3" placeholder="+254700000000">
              </div>
          </div>
      </div>
                  <!-- MISSION & VISION SETTINGS -->
      <div class="card border-0 shadow-sm p-4 bg-white mb-5 rounded-0">
          <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold text-navy mb-0 d-flex align-items-center gap-2">Mission & Vision</h5>
              <transition name="fade">
                  <button v-if="isSectionDirty(['mission', 'vision'])" @click="saveSection(['mission', 'vision'])" class="btn btn-sm btn-success fw-bold px-3 rounded-0">Save Statements</button>
              </transition>
          </div>
          <div class="row g-4">
              <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted text-uppercase ls-1">Mission Statement</label>
                  <RichTextEditor v-model="draftContent.mission" />
              </div>
              <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted text-uppercase ls-1">Vision Statement</label>
                  <RichTextEditor v-model="draftContent.vision" />
              </div>
          </div>
      </div>
                  <!-- POLICY SETTINGS -->
      <div class="card border-0 shadow-sm p-4 bg-white mb-5 rounded-0">
          <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold text-navy mb-0 d-flex align-items-center gap-2">Privacy & Consent Policy</h5>
              <transition name="fade">
                  <button v-if="isSectionDirty(['policies'])" @click="saveSection(['policies'])" class="btn btn-sm btn-success fw-bold px-3 rounded-0">Save Policy</button>
              </transition>
          </div>
          <div class="row">
              <div class="col-12">
                  <label class="form-label small fw-bold text-muted text-uppercase ls-1">Consent Policy Text</label>
                  <RichTextEditor v-model="draftContent.policies" />
              </div>
          </div>
      </div>
              </div>

              <div v-show="activeTab==='assets'">
                  <!-- PAGE BACKGROUNDS -->
      <div class="card border-0 shadow-sm p-4 bg-white mb-5 rounded-0 position-relative">
          <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold text-navy mb-0 d-flex align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="text-gold" viewBox="0 0 16 16"><path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"/></svg>
                  Global Page Backgrounds
              </h5>
              <transition name="fade">
                  <button v-if="isSectionDirty(['pageBackgrounds'])" @click="saveSection(['pageBackgrounds'])" class="btn btn-sm btn-success fw-bold px-3 rounded-0">Save Backgrounds</button>
              </transition>
          </div>
          <div class="row g-4" v-if="draftContent.pageBackgrounds">
              <div class="col-md-4" v-for="(bgLabel, bgKey) in { insights: 'Insights', contact: 'Contact Us', careers: 'Careers', partners: 'Partners', services: 'Services', about: 'About Us', focus_job: 'Focus: Job Market', focus_curriculum: 'Focus: Curriculum', focus_tools: 'Focus: AI Tools' }" :key="bgKey">
                  <label class="form-label small fw-bold text-muted text-uppercase ls-1">{{ bgLabel }} Hero Image</label>
                  <div class="d-flex gap-2">
                      <div v-if="draftContent.pageBackgrounds[bgKey]" class="border rounded-0 shadow-sm overflow-hidden flex-shrink-0" style="width: 48px; height: 48px;">
                          <img :src="draftContent.pageBackgrounds[bgKey]" class="w-100 h-100 object-fit-cover" alt="Preview">
                      </div>
                      <div class="input-group">
                          <input type="url" v-model="draftContent.pageBackgrounds[bgKey]" class="form-control bg-light border-0 py-3" placeholder="Image URL">
                          <input type="file" @change="e => handleImageUpload(e, 'pageBackgrounds.'+bgKey)" class="d-none" :id="'bgUpload_'+bgKey" accept="image/*">
                          <label :for="'bgUpload_'+bgKey" class="input-group-text bg-white cursor-pointer fw-bold px-3 position-relative overflow-hidden">
                              <div v-if="uploadingState['pageBackgrounds.'+bgKey]" class="position-absolute top-0 start-0 h-100 bg-success opacity-25" :style="{ width: uploadProgress['pageBackgrounds.'+bgKey] + '%' }"></div>
                              <span v-if="uploadingState['pageBackgrounds.'+bgKey]" class="position-relative z-2 small">{{ uploadProgress['pageBackgrounds.'+bgKey] }}%</span>
                              <span v-else>Upload</span>
                          </label>
                      </div>
                  </div>
              </div>
          </div>
      </div>
                  <div class="position-relative mb-5">
          <div class="d-flex justify-content-end mb-2">
              <transition name="fade">
                  <button v-if="isSectionDirty(['heroSlides'])" @click="saveSection(['heroSlides'])" class="btn btn-sm btn-success fw-bold px-3 rounded-0" style="z-index: 10;">Save Slider</button>
              </transition>
          </div>
          <AdminHeroEditor 
              :slides="draftContent.heroSlides" 
              @addSlide="addHeroSlide" 
              @removeSlide="removeHeroSlide" 
          />
      </div>
                  <div class="row g-4 mb-5">
          <div class="col-12 position-relative">
              <div class="d-flex justify-content-end position-absolute top-0 end-0 m-3" style="z-index: 10;">
                  <transition name="fade">
                      <button v-if="isSectionDirty(['about'])" @click="saveSection(['about'])" class="btn btn-sm btn-success fw-bold px-3 rounded-0">Save About</button>
                  </transition>
              </div>
              <AdminAboutEditor :aboutData="draftContent.about" />
          </div>
          
      </div>
              </div>

              <div v-show="activeTab==='team'">
                  <!-- TEAM SETTINGS -->
      <div class="card border-0 shadow-sm p-4 bg-white mb-5 rounded-0">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-navy mb-0">Team Members</h5>
            <div class="d-flex gap-2">
                <transition name="fade">
                    <button v-if="isSectionDirty(['team'])" @click="saveSection(['team'])" class="btn btn-sm btn-success fw-bold px-3 rounded-0">Save Team</button>
                </transition>
                <button @click="addTeamMember" class="btn btn-sm btn-navy rounded-0 px-3 fw-bold">+ Add Member</button>
            </div>
          </div>
          <div class="row g-4">
              <div v-for="(member, idx) in draftContent.team" :key="idx" class="col-md-6">
                  <div class="p-4 bg-light border rounded-0 position-relative">
                      <button @click="draftContent.team.splice(idx, 1)" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-0 fw-bold" style="width:28px;height:28px;padding:0;">&times;</button>
                      <input type="text" v-model="member.name" class="form-control mb-2 fw-bold" placeholder="Name">
                      <input type="text" v-model="member.role" class="form-control mb-2" placeholder="Role">
                      
                      <div class="d-flex gap-2 mb-2">
                          <div v-if="member.imageUrl" class="border rounded-0 shadow-sm overflow-hidden flex-shrink-0" style="width: 48px; height: 48px;">
                              <img :src="member.imageUrl" class="w-100 h-100 object-fit-cover" alt="Preview">
                          </div>
                          <div class="input-group">
                              <input type="url" v-model="member.imageUrl" class="form-control" placeholder="Image URL">
                              <input type="file" @change="e => handleImageUpload(e, 'imageUrl', true, idx)" class="d-none" :id="'teamUpload_'+idx" accept="image/*">
                              <label :for="'teamUpload_'+idx" class="input-group-text bg-white cursor-pointer fw-bold px-3 m-0 position-relative overflow-hidden">
                                  <div v-if="uploadingState['team_'+idx]" class="position-absolute top-0 start-0 h-100 bg-success opacity-25" :style="{ width: uploadProgress['team_'+idx] + '%' }"></div>
                                  <span v-if="uploadingState['team_'+idx]" class="position-relative z-2 small">{{ uploadProgress['team_'+idx] }}%</span>
                                  <span v-else>Upload</span>
                              </label>
                          </div>
                      </div>

                      <RichTextEditor v-model="member.description" />
                  </div>
              </div>
          </div>
      </div>
              </div>

              <div v-show="activeTab==='media'">
                  <div class="row g-4 mb-5">
          <div class="col-12 position-relative">
              <div class="d-flex justify-content-end position-absolute top-0 end-0 m-3" style="z-index: 10;">
                  <transition name="fade">
                      <button v-if="isSectionDirty(['socialUpdates'])" @click="saveSection(['socialUpdates'])" class="btn btn-sm btn-success fw-bold px-3 rounded-0">Save Socials</button>
                  </transition>
              </div>
              <AdminSocialsEditor 
                  :socials="draftContent.socialUpdates" 
                  @addSocialPost="addSocialPost" 
                  @removeSocialPost="removeSocialPost" 
              />
          </div>
      </div>
                  <AdminFileManager />
              </div>
          </div>
      </div>

    </div>

    <div v-if="showReportModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center">
        <div class="bg-white p-5 rounded-0 shadow-lg border" style="width: 450px; max-width: 90%;">
            <h4 class="fw-bold text-navy mb-4 text-center">Export Records</h4>
            <div class="mb-4">
                <label class="small text-muted fw-bold mb-2 text-uppercase">Report Type</label>
                <select v-model="reportType" class="form-select form-select-lg bg-light border-0 fs-6">
                    <option value="daily">Daily Report</option>
                    <option value="weekly">Weekly Report</option>
                    <option value="monthly">Monthly Report</option>
                </select>
            </div>
            <div class="mb-5">
                <label class="small text-muted fw-bold mb-2 text-uppercase">Select Period</label>
                <input v-if="reportType === 'daily' || reportType === 'weekly'" type="date" v-model="reportDate" class="form-control form-control-lg bg-light border-0 fs-6">
                <input v-else type="month" v-model="reportDate" class="form-control form-control-lg bg-light border-0 fs-6">
            </div>
            <div class="d-flex gap-3">
                <button @click="closeReportModal" class="btn btn-light border w-50 py-3 fw-bold rounded-0">Cancel</button>
                <button @click="generateReport" class="btn btn-navy w-50 py-3 fw-bold rounded-0 shadow-sm">Download CSV</button>
            </div>
        </div>
    </div>

  
    <!-- MOBILE OFFCANVAS MENU -->
    <div class="admin-mobile-sidebar" :class="{ 'open': showMobileMenu }">
        <div class="p-4 bg-navy text-white d-flex justify-content-between align-items-center">
            <h5 class="fw-bold m-0">Admin Menu</h5>
            <button @click="showMobileMenu = false" class="btn-close btn-close-white"></button>
        </div>
        <div class="list-group list-group-flush mt-2">
            <button @click="activeTab='dashboard'; showMobileMenu=false" :class="['list-group-item list-group-item-action fw-bold py-4 border-0', activeTab==='dashboard'?'bg-light text-navy border-start border-4 border-navy':'text-muted']"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16"><path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z"/></svg>Dashboard & Analytics</button>
            <button @click="activeTab='settings'; showMobileMenu=false" :class="['list-group-item list-group-item-action fw-bold py-4 border-0', activeTab==='settings'?'bg-light text-navy border-start border-4 border-navy':'text-muted']"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>Global Settings</button>
            <button @click="activeTab='assets'; showMobileMenu=false" :class="['list-group-item list-group-item-action fw-bold py-4 border-0', activeTab==='assets'?'bg-light text-navy border-start border-4 border-navy':'text-muted']"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16"><path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07zM8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>Page Assets</button>
            <button @click="activeTab='team'; showMobileMenu=false" :class="['list-group-item list-group-item-action fw-bold py-4 border-0', activeTab==='team'?'bg-light text-navy border-start border-4 border-navy':'text-muted']"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H3zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>Team Management</button>
            <button @click="activeTab='media'; showMobileMenu=false" :class="['list-group-item list-group-item-action fw-bold py-4 border-0', activeTab==='media'?'bg-light text-navy border-start border-4 border-navy':'text-muted']"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16"><path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/></svg>Media & Socials</button>
        </div>
    </div>
    <div v-if="showMobileMenu" class="sidebar-overlay fade-in" @click="showMobileMenu = false"></div>

  
    <!-- UPLOAD ERROR & FALLBACK MODAL -->
    <div v-if="showUploadErrorModal && uploadErrorData" class="modal-backdrop-custom d-flex align-items-center justify-content-center">
        <div class="bg-white p-4 p-md-5 rounded-0 shadow-lg border" style="width: 580px; max-width: 95%;">
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h5 class="fw-bold text-navy mb-0 d-flex align-items-center gap-2">
                    <span class="text-danger">⚠️</span> {{ uploadErrorData.title }}
                </h5>
                <button @click="showUploadErrorModal = false" class="btn-close"></button>
            </div>

            <div class="alert alert-danger py-2 px-3 small rounded-0 mb-3">
                <strong>Why this happened:</strong> {{ uploadErrorData.message }}
            </div>

            <div v-if="uploadErrorData.code === 'BUCKET_NOT_FOUND'" class="mb-4">
                <h6 class="fw-bold text-navy small text-uppercase">How to fix in Firebase Console (30 seconds):</h6>
                <ol class="small text-muted ps-3 mb-3">
                    <li class="mb-1">Go to <a href="https://console.firebase.google.com/project/ai-readiness-b3883/storage" target="_blank" class="fw-bold text-navy">Firebase Console -> Storage</a>.</li>
                    <li class="mb-1">Click the <strong>"Get started"</strong> button (Accept default settings and click Done).</li>
                    <li class="mb-1">Click the <strong>"Rules"</strong> tab and paste:</li>
                </ol>
                <div class="bg-light p-2 border rounded-0 font-monospace small position-relative mb-2">
                    <code>rules_version = '2';<br>service firebase.storage {<br>&nbsp;&nbsp;match /b/{bucket}/o {<br>&nbsp;&nbsp;&nbsp;&nbsp;match /{allPaths=**} {<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read, write: if true;<br>&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;}<br>}</code>
                </div>
            </div>

            <div v-else-if="uploadErrorData.code === 'PERMISSION_DENIED'" class="mb-4">
                <h6 class="fw-bold text-navy small text-uppercase">How to fix Storage Rules:</h6>
                <p class="small text-muted mb-2">Your Cloud Storage rules currently deny write access. Open Firebase Console -> Storage -> Rules, set <code>allow read, write: if true;</code>, and click Publish.</p>
            </div>

            <div class="d-flex flex-wrap gap-2 justify-content-end pt-3 border-top">
                <button v-if="uploadErrorData.fallbackDataUrl" @click="useFallbackImage" class="btn btn-navy rounded-0 fw-bold px-3 py-2">
                    ⚡ Use Compressed Image Now (Fallback)
                </button>
                <a href="https://console.firebase.google.com/project/ai-readiness-b3883/storage" target="_blank" class="btn btn-outline-primary rounded-0 fw-bold px-3 py-2">
                    Open Storage in Firebase
                </a>
                <button @click="showUploadErrorModal = false" class="btn btn-light border rounded-0 px-3 py-2">
                    Close
                </button>
            </div>
        </div>
    </div>

    <!-- FIREBASE STORAGE SETUP GUIDE MODAL -->
    <div v-if="showStorageModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center">
        <div class="bg-white p-4 p-md-5 rounded-0 shadow-lg border" style="width: 600px; max-width: 95%;">
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h5 class="fw-bold text-navy mb-0">Firebase Cloud Storage Setup Guide</h5>
                <button @click="showStorageModal = false" class="btn-close"></button>
            </div>

            <p class="small text-muted mb-3">
                Cloud Storage hosts all image uploads (posters, slides, team photos) without using up your Firestore 1MB document limit.
            </p>

            <h6 class="fw-bold text-navy small text-uppercase mb-2">3 Simple Steps to Activate Storage:</h6>
            <ol class="small text-muted ps-3 mb-3">
                <li class="mb-2">Open <a href="https://console.firebase.google.com/project/ai-readiness-b3883/storage" target="_blank" class="fw-bold text-navy">Firebase Console Storage</a>.</li>
                <li class="mb-2">If you see a <strong>"Get started"</strong> button, click it and click Done to create your bucket.</li>
                <li class="mb-2">Click the <strong>"Rules"</strong> tab at the top, replace the rules with the code below, and click <strong>"Publish"</strong>:</li>
            </ol>

            <div class="bg-dark text-white p-3 rounded-0 font-monospace small mb-3 position-relative">
                <pre class="m-0"><code>rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}</code></pre>
                <button @click="copyToClipboard(`rules_version = '2';\nservice firebase.storage {\n  match /b/{bucket}/o {\n    match /{allPaths=**} {\n      allow read, write: if true;\n    }\n  }\n}`)" class="btn btn-sm btn-outline-light rounded-0 position-absolute top-0 end-0 m-2">
                    {{ ruleCopied ? '✓ Copied!' : 'Copy Rule' }}
                </button>
            </div>

            <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                <a href="https://console.firebase.google.com/project/ai-readiness-b3883/storage" target="_blank" class="btn btn-navy rounded-0 fw-bold px-3 py-2">
                    Open Firebase Storage Console
                </a>
                <button @click="showStorageModal = false" class="btn btn-light border rounded-0 px-3 py-2">
                    Done
                </button>
            </div>
        </div>
    </div>

    <!-- FIRESTORE EXPIRATION 1-STEP FIX MODAL -->
    <div v-if="showFirestoreExpiryModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center">
        <div class="bg-white p-4 p-md-5 rounded-0 shadow-lg border" style="width: 600px; max-width: 95%;">
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h5 class="fw-bold text-navy mb-0">Firestore Database Expiration (Email Fix)</h5>
                <button @click="showFirestoreExpiryModal = false" class="btn-close"></button>
            </div>

            <div class="alert alert-info py-2 px-3 small rounded-0 mb-3">
                <strong>Why did you receive this email from Firebase?</strong><br>
                When you created your Firestore database in September, it was in 30-Day "Test Mode" expiring on <strong>October 24, 2026</strong>. In {{ firestoreExpiry.daysLeft }} day(s), Firebase will lock all requests unless you update the rules.
            </div>

            <h6 class="fw-bold text-navy small text-uppercase mb-2">How to update Firestore Rules:</h6>
            <ol class="small text-muted ps-3 mb-3">
                <li class="mb-2">Open <a href="https://console.firebase.google.com/project/ai-readiness-b3883/firestore/databases/-default-/security/rules" target="_blank" class="fw-bold text-navy">Firebase Console -> Firestore Database -> Rules</a>.</li>
                <li class="mb-2">Replace whatever is in the editor with this permanent rule:</li>
            </ol>

            <div class="bg-dark text-white p-3 rounded-0 font-monospace small mb-3 position-relative">
                <pre class="m-0"><code>rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}</code></pre>
                <button @click="copyToClipboard(`rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}`)" class="btn btn-sm btn-outline-light rounded-0 position-absolute top-0 end-0 m-2">
                    {{ ruleCopied ? '✓ Copied!' : 'Copy Rule' }}
                </button>
            </div>

            <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                <a href="https://console.firebase.google.com/project/ai-readiness-b3883/firestore/databases/-default-/security/rules" target="_blank" class="btn btn-navy rounded-0 fw-bold px-3 py-2">
                    Open Firestore Rules in Firebase
                </a>
                <button @click="showFirestoreExpiryModal = false" class="btn btn-light border rounded-0 px-3 py-2">
                    Done
                </button>
            </div>
        </div>
    </div>

  </main>
</template>

<style scoped>

.admin-mobile-sidebar {
    position: fixed; top: 0; left: -320px; width: 300px; height: 100vh;
    background: #fff; z-index: 1050; transition: left 0.3s ease-in-out;
    box-shadow: 4px 0 20px rgba(0,0,0,0.1);
}
.admin-mobile-sidebar.open { left: 0; }
.sidebar-overlay {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(27,44,87,0.7); backdrop-filter: blur(4px); z-index: 1040;
}

/* STRICT HEX CODES APPLIED */
.text-navy { color: #1b2c57 !important; }
.bg-navy { background-color: #1b2c57 !important; }
.btn-navy { background-color: #1b2c57; color: white; border: none; transition: all 0.2s ease; }
.btn-navy:hover { background-color: #121e3a; transform: translateY(-2px); } 

.text-gold { color: #bea429 !important; } 
.bg-gold { background-color: #bea429 !important; } 

.btn-white { background-color: white; color: #1b2c57; transition: all 0.2s ease; }
.btn-white:hover { background-color: #f8f9fa; }

.hover-lift { transition: transform 0.2s ease; }
.hover-lift:hover { transform: translateY(-2px); }
.transition-all { transition: all 0.3s ease; }

.ls-2 { letter-spacing: 2px; }
.fade-in { animation: fadeIn 0.4s ease-out; }
.modal-backdrop-custom {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(27, 44, 87, 0.4); backdrop-filter: blur(5px); z-index: 1050;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@keyframes pulseSave {
    0% { box-shadow: 0 0 0 0 rgba(27, 44, 87, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(27, 44, 87, 0); }
    100% { box-shadow: 0 0 0 0 rgba(27, 44, 87, 0); }
}
.pulse-btn {
    animation: pulseSave 2s infinite;
}
</style>

<style scoped>
.cursor-pointer { cursor: pointer !important; }
</style>
