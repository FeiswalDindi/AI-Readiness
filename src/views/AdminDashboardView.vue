<script setup>
import { ref, watch, onMounted } from 'vue';
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

const showReportModal = ref(false);
const reportType = ref('daily');
const reportDate = ref(new Date().toISOString().slice(0, 10));

watch(() => store.content, (newVal) => {
    if (newVal) {
        const currentDraft = JSON.stringify(draftContent.value);
        const currentStore = JSON.stringify(newVal);
        if (currentDraft.length < 200 && currentStore.length > 200) {
            draftContent.value = JSON.parse(currentStore);
        }
        if (!draftContent.value.heroSlides) draftContent.value.heroSlides = [];
        if (!draftContent.value.socialUpdates) draftContent.value.socialUpdates = [];
        if (!draftContent.value.about) draftContent.value.about = { title: '', text: '' };
    }
}, { deep: true, immediate: true });

const publishChanges = () => {
    store.content = JSON.parse(JSON.stringify(draftContent.value));
    store.saveContent();
    store.trackActivity("CMS Update", "Admin published global content changes");
    alert("✅ Changes Published Live!");
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
              <h1 class="display-5 fw-bold text-navy mb-0">RA Dashboard</h1>
          </div>
          <div class="d-flex flex-wrap gap-3 justify-content-center">
              <button @click="goToFirestore" class="btn btn-white border shadow-sm btn-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2 text-navy fw-bold hover-lift">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                  <span>Database</span>
              </button>
              <button @click="openReportModal" class="btn btn-white border shadow-sm btn-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2 text-navy fw-bold hover-lift">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>Export Reports</span>
              </button>
              <div class="vr mx-2 text-muted opacity-25 d-none d-md-block"></div>
              <button @click="discardChanges" class="btn btn-outline-danger rounded-pill px-4 btn-sm d-flex align-items-center gap-2 fw-bold hover-lift">Discard</button>
              <button @click="publishChanges" class="btn btn-navy rounded-pill fw-bold px-4 py-2 d-flex align-items-center gap-2 shadow-sm hover-lift">Publish All</button>
          </div>
      </div>

      <div class="card border-0 shadow-sm p-4 bg-white mb-5 rounded-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold text-navy mb-0 d-flex align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="text-gold"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  Activity Intelligence
              </h5>
              <button @click="isLogsExpanded = !isLogsExpanded" class="btn btn-sm btn-light rounded-pill px-4 border fw-bold text-navy transition-all">
                  {{ isLogsExpanded ? 'Collapse' : 'Expand' }}
              </button>
          </div>
          <div v-if="isLogsExpanded" class="fade-in">
              <AdminAnalytics :logs="store.activityLogs" />
              
              <div class="table-responsive border rounded-3 mt-4" style="max-height: 350px; overflow-y: auto;">
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

      <hr class="my-5 text-muted opacity-25">

      <!-- SURVEY & PROJECT SETTINGS -->
      <div class="card border-0 shadow-sm p-4 bg-white mb-5 rounded-4">
          <h5 class="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="text-gold" viewBox="0 0 16 16"><path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z"/><path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1"/></svg>
              Project & Survey Settings
          </h5>
          <div class="row g-4">
              <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted text-uppercase ls-1">Main Survey Date (Countdown Target)</label>
                  <input type="datetime-local" v-model="draftContent.countdownDate" class="form-control bg-light border-0 py-3">
                  <small class="text-muted d-block mt-2">Sets the countdown timer on the landing page.</small>
              </div>
              <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted text-uppercase ls-1">Poster Image URL</label>
                  <input type="url" v-model="draftContent.posterUrl" class="form-control bg-light border-0 py-3" placeholder="https://example.com/poster.jpg">
                  <small class="text-muted d-block mt-2">Leave blank to show the placeholder.</small>
              </div>
          </div>
      </div>

      <AdminHeroEditor :slides="draftContent.heroSlides" />

      <div class="row g-4 mb-5">
          <div class="col-12">
              <AdminAboutEditor :aboutData="draftContent.about" />
          </div>
          <div class="col-12">
              <AdminSocialsEditor :socials="draftContent.socialUpdates" />
          </div>
      </div>

      <AdminFileManager />

    </div>

    <div v-if="showReportModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center">
        <div class="bg-white p-5 rounded-4 shadow-lg border" style="width: 450px; max-width: 90%;">
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
                <button @click="closeReportModal" class="btn btn-light border w-50 py-3 fw-bold rounded-pill">Cancel</button>
                <button @click="generateReport" class="btn btn-navy w-50 py-3 fw-bold rounded-pill shadow-sm">Download CSV</button>
            </div>
        </div>
    </div>

  </main>
</template>

<style scoped>
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
</style>