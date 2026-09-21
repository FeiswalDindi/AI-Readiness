<script setup>
import { ref, computed, onMounted } from 'vue';
import { store } from '../store'; 
import { useRouter } from 'vue-router';

const router = useRouter();
const user = computed(() => store.user);
const resources = computed(() => store.content.resources || []);

// --- LIVE NEWS LOGIC ---
const news = ref([]);
const newsLoading = ref(true);

const API_KEY = 'pub_2c579651e55e434ca7118343e55a9720'; 

const fetchDashboardNews = async () => {
    try {
        const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=ke&category=business,technology&language=en`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'success' && data.results.length > 0) {
            // Only take top 3 for dashboard
            news.value = data.results.slice(0, 3);
        } else {
            // Fallback
            throw new Error("No Data");
        }
    } catch (e) {
        // Silent fallback for dashboard
        news.value = [
            { title: "Kenya's 2026 Tech Roadmap", source_id: "RA Insights", link: "#", pubDate: new Date() },
            { title: "AI in East African Policy", source_id: "Policy Brief", link: "#", pubDate: new Date() },
            { title: "Nairobi Finance Summit", source_id: "Biz Daily", link: "#", pubDate: new Date() }
        ];
    } finally {
        newsLoading.value = false;
    }
};

// --- DOWNLOAD LOGIC ---
const downloadFile = (fileName) => {
    const fileUrl = `/files/${fileName}`; 

    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    store.trackActivity("File Download", `User downloaded: ${fileName}`);
};

onMounted(() => {
    window.scrollTo(0, 0);
    if (!store.user) {
        router.push('/');
    }
    fetchDashboardNews();
});

const handleLogout = () => { store.isLogoutModalOpen = true; };
const openBooking = () => { window.open('https://calendly.com/your-profile/30min', '_blank'); };

// Helpers
const formatDate = (d) => {
   if(!d) return '';
   const date = new Date(d);
   const now = new Date();
   const diff = Math.floor((now - date) / 1000 / 60 / 60); 
   if (diff < 24) return `${diff} hrs ago`;
   return `${Math.floor(diff/24)} days ago`;
};
</script>

<template>
  <main class="dashboard-page bg-light min-vh-100 py-5 mt-5">
    <div class="container py-4 mt-4" v-if="user">
      
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
        <div>
            <div class="d-flex align-items-center gap-2 mb-1">
                <span class="status-pulse"></span>
                <h6 class="text-uppercase text-muted ls-2 small fw-bold mb-0">Active Session</h6>
            </div>
            <h2 class="fw-bold text-navy mb-0">Client: <span class="text-gold">{{ user.displayName }}</span></h2>
        </div>
        
        <div class="d-flex align-items-center gap-3">
             <div class="user-pill bg-white px-3 py-2 rounded-pill shadow-sm border border-light d-flex align-items-center gap-2">
                 <img :src="user.avatar || user.photoURL" class="rounded-circle border" width="32" height="32" referrerpolicy="no-referrer">
                 <div class="d-none d-sm-block">
                    <span class="small fw-bold text-navy d-block">{{ user.email }}</span>
                 </div>
             </div>
             <button @click="handleLogout" class="btn btn-navy-outline btn-sm rounded-pill px-4 fw-bold shadow-sm">
                 Sign Out
             </button>
        </div>
      </div>

      <div class="row g-4 mb-5">
          <div class="col-md-4" v-for="i in 3" :key="i">
              <div class="card border-0 shadow-sm p-4 h-100 dashboard-card rounded-4">
                  <div class="d-flex align-items-center gap-3">
                      <div class="svg-icon-box bg-light-gold text-gold rounded-circle">
                          <svg v-if="i==1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z"/></svg>
                          <svg v-if="i==2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/></svg>
                          <svg v-if="i==3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/></svg>
                      </div>
                      <div>
                          <h6 class="text-muted mb-0 small text-uppercase ls-1">{{ ['Account Type', 'Files Access', 'Session Status'][i-1] }}</h6>
                          <h5 class="fw-bold mb-0 text-navy mt-1">
                              {{ i === 1 ? 'Premium Client' : (i === 2 ? resources.length + ' Documents' : 'Encrypted') }}
                          </h5>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div class="row g-4 mb-5">
          <div class="col-lg-8">
              <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                  <div class="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
                      <h5 class="fw-bold m-0 text-navy">Resource Vault</h5>
                      <span class="badge bg-gold text-navy fw-bold px-3 py-2 rounded-pill shadow-sm">Sync Active</span>
                  </div>
                  <div class="list-group list-group-flush">
                      
                      <div v-if="resources.length === 0" class="p-5 text-center text-muted">
                          <p class="mb-0">No documents have been assigned to your account yet.</p>
                      </div>

                      <div v-for="file in resources" :key="file.id" class="list-group-item p-4 d-flex align-items-center justify-content-between resource-item">
                          <div class="d-flex align-items-center gap-3">
                              <div class="file-type-icon bg-light-navy text-navy fw-bold small rounded-3 px-3 py-2 border">
                                  {{ file.type }}
                              </div>
                              <div>
                                <span class="fw-bold text-navy d-block">{{ file.title }}</span>
                                <small class="text-muted">{{ file.size }} • Ready for Download</small>
                              </div>
                          </div>
                          <button v-if="file.status === 'Available'" @click="downloadFile(file.fileName)" class="btn btn-sm btn-navy rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm">
                            Download
                          </button>
                          <span v-else class="text-muted small fst-italic">🔒 Request Access</span>
                      </div>
                  </div>
              </div>
          </div>

          <div class="col-lg-4 d-flex flex-column gap-3">
              <div class="card border-0 shadow-sm rounded-4 p-4 bg-navy text-white h-100 position-relative overflow-hidden">
                  <div class="position-absolute top-0 end-0 p-3 opacity-10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/></svg>
                  </div>
                  <h5 class="fw-bold mb-3 text-gold">Professional Support</h5>
                  <p class="text-white-50 mb-4 small">
                    As a verified partner, you have priority access to our advisory desk. 
                  </p>
                  <div class="support-pill bg-white-10 p-3 rounded-3 mb-4 border border-light border-opacity-10">
                      <div class="small fw-bold mb-2 text-white-50 text-uppercase ls-1" style="font-size: 0.7rem;">Assigned Consultant:</div>
                      <div class="d-flex align-items-center gap-2">
                          <img src="https://ui-avatars.com/api/?name=Advisory+Desk&background=bea429&color=1b2c57" class="rounded-circle" width="30">
                          <span class="fw-bold">Advisory Desk</span>
                      </div>
                  </div>
                  <a :href="'mailto:info@rastrategicanalytics.com?subject=Consultation Request: ' + user.displayName" class="btn btn-gold w-100 fw-bold py-3 mt-auto rounded-pill shadow">
                    Initiate Consultation
                  </a>
              </div>
              <button @click="openBooking" class="btn btn-white w-100 fw-bold py-3 rounded-pill shadow-sm border text-navy">
                 📅 Schedule Meeting
              </button>
          </div>
      </div>

      <section class="news-feed-dashboard pt-4 mt-5 border-top">
          <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold text-navy m-0">Industry Intelligence</h5>
              <router-link to="/insights" class="text-gold small fw-bold text-decoration-none">View All Insights ➝</router-link>
          </div>
          
          <div v-if="newsLoading" class="text-center py-4">
               <span class="spinner-border spinner-border-sm text-gold" role="status"></span>
               <span class="ms-2 small text-muted fw-bold">Updating feed...</span>
          </div>

          <div v-else class="row g-4">
              <div v-for="(article, index) in news" :key="index" class="col-md-4">
                  <a :href="article.link" target="_blank" class="news-card-mini bg-white p-4 h-100 rounded-4 shadow-sm d-block text-decoration-none border">
                      <div class="d-flex justify-content-between align-items-center mb-3">
                          <div class="small text-gold fw-bold text-uppercase badge bg-light-gold px-2 py-1" style="font-size: 0.65rem;">{{ article.source_id }}</div>
                          <div class="small text-muted fw-bold" style="font-size: 0.7rem">{{ formatDate(article.pubDate) }}</div>
                      </div>
                      <h6 class="text-navy fw-bold mb-0 line-clamp-2" style="line-height: 1.4;">{{ article.title }}</h6>
                  </a>
              </div>
          </div>
      </section>

    </div>
  </main>
</template>

<style scoped>
/* STRICT COLORS */
.text-navy { color: #1b2c57 !important; }
.bg-navy { background-color: #1b2c57 !important; }
.bg-light-navy { background-color: #f4f6fa; }

.text-gold { color: #bea429 !important; }
.bg-gold { background-color: #bea429 !important; }
.bg-light-gold { background-color: rgba(190, 164, 41, 0.15); }

.bg-white-10 { background-color: rgba(255,255,255,0.05); }

/* BUTTONS */
.btn-gold { background-color: #bea429 !important; color: #1b2c57 !important; border: none; transition: 0.3s; }
.btn-gold:hover { background-color: #a38c22 !important; color: white !important; transform: translateY(-2px); }

.btn-navy { background-color: #1b2c57 !important; color: white !important; border: none; transition: 0.3s; }
.btn-navy:hover { background-color: #121e3a !important; transform: translateY(-2px); }

.btn-navy-outline { border: 2px solid #1b2c57 !important; color: #1b2c57 !important; background: transparent; transition: 0.3s; }
.btn-navy-outline:hover { background: #1b2c57 !important; color: white !important; }

.btn-white { background-color: white; color: #1b2c57; transition: transform 0.2s; }
.btn-white:hover { transform: translateY(-2px); background-color: #f8f9fa; }

/* UTILS */
.ls-1 { letter-spacing: 1px; }
.ls-2 { letter-spacing: 2px; }

.dashboard-card { transition: transform 0.3s ease; border: 1px solid rgba(0,0,0,0.03) !important; }
.dashboard-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(27, 44, 87, 0.05) !important; }

.svg-icon-box { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; }

/* NEWS CARD UPDATE */
.news-card-mini { transition: all 0.3s ease; border-left: 4px solid transparent !important; }
.news-card-mini:hover { border-left-color: #bea429 !important; transform: translateX(5px); box-shadow: 0 10px 25px rgba(27, 44, 87, 0.1) !important; }

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.resource-item { transition: background 0.2s; border-color: rgba(0,0,0,0.03); }
.resource-item:hover { background-color: #f8f9fa; }

/* ONLINE DOT */
.status-pulse {
    width: 10px;
    height: 10px;
    background-color: #2ecc71; /* Keep green to denote 'online' */
    border-radius: 50%;
    display: inline-block;
    position: relative;
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7);
    animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 10px 10px rgba(46, 204, 113, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
}
</style>