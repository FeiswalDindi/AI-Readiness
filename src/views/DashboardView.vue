<script setup>
import { ref, computed, onMounted } from 'vue';
import { store } from '../store'; 
import { useRouter } from 'vue-router';

const router = useRouter();
const user = computed(() => store.user);

// --- SURVEY DATA ---
const surveys = computed(() => {
    const completed = [];
    const upcoming = [];
    
    if (store.userProfile && store.userProfile.surveyCompleted) {
        completed.push({ id: 1, title: 'AI Pilot Questionnaire', date: 'Recently Completed', points: 'Participant', status: 'Verified' });
        upcoming.push({ id: 2, title: 'Main AI Readiness Assessment', date: 'Available Dec 1st', estTime: '15 mins', status: 'Locked' });
    } else {
        upcoming.push({ id: 1, title: 'AI Pilot Questionnaire', date: 'Available Now', estTime: '5 mins', status: 'Action Required', actionUrl: store.content.qualtricsLink });
        upcoming.push({ id: 2, title: 'Main AI Readiness Assessment', date: 'Available Dec 1st', estTime: '15 mins', status: 'Locked' });
    }
    
    return { completed, upcoming };
});

// --- LIVE NEWS LOGIC ---
const news = ref([]);
const newsLoading = ref(true);
const API_KEY = 'pub_2c579651e55e434ca7118343e55a9720'; 

const fetchDashboardNews = async () => {
    try {
        const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=ke&category=technology,business&language=en&image=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'success' && data.results.length > 0) {
            // Take top 4 for dashboard, ensuring they have images if possible
            news.value = data.results.filter(n => n.image_url).slice(0, 4);
            if(news.value.length === 0) news.value = data.results.slice(0, 4); // fallback if no images
        } else {
            throw new Error("No Data");
        }
    } catch (e) {
        // High quality fallback data with images
        news.value = [
            { title: "Kenya introduces new AI guidelines for Universities", source_id: "Tech News Africa", link: "#", image_url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&auto=format&fit=crop", pubDate: new Date() },
            { title: "How Gen-Z is adopting AI in Job Searches", source_id: "Education Weekly", link: "#", image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop", pubDate: new Date() },
            { title: "Ministry of Education partners with tech giants", source_id: "Policy Brief", link: "#", image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop", pubDate: new Date() }
        ];
    } finally {
        newsLoading.value = false;
    }
};

onMounted(() => {
    window.scrollTo(0, 0);
    if (!store.user) {
        router.push('/');
    }
    fetchDashboardNews();
});

const handleLogout = () => { store.isLogoutModalOpen = true; };

const formatDate = (d) => {
   if(!d) return '';
   const date = new Date(d);
   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
</script>

<template>
  <main class="dashboard-page bg-light min-vh-100 py-5 mt-5">
    <div class="container py-4 mt-4" v-if="user">
      
      <!-- HEADER -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
        <div>
            <div class="d-flex align-items-center gap-2 mb-1">
                <span class="status-pulse"></span>
                <h6 class="text-uppercase text-muted ls-2 small fw-bold mb-0">Participant Portal</h6>
            </div>
            <h2 class="fw-bold text-navy mb-0">Welcome, <span class="text-gold">{{ user.displayName }}</span></h2>
        </div>
        
        <div class="d-flex align-items-center gap-3">
             <a v-if="!store.userProfile?.surveyCompleted" :href="store.content.qualtricsLink" target="_blank" class="btn btn-gold rounded-0 px-4 py-2 fw-bold shadow-sm text-navy d-none d-md-block">
                 Take Pilot Survey
             </a>
             <div class="user-pill bg-white px-3 py-2 rounded-0 shadow-sm border border-light d-flex align-items-center gap-2">
                 <img :src="user.avatar || user.photoURL" class="rounded-circle border" width="32" height="32" referrerpolicy="no-referrer">
                 <div class="d-none d-sm-block">
                    <span class="small fw-bold text-navy d-block">{{ user.email }}</span>
                 </div>
             </div>
             <button @click="handleLogout" class="btn btn-navy-outline btn-sm rounded-0 px-4 fw-bold shadow-sm">
                 Sign Out
             </button>
        </div>
      </div>

      <!-- SURVEY INFORMATION SECTION -->
      <div class="row g-4 mb-5">
          <div class="col-lg-6">
              <div class="card border-0 shadow-sm rounded-0 h-100">
                  <div class="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
                      <h5 class="fw-bold m-0 text-navy">Completed Surveys</h5>
                      <span class="badge bg-light-green text-success fw-bold px-3 py-2 rounded-0 shadow-sm">{{ surveys.completed.length }} Total</span>
                  </div>
                  <div class="list-group list-group-flush">
                      <div v-if="surveys.completed.length === 0" class="p-5 text-center text-muted">
                          <p class="mb-0">You haven't completed any surveys yet.</p>
                      </div>
                      <div v-for="survey in surveys.completed" :key="survey.id" class="list-group-item p-4 d-flex align-items-center justify-content-between survey-item">
                          <div>
                              <span class="fw-bold text-navy d-block mb-1">{{ survey.title }}</span>
                              <small class="text-muted"><i class="bi bi-calendar-check"></i> Completed on {{ survey.date }}</small>
                          </div>
                          <div class="text-end">
                              <span class="badge bg-gold text-navy fw-bold px-3 py-1 rounded-0 mb-1 d-block">{{ survey.points }}</span>
                              <small class="text-success fw-bold" style="font-size: 0.7rem;">✔ {{ survey.status }}</small>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="col-lg-6">
              <div class="card border-0 shadow-sm rounded-0 h-100 bg-navy text-white">
                  <div class="card-header border-bottom border-light border-opacity-10 p-4 d-flex justify-content-between align-items-center">
                      <h5 class="fw-bold m-0 text-gold">Upcoming Surveys</h5>
                      <span class="badge bg-white-10 text-white fw-bold px-3 py-2 rounded-0">Action Required</span>
                  </div>
                  <div class="list-group list-group-flush flex-grow-1">
                      <div v-if="surveys.upcoming.length === 0" class="p-5 text-center text-white-50">
                          <p class="mb-0">No upcoming surveys at this time.</p>
                      </div>
                      <div v-for="survey in surveys.upcoming" :key="survey.id" class="list-group-item bg-transparent text-white border-light border-opacity-10 p-4 d-flex align-items-center justify-content-between">
                          <div>
                              <span class="fw-bold d-block mb-1">{{ survey.title }}</span>
                              <small class="text-white-50">⏱ Est: {{ survey.estTime }} • {{ survey.date }}</small>
                          </div>
                          <a v-if="survey.status === 'Action Required'" :href="survey.actionUrl" target="_blank" class="btn btn-gold btn-sm rounded-0 px-4 fw-bold shadow-sm text-navy">
                              Take Survey
                          </a>
                          <button v-else disabled class="btn btn-outline-light btn-sm rounded-0 px-4 fw-bold opacity-50">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 mb-1" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>
                              Locked
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <!-- INSIGHTS NEWS WITH IMAGES -->
      <section class="news-feed-dashboard pt-4 mt-5 border-top">
          <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                  <h4 class="fw-bold text-navy m-0">Project Insights & News</h4>
                  <p class="text-muted small mb-0">Latest updates on AI readiness and job markets</p>
              </div>
              <router-link to="/insights" class="btn btn-outline-navy btn-sm rounded-0 px-4 fw-bold">View All ➝</router-link>
          </div>
          
          <div v-if="newsLoading" class="text-center py-5">
               <span class="spinner-border text-gold" role="status" style="width: 3rem; height: 3rem;"></span>
               <div class="mt-3 text-muted fw-bold">Curating latest insights...</div>
          </div>

          <div v-else class="row g-4">
              <div v-for="(article, index) in news" :key="index" class="col-md-6 col-xl-3">
                  <a :href="article.link" target="_blank" class="card border-0 shadow-sm rounded-0 h-100 text-decoration-none news-card overflow-hidden">
                      <div class="card-img-top news-image" :style="{ backgroundImage: `url(${article.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop'})` }">
                      </div>
                      <div class="card-body p-4 d-flex flex-column">
                          <div class="d-flex justify-content-between align-items-center mb-3">
                              <span class="badge bg-light-gold text-gold fw-bold text-uppercase rounded-0" style="font-size: 0.65rem;">{{ article.source_id }}</span>
                              <span class="small text-muted fw-bold" style="font-size: 0.75rem">{{ formatDate(article.pubDate) }}</span>
                          </div>
                          <h6 class="text-navy fw-bold mb-3 line-clamp-3" style="line-height: 1.5; font-size: 1.05rem;">{{ article.title }}</h6>
                          
                          <div class="mt-auto d-flex align-items-center text-gold small fw-bold read-more">
                              Read Article <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-1 transition-arrow" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>
                          </div>
                      </div>
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
.bg-light-green { background-color: rgba(46, 204, 113, 0.15); }

.bg-white-10 { background-color: rgba(255,255,255,0.05); }

/* BUTTONS */
.btn-navy-outline { border: 2px solid #1b2c57 !important; color: #1b2c57 !important; background: transparent; transition: 0.3s; }
.btn-navy-outline:hover { background: #1b2c57 !important; color: white !important; }
.btn-outline-navy { border: 2px solid #1b2c57 !important; color: #1b2c57 !important; background: transparent; transition: 0.3s; }
.btn-outline-navy:hover { background: #1b2c57 !important; color: white !important; }

/* UTILS */
.ls-1 { letter-spacing: 1px; }
.ls-2 { letter-spacing: 2px; }

/* ONLINE DOT */
.status-pulse {
    width: 10px;
    height: 10px;
    background-color: #2ecc71;
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

/* LIST ITEMS */
.survey-item { transition: background 0.2s; border-color: rgba(0,0,0,0.03); }
.survey-item:hover { background-color: #f8f9fa; }

/* NEWS CARDS WITH IMAGES */
.news-image {
    height: 180px;
    background-size: cover;
    background-position: center;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    transition: transform 0.5s ease;
}

.news-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(0,0,0,0.05) !important;
}

.news-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(27, 44, 87, 0.1) !important;
    border-color: rgba(190, 164, 41, 0.3) !important;
}

.news-card:hover .news-image {
    transform: scale(1.05);
}

.news-card:hover .transition-arrow {
    transform: translateX(5px);
}

.transition-arrow {
    transition: transform 0.3s ease;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>