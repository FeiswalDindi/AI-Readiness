<script setup>
import { ref, onMounted } from 'vue';
import { store } from '../store';

const articles = ref([]);
const loading = ref(true);
const error = ref(null);
const imgFailed = ref(false); 

const API_KEY = 'pub_2c579651e55e434ca7118343e55a9720'; 

const BACKUP_NEWS = [
    {
        title: "Kenya introduces new AI guidelines for Universities",
        description: "Ministry of Education publishes a comprehensive framework for ethical AI adoption in Higher Education institutions across the country.",
        image_url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&auto=format&fit=crop",
        link: "#",
        source_id: "Tech News Africa",
        pubDate: new Date().toISOString()
    },
    {
        title: "How Gen-Z is adopting AI in Job Searches",
        description: "A recent survey shows that over 65% of fresh graduates are using AI tools to draft resumes and prepare for interviews.",
        image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop",
        link: "#",
        source_id: "Education Weekly",
        pubDate: new Date().toISOString()
    },
    {
        title: "Ministry of Education partners with tech giants",
        description: "New coalition aims to bridge the digital divide by providing AI-ready infrastructure to rural educational institutions.",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop",
        link: "#",
        source_id: "Policy Brief",
        pubDate: new Date().toISOString()
    }
];

const fetchNews = async () => {
    try {
        const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=ke&category=business,technology&language=en`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'success' && data.results.length > 0) {
            articles.value = data.results;
        } else {
            throw new Error("API Limit Reached or No Data");
        }

    } catch (err) {
        console.warn("Using Backup News:", err);
        articles.value = BACKUP_NEWS;
        error.value = true; 
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchNews();
});

const formatDate = (dateString) => {
    if(!dateString) return 'Recent';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Default high-quality placeholder image
const defaultImage = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80';

const getimage = (img) => {
    return img ? img : defaultImage;
};

// Triggered if the API image URL is broken
const handleImageError = (e) => {
    e.target.src = defaultImage;
};
</script>

<template>
  <main class="insights-page bg-light min-vh-100 pb-5">
    
    <section class="page-header py-5 bg-navy text-white text-center position-relative overflow-hidden" 
             style="padding-top: 120px !important;"
             :style="store.content.pageBackgrounds?.insights ? `background-image: linear-gradient(rgba(27, 44, 87, 0.85), rgba(27, 44, 87, 0.95)), url(${store.content.pageBackgrounds.insights}); background-size: cover; background-position: center;` : ''"
    >
      <div class="container py-5 position-relative z-2 mt-4">
        
        <div class="header-logo mx-auto mb-4" v-scroll-reveal>
            <img 
                :src="store.content.logoUrl || 'https://ui-avatars.com/api/?name=AR&background=1b2c57&color=fff'" 
                alt="Project Logo" 
                class="banner-logo-img rounded-circle shadow-lg border border-4 border-gold"
                style="width: 120px; height: 120px; object-fit: cover; background: transparent;"
            >
        </div>

        <h1 class="display-3 fw-bold mb-3" v-scroll-reveal="{ delay: 100 }">Market Intelligence</h1>
        <p class="lead text-white-50 mx-auto" style="max-width: 700px;" v-scroll-reveal="{ delay: 300 }">
            Curated updates on Policy, Technology, and Economic trends shaping our region.
        </p>
      </div>
    </section>

    <section class="py-5">
      <div class="container py-4">
        
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-gold" role="status"></div>
            <p class="text-muted mt-3 small">Fetching latest market data...</p>
        </div>

        <div v-else class="row g-4">
            
            <div class="col-md-6 col-lg-4" v-for="(article, index) in articles" :key="index">
                <a :href="article.link" target="_blank" class="card h-100 border-0 shadow-sm news-card text-decoration-none bg-white rounded-4 overflow-hidden">
                    
                    <div class="card-img-top overflow-hidden position-relative" style="height: 220px;">
                        <img 
                            :src="getimage(article.image_url)" 
                            @error="handleImageError"
                            class="w-100 h-100 object-fit-cover transition-img"
                        >
                        <div class="category-badge shadow-sm">
                            {{ article.source_id }}
                        </div>
                    </div>

                    <div class="card-body p-4 d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <small class="text-gold fw-bold text-uppercase ls-1" style="font-size: 0.75rem;">{{ formatDate(article.pubDate) }}</small>
                        </div>
                        
                        <h5 class="fw-bold text-navy mb-3 line-clamp-2">{{ article.title }}</h5>
                        <p class="text-muted small line-clamp-3 mb-4 flex-grow-1">
                            {{ article.description || "Click to read the full story and detailed analysis on the source website." }}
                        </p>

                        <div class="mt-auto pt-3 border-top d-flex align-items-center text-navy fw-bold small read-more-link">
                            Read Article 
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2 transition-arrow" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </div>
                    </div>
                </a>
            </div>

        </div>

        <div v-if="error" class="text-center mt-5">
            <small class="text-muted fst-italic">
                * Live API limit reached. Showing curated archive data.
            </small>
        </div>

      </div>
    </section>

  </main>
</template>

<style scoped>
/* STRICT COLORS */
.bg-navy { background-color: #1b2c57 !important; }
.text-navy { color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; }
.bg-gold { background-color: #bea429 !important; }

.ls-2 { letter-spacing: 2px; }
.ls-1 { letter-spacing: 1px; }

/* THE NEW STANDARDIZED HEADER LOGO */
.header-logo {
    width: 150px; 
    height: 150px; 
    border-radius: 50%;
    overflow: hidden;
    background-color: white; 
    border: 3px solid #bea429; 
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    transition: transform 0.4s ease;
}
.header-logo:hover { transform: scale(1.05); }
.banner-logo-img { width: 100%; height: 100%; object-fit: cover; }
.banner-logo-svg { width: 100%; height: 100%; }

/* CARD STYLES */
.news-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease;
    border-bottom: 4px solid transparent !important; 
}
.news-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(27, 44, 87, 0.1) !important;
    border-color: #bea429 !important; 
}

/* IMAGE ZOOM EFFECT */
.transition-img { transition: transform 0.5s ease; }
.news-card:hover .transition-img { transform: scale(1.08); }

/* BADGE */
.category-badge {
    position: absolute;
    top: 15px; left: 15px;
    background: #1b2c57; 
    color: #bea429; 
    font-size: 0.7rem;
    font-weight: bold;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 20px; 
    letter-spacing: 1px;
}

/* TEXT TRUNCATION */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* LINK & ARROW ANIMATION */
.read-more-link { transition: color 0.3s ease; }
.transition-arrow { transition: transform 0.3s ease; }
.news-card:hover .read-more-link { color: #bea429 !important; }
.news-card:hover .transition-arrow { transform: translateX(5px); }

@media (max-width: 768px) {
    .header-logo { width: 120px; height: 120px; }
}
</style>