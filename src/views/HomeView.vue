<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { store } from '../store';

const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timerInterval;
let slideInterval;
const currentSlide = ref(0);

const slides = computed(() => store.content.heroSlides || []);

const nextSlide = () => {
    if (slides.value.length > 0) {
        currentSlide.value = (currentSlide.value + 1) % slides.value.length;
    }
};

const handleSurveyClick = () => {
    if (store.user) {
        window.open(store.content.qualtricsLink, '_blank');
    } else {
        store.intent = 'survey';
        store.isLoginModalOpen = true;
    }
};

const updateCountdown = () => {
    const target = new Date(store.content.countdownDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference > 0) {
        timeLeft.value = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
    } else {
        timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
};

onMounted(() => {
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
    slideInterval = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
    clearInterval(timerInterval);
    clearInterval(slideInterval);
});
</script>

<template>
  <main>
    <!-- HERO / LANDING SECTION -->
    <header class="hero-section text-white d-flex align-items-center position-relative overflow-hidden">
        
        <!-- DYNAMIC BACKGROUND SLIDER -->
        <div v-if="slides.length > 0">
            <div 
                v-for="(slide, index) in slides" 
                :key="index"
                class="hero-bg"
                :style="{ backgroundImage: `url(${slide.image})` }"
                :class="{ 'active': currentSlide === index }"
            ></div>
        </div>
        <div class="overlay"></div>

        <div class="container position-relative z-2 pt-5 mt-5">
            <div class="row align-items-center g-5">
                
                <!-- Left: Info & Actions -->
                <div class="col-lg-6 text-center text-lg-start">
                    <transition name="fade" mode="out-in">
                        <div :key="currentSlide" v-if="slides.length > 0 && slides[currentSlide]">
                            <h1 class="display-4 fw-bold mb-4 animate-title text-white">
                                {{ slides[currentSlide].title || store.content.about.title }}
                            </h1>
                            <p class="lead mb-4 opacity-75 fs-5 animate-subtitle pe-lg-4">
                                {{ slides[currentSlide].subtitle || store.content.about.text }}
                            </p>
                        </div>
                        <div v-else>
                            <h1 class="display-4 fw-bold mb-4 animate-title text-white">
                                {{ store.content.about.title }}
                            </h1>
                            <p class="lead mb-4 opacity-75 fs-5 animate-subtitle pe-lg-4">
                                {{ store.content.about.text }}
                            </p>
                        </div>
                    </transition>
                    
                    <div class="d-flex flex-column flex-sm-row gap-3 mt-4 animate-buttons w-100">
                        <button @click="handleSurveyClick" class="btn btn-gold btn-lg px-4 py-3 rounded-pill fw-bold shadow-lg border-0">
                            Take Pilot Survey
                        </button>
                        <a :href="store.content.whatsappLink" target="_blank" class="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
                            Join WhatsApp
                        </a>
                    </div>
                </div>

                <!-- Right: Poster & Countdown -->
                <div class="col-lg-6">
                    <div class="glass-card p-4 text-center">
                        <h4 class="text-gold mb-3 fw-bold">Next Big Survey Drops In</h4>
                        
                        <div class="countdown-wrapper d-flex justify-content-center gap-2 gap-sm-4 mb-4">
                            <div class="time-box">
                                <div class="number">{{ timeLeft.days }}</div>
                                <div class="label">Days</div>
                            </div>
                            <div class="time-box">
                                <div class="number">{{ timeLeft.hours }}</div>
                                <div class="label">Hours</div>
                            </div>
                            <div class="time-box">
                                <div class="number">{{ timeLeft.minutes }}</div>
                                <div class="label">Mins</div>
                            </div>
                            <div class="time-box">
                                <div class="number">{{ timeLeft.seconds }}</div>
                                <div class="label">Secs</div>
                            </div>
                        </div>

                        <div v-if="store.content.posterUrl" class="poster-container rounded overflow-hidden shadow">
                            <img :src="store.content.posterUrl" class="img-fluid" alt="Project Poster" />
                        </div>
                        <div v-else class="poster-placeholder rounded p-4 border border-secondary border-dashed">
                            <p class="text-white-50 mb-0 small">Official Project Poster Pending</p>
                        </div>
                    </div>
                </div>

            </div>
            
            <div class="d-flex justify-content-center gap-2 mt-4" v-if="slides.length > 1">
                <span 
                    v-for="(slide, index) in slides" :key="index"
                    class="dot" :class="{ 'active': currentSlide === index }"
                    @click="currentSlide = index"
                ></span>
            </div>
            
        </div>
    </header>

    <!-- MISSION / VISION -->
    <section class="py-5 bg-light">
        <div class="container py-4">
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                        <div class="icon-circle mx-auto mb-3 text-gold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286M7.5 13h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5"/></svg>
                        </div>
                        <h3 class="fw-bold text-navy mb-3">Our Mission</h3>
                        <p class="text-muted">{{ store.content.mission }}</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                        <div class="icon-circle mx-auto mb-3 text-gold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/></svg>
                        </div>
                        <h3 class="fw-bold text-navy mb-3">Our Vision</h3>
                        <p class="text-muted">{{ store.content.vision }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- RESEARCH ADMINISTRATORS -->
    <section class="py-5 bg-white">
        <div class="container py-5 text-center">
            <h6 class="text-gold fw-bold ls-2 mb-2 text-uppercase">The People Behind The Project</h6>
            <h2 class="fw-bold text-navy mb-5 display-6">Our Research Team</h2>
            
            <div class="row g-4 justify-content-center">
                <div class="col-md-6 col-lg-4" v-for="member in store.content.team" :key="member.name">
                    <div class="card h-100 border-0 shadow-sm text-center team-card p-4">
                        <img :src="member.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1b2c57&color=fff&size=128`" class="rounded-circle mx-auto mb-3 shadow" style="width:120px; height:120px; object-fit: cover;" alt="Avatar">
                        <h5 class="fw-bold text-navy mb-1">{{ member.name }}</h5>
                        <p class="text-gold small fw-bold mb-3 text-uppercase">{{ member.role }}</p>
                        <p class="text-muted small px-2">{{ member.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SOCIAL UPDATES / COMMUNITY FEED -->
    <section class="py-5 bg-light-navy" v-if="store.content.socialUpdates && store.content.socialUpdates.length > 0">
        <div class="container py-5">
            <div class="text-center mb-5">
                <h6 class="text-gold fw-bold ls-2 mb-2 text-uppercase">Community Feed</h6>
                <h2 class="fw-bold text-navy display-6">Latest Updates</h2>
            </div>
            
            <div class="row g-4 justify-content-center">
                <div class="col-md-6 col-lg-4" v-for="update in store.content.socialUpdates" :key="update.id">
                    
                    <!-- DYNAMIC CARD STYLING BASED ON PLATFORM -->
                    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden social-card" :class="'card-' + update.platform.toLowerCase().replace(/[^a-z]/g, '')">
                        <div class="card-body p-4 d-flex flex-column position-relative">
                            
                            <!-- Top Right: AR Avatar -->
                            <div class="platform-icon-wrap position-absolute top-0 end-0 m-3">
                                <img src="https://ui-avatars.com/api/?name=AI+Readiness&background=1b2c57&color=fff" class="rounded-circle shadow-sm border border-white" style="width: 32px; height: 32px;" alt="Avatar">
                            </div>

                            <div class="d-flex align-items-center mb-3">
                                <!-- Top Left: Platform SVG -->
                                <div class="me-3 d-flex align-items-center justify-content-center rounded-circle shadow-sm bg-white" style="width: 48px; height: 48px;">
                                    <!-- Twitter(X) -->
                                    <svg v-if="update.platform === 'Twitter (X)'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="text-dark" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
                                    <!-- LinkedIn -->
                                    <svg v-else-if="update.platform === 'LinkedIn'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0077b5" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
                                    <!-- Facebook -->
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#1877F2" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
                                </div>
                                
                                <div>
                                    <h6 class="mb-0 fw-bold text-dark">AI Readiness Project</h6>
                                    <small class="text-muted" style="font-size: 0.75rem;">@AIReadiness &middot; {{ new Date(update.date).toLocaleDateString() }}</small>
                                </div>
                            </div>
                            
                            <p class="card-text text-dark mb-4 flex-grow-1" style="white-space: pre-wrap; font-size: 0.95rem;">{{ update.text }}</p>
                            
                            <a v-if="update.link && update.link !== '#'" :href="update.link" target="_blank" class="text-decoration-none mt-auto fw-bold" :class="update.platform === 'Twitter (X)' ? 'text-dark' : 'text-primary'">
                                View full post &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

  </main>
</template>

<style scoped>
.hero-section { min-height: 90vh; background-color: #1b2c57; position: relative; }
.overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at center, rgba(27, 44, 87, 0.8) 0%, rgba(15, 23, 42, 1) 100%); z-index: 1;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1); 
  border-radius: 20px;
}

.countdown-wrapper .time-box {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(190, 164, 41, 0.3);
    border-radius: 10px;
    padding: 10px 15px;
    min-width: 70px;
}
.countdown-wrapper .number { font-size: 2rem; font-weight: bold; color: white; line-height: 1; margin-bottom: 5px; }
.countdown-wrapper .label { font-size: 0.75rem; text-transform: uppercase; color: #bea429; letter-spacing: 1px; }

.btn-gold { background-color: #bea429; color: #1b2c57; border: none; transition: all 0.3s ease; }
.btn-gold:hover { background-color: #a38c22; transform: translateY(-3px); color: white; }
.btn-outline-light:hover { color: #1b2c57 !important; transform: translateY(-3px); }

.icon-circle {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(190, 164, 41, 0.1);
    display: flex; align-items: center; justify-content: center;
}

.team-card {
    transition: transform 0.3s ease;
    background: #f8f9fa;
    border-radius: 15px !important;
}
.team-card:hover { transform: translateY(-10px); }
.text-navy { color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; }
.bg-gold { background-color: #bea429 !important; }
</style>

<style scoped>
/* HERO SLIDER STYLES */
.hero-section { background-color: #1b2c57; }
.hero-bg {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background-size: cover; background-position: center; opacity: 0;
    transition: opacity 1.5s ease-in-out, transform 6s ease; transform: scale(1); z-index: 0;
}
.hero-bg.active { opacity: 0.8; transform: scale(1.05); }

.overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(135deg, rgba(27, 44, 87, 0.98), rgba(27, 44, 87, 0.7)); z-index: 1;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.dot { width: 12px; height: 12px; background: rgba(255,255,255,0.3); border-radius: 50%; cursor: pointer; transition: all 0.3s; }
.dot.active { background: #bea429; transform: scale(1.3); box-shadow: 0 0 10px rgba(190, 164, 41, 0.5); }

.bg-light-navy { background-color: #f4f6fa; }
.btn-outline-navy {
    color: #1b2c57;
    border: 2px solid #1b2c57;
    transition: all 0.3s;
}
.btn-outline-navy:hover {
    background-color: #1b2c57;
    color: white;
}

.social-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.social-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }

.card-twitterx { border-top: 4px solid #000 !important; background-color: #fff; }
.card-linkedin { border-top: 4px solid #0077b5 !important; background-color: #f3f6f8; }
.card-facebook { border-top: 4px solid #1877F2 !important; background-color: #f0f2f5; }

.platform-icon-wrap svg { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
</style>