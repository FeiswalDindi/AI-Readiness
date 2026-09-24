<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { store } from '../store';

const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timerInterval;
let slideInterval;
const currentSlide = ref(0);
const selectedMember = ref(null);

const slides = computed(() => store.content.heroSlides || []);

const openMemberModal = (member) => {
    selectedMember.value = member;
};

const closeMemberModal = () => {
    selectedMember.value = null;
};

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

        <div class="container position-relative z-2 pt-5 mt-5 pb-5">
            <div class="row align-items-center g-5">
                
                <!-- Left: Info & Actions -->
                <div class="col-lg-6 text-center text-lg-start">
                    <transition name="fade" mode="out-in">
                        <div :key="currentSlide" v-if="slides.length > 0 && slides[currentSlide]">
                            <h1 class="display-4 fw-bold mb-4 animate-title text-white">
                                {{ slides[currentSlide].title || store.content.about.title }}
                            </h1>
                            <p class="lead mb-4 opacity-75 fs-5 animate-subtitle pe-lg-4" style="white-space: pre-wrap;">
                                {{ slides[currentSlide].subtitle || store.content.about.text }}
                            </p>
                        </div>
                        <div v-else>
                            <h1 class="display-4 fw-bold mb-4 animate-title text-white">
                                {{ store.content.about.title }}
                            </h1>
                            <p class="lead mb-4 opacity-75 fs-5 animate-subtitle pe-lg-4" style="white-space: pre-wrap;">
                                {{ store.content.about.text }}
                            </p>
                        </div>
                    </transition>
                    
                    <div class="d-none d-lg-flex flex-column flex-sm-row gap-3 mt-4 animate-buttons w-100">
                        <button v-if="!store.userProfile?.surveyCompleted" @click="store.startSurveyFlow()" class="btn btn-gold btn-lg px-4 py-3 rounded-pill fw-bold shadow-lg border-0">
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

                        <template v-if="!store.userProfile?.surveyCompleted">
                            <div v-if="store.content.posterUrl" class="poster-container rounded overflow-hidden shadow">
                                <img :src="store.content.posterUrl" class="img-fluid" alt="Project Poster" />
                            </div>
                            <div v-else class="poster-placeholder rounded p-4 border border-secondary border-dashed">
                                <p class="text-white-50 mb-0 small">Official Project Poster Pending</p>
                            </div>
                        </template>
                        
                        <!-- Mobile Buttons -->
                        <div class="d-lg-none d-flex flex-column flex-sm-row gap-3 mt-4 animate-buttons w-100">
                            <button v-if="!store.userProfile?.surveyCompleted" @click="store.startSurveyFlow()" class="btn btn-gold btn-lg px-4 py-3 rounded-pill fw-bold shadow-lg border-0">
                                Take Pilot Survey
                            </button>
                            <a :href="store.content.whatsappLink" target="_blank" class="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
                                Join WhatsApp
                            </a>
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
    <section id="mission" class="py-5 bg-white">
        <div class="container py-4">
            <div class="mission-vision-wrapper" v-scroll-reveal="{ delay: 100 }">
                
                <!-- Right Shape (Mission) - Base Layer -->
                <div class="shape-right d-flex position-absolute top-0 start-0 w-100 h-100">
                    <div class="w-50 ms-auto p-5 d-flex flex-column text-navy justify-content-between align-items-end h-100">
                        <div class="mb-4 text-end">
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#1b2c57" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                                <path d="M8 11A3 3 0 1 1 8 5a3 3 0 0 1 0 6zm0 1A4 4 0 1 0 8 4a4 4 0 0 0 0 8z"/>
                                <path d="M9.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                <path d="M11.354 4.646a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0z"/>
                                <path d="M11.854 3.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708z"/>
                                <path d="M14.5 2.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V3.707L11.854 5.854a.5.5 0 0 1-.708-.708L13.293 3H11.5a.5.5 0 0 1 0-1h3z"/>
                            </svg>
                        </div>
                        <div class="mt-auto text-end" style="max-width: 85%;">
                            <h2 class="fw-bold display-5 text-uppercase mb-3" style="line-height: 1.1; letter-spacing: -1px; color: #1b2c57;">Our<br>Mission</h2>
                            <p class="fs-6 text-muted" style="line-height: 1.6;">{{ store.content.mission }}</p>
                        </div>
                    </div>
                </div>

                <!-- Left Shape (Vision) - Top Layer -->
                <div class="shape-left d-flex position-relative w-100 h-100">
                    <div class="w-50 p-5 d-flex flex-column text-white justify-content-between h-100">
                        <div class="mb-4 text-start">
                            <h2 class="fw-bold display-5 text-uppercase mb-3" style="line-height: 1.1; letter-spacing: -1px;">Our<br>Vision</h2>
                            <p class="fs-6 opacity-75" style="line-height: 1.6;">{{ store.content.vision }}</p>
                        </div>
                        <div class="mt-auto text-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                            </svg>
                        </div>
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
                    <div 
                        class="card h-100 border-0 shadow-sm text-center team-card p-4 cursor-pointer rounded-0"
                        @click="openMemberModal(member)"
                    >
                        <img :src="member.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1b2c57&color=fff&size=128`" class="rounded-circle mx-auto mb-3 shadow" style="width:120px; height:120px; object-fit: cover;" alt="Avatar">
                        <h5 class="fw-bold text-navy mb-1">{{ member.name }}</h5>
                        <p class="text-gold small fw-bold mb-3 text-uppercase">{{ member.role }}</p>
                        
                        <div class="mt-auto">
                            <span class="text-muted small fw-bold read-more-text">View Profile <i class="bi bi-arrow-right"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- TEAM MEMBER MODAL -->
    <transition name="fade">
        <div v-if="selectedMember" class="modal-overlay" @click.self="closeMemberModal">
            <div class="glass-card bg-white position-relative shadow-lg border-0 rounded-0">
                <button class="close-btn text-navy shadow-sm border rounded-0" @click="closeMemberModal">×</button>
                
                <div class="text-center mb-4">
                    <img :src="selectedMember.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}&background=1b2c57&color=fff&size=128`" class="rounded-0 shadow-lg mb-3 border border-4 border-white" style="width: 150px; height: 150px; object-fit: cover; margin-top: -80px;">
                    <h3 class="fw-bold text-navy mb-1">{{ selectedMember.name }}</h3>
                    <h6 class="text-gold fw-bold text-uppercase ls-1 mb-4">{{ selectedMember.role }}</h6>
                    
                    <div class="bg-light-navy p-4 rounded-0 text-start border position-relative overflow-hidden">
                        <svg class="position-absolute" style="top:-20px; right:-20px; opacity: 0.04; pointer-events: none;" xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="#1b2c57" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/></svg>
                        <p class="text-muted mb-0 lh-lg position-relative z-2" style="white-space: pre-wrap;">{{ selectedMember.description || "No description provided." }}</p>
                    </div>
                </div>
                
                <button @click="closeMemberModal" class="btn btn-navy w-100 rounded-pill py-3 fw-bold mt-2">Close Profile</button>
            </div>
        </div>
    </transition>

    <!-- SOCIAL UPDATES / COMMUNITY FEED -->
    <section class="py-5 bg-light-navy" v-if="store.content.socialUpdates && store.content.socialUpdates.length > 0">
        <div class="container py-5">
            <div class="text-center mb-5">
                <h6 class="text-gold fw-bold ls-2 mb-2 text-uppercase">Community Feed</h6>
            </div>
            
            <div class="row g-4 justify-content-center">
                <div class="col-md-6 col-lg-4" v-for="update in store.content.socialUpdates" :key="update.id">
                    
                    <!-- DYNAMIC CARD STYLING BASED ON PLATFORM -->
                    <div class="card h-100 border-0 shadow-sm rounded-0 overflow-hidden social-card" :class="'card-' + update.platform.toLowerCase().replace(/[^a-z]/g, '')">
                        <div class="card-body p-4 d-flex flex-column position-relative">
                            
                            <!-- Top Right: Platform SVG -->
                            <div class="platform-icon-wrap position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center rounded-circle shadow-sm bg-white" style="width: 32px; height: 32px;">
                                <!-- Twitter(X) -->
                                <svg v-if="update.platform === 'Twitter (X)'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="text-dark" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
                                <!-- LinkedIn -->
                                <svg v-else-if="update.platform === 'LinkedIn'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0077b5" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
                                <!-- Facebook -->
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1877F2" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
                            </div>

                            <div class="d-flex align-items-center mb-3">
                                <!-- Top Left: AR Avatar -->
                                <div class="me-3">
                                    <img :src="store.content.logoUrl || 'https://ui-avatars.com/api/?name=AR&background=1b2c57&color=fff'" class="rounded-circle shadow-sm border border-white" style="width: 48px; height: 48px;" alt="Avatar">
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
.hero-section { min-height: 90vh; background-color: #1b2c57; position: relative; padding-bottom: 5rem; }
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
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
}
.social-card:hover { 
    transform: translateY(-8px) scale(1.02); 
    box-shadow: 0 15px 30px rgba(27, 44, 87, 0.15) !important; 
}

.card-twitterx { border-top: 4px solid #000 !important; background-color: #fff; }
.card-linkedin { border-top: 4px solid #0077b5 !important; background-color: #f3f6f8; }
.card-facebook { border-top: 4px solid #1877F2 !important; background-color: #f0f2f5; }

.platform-icon-wrap svg { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }

.mission-vision-wrapper {
    position: relative;
    width: 100%;
    min-height: 450px;
    background: transparent;
    border-radius: 30px;
}

.shape-left {
    background: linear-gradient(135deg, #dfc445 0%, #bea429 100%);
    border-bottom-left-radius: 60px;
    clip-path: polygon(0 0, 64% 0, 34% 100%, 0 100%);
    z-index: 2;
    transition: transform 0.3s ease;
}

.shape-right {
    background: #f4f6fa;
    border-top-right-radius: 60px;
    clip-path: polygon(66% 0, 100% 0, 100% 100%, 36% 100%);
    z-index: 1;
    transition: transform 0.3s ease;
}

.mission-vision-wrapper:hover .shape-left { transform: translateY(-5px); }
.mission-vision-wrapper:hover .shape-right { transform: translateY(-5px); }

@media (max-width: 768px) {
    .mission-vision-wrapper { display: flex; flex-direction: column; min-height: auto; gap: 15px; }
    .shape-left, .shape-right {
        position: relative !important;
        clip-path: none !important;
        border-radius: 20px !important;
        width: 100% !important;
        height: auto !important;
    }
    .shape-left .w-50, .shape-right .w-50 { width: 100% !important; padding: 2.5rem !important; }
}

.team-card { transition: all 0.3s ease; border: 1px solid transparent !important; }
.team-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(27, 44, 87, 0.08) !important; border-color: rgba(190, 164, 41, 0.3) !important; }

.cursor-pointer { cursor: pointer; }
.read-more-text { opacity: 0; transition: opacity 0.3s; }
.team-card:hover .read-more-text { opacity: 1; }

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(27, 44, 87, 0.6); backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center; z-index: 11000;
  padding: 20px;
}
.glass-card {
  border-radius: 24px; padding: 40px 30px 30px 30px; width: 100%; max-width: 500px;
  margin-top: 50px;
}
.close-btn {
  position: absolute; top: -15px; right: -15px; background: white; border: none;
  width: 40px; height: 40px; border-radius: 50%; font-size: 24px; font-weight: bold;
  cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s;
}
.close-btn:hover { background: #f8f9fa; transform: scale(1.1); }
</style>