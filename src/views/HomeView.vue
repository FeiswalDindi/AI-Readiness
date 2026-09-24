<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { store } from '../store';

const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timerInterval;

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
});

onUnmounted(() => {
    clearInterval(timerInterval);
});
</script>

<template>
  <main>
    <!-- HERO / LANDING SECTION -->
    <header class="hero-section text-white d-flex align-items-center position-relative overflow-hidden">
        <div class="overlay"></div>
        <div class="container position-relative z-2 pt-5 mt-5">
            <div class="row align-items-center g-5">
                
                <!-- Left: Info & Actions -->
                <div class="col-lg-6 text-center text-lg-start">
                    <h1 class="display-4 fw-bold mb-4 animate-title text-white">
                        {{ store.content.about.title }}
                    </h1>
                    <p class="lead mb-4 opacity-75 fs-5 animate-subtitle pe-lg-4">
                        {{ store.content.about.text }}
                    </p>
                    
                    <div class="d-flex flex-column flex-sm-row gap-3 mt-4 animate-buttons w-100">
                        <a :href="store.content.qualtricsLink" target="_blank" class="btn btn-gold btn-lg px-4 py-3 rounded-pill fw-bold shadow-lg">
                            Take Pilot Survey
                        </a>
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

                        <!-- Conditionally render poster if it exists in store -->
                        <div v-if="store.content.posterUrl" class="poster-container rounded overflow-hidden shadow">
                            <img :src="store.content.posterUrl" class="img-fluid" alt="Project Poster" />
                        </div>
                        <div v-else class="poster-placeholder rounded p-4 border border-secondary border-dashed">
                            <p class="text-white-50 mb-0 small">Official Project Poster Pending</p>
                        </div>
                    </div>
                </div>

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