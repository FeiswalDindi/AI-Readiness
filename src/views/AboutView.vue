<script setup>
import { ref } from 'vue';
import { store } from '../store'; 
import OrgStructure from '../components/OrgStructure.vue';
import Clients from '../components/Clients.vue';
import Values from '../components/Values.vue';

// Tracks if the favicon.jpeg fails to load
const imgFailed = ref(false);
</script>

<template>
  <main class="about-page">
    
    <section class="page-header py-5 bg-navy text-white">
      <div class="container py-5 text-center">
        
        <div class="header-logo mx-auto mb-4" v-scroll-reveal>
            <img 
                v-if="!imgFailed" 
                src="/favicon.jpeg" 
                alt="RA Logo" 
                @error="imgFailed = true" 
                class="banner-logo-img"
            >
            <svg v-else class="banner-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" fill="#1b2c57" stroke="#bea429" stroke-width="4"/>
                <path d="M35 65 L50 25 L65 65 M40 50 L60 50" stroke="#bea429" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>

        <h1 class="display-3 fw-bold mb-3" v-scroll-reveal="{ delay: 100 }">About RA Consulting</h1>
        <p class="lead text-white-50 mx-auto" style="max-width: 700px;" v-scroll-reveal="{ delay: 200 }">
          A multidisciplinary advisory firm offering comprehensive solutions in strategy development, research, policy analysis, and ICT systems.
        </p>
      </div>
    </section>

    <section class="py-5">
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
             <h6 class="text-uppercase text-gold ls-2 mb-3">Who We Are</h6>
             
             <h2 class="display-5 fw-bold mb-4 text-navy">{{ store.content.about.title }}</h2>
             
             <p class="text-muted mb-3" style="white-space: pre-line;">
               {{ store.content.about.text }}
             </p>
             
          </div>
          <div class="col-lg-6">
             <div class="bg-light rounded-4 p-5 text-center border d-flex align-items-center justify-content-center position-relative overflow-hidden" style="min-height: 350px;">
                <div class="text-muted z-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#bea429" class="mb-3 opacity-50" viewBox="0 0 16 16">
                      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                      <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                    </svg>
                    <span class="d-block small fw-bold text-navy text-uppercase ls-2">Institutional Excellence</span>
                </div>
                <div class="position-absolute top-0 start-0 w-100 h-100 opacity-05 bg-grid"></div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <Values />
    <OrgStructure />
    <Clients />

  </main>
</template>

<style scoped>
/* STRICT COLORS */
.bg-navy { background-color: #1b2c57 !important; }
.text-navy { color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; }

.ls-2 { letter-spacing: 2px; font-weight: 700; font-size: 0.85rem; }

.bg-grid {
    background-image: radial-gradient(#1b2c57 1px, transparent 1px);
    background-size: 20px 20px;
}
.opacity-05 { opacity: 0.05; }

/* NEW HEADER LOGO STYLES */
.header-logo {
    width: 180px; /* Adjust this to make it bigger/smaller */
    height: 180px; /* Keep this equal to width for a perfect circle */
    border-radius: 50%;
    overflow: hidden;
    background-color: white; /* Fallback background just in case */
    border: 3px solid #bea429; /* Nice gold border framing the logo */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    transition: transform 0.4s ease;
}

.header-logo:hover {
    transform: scale(1.05); /* Slight pop when hovered */
}

.banner-logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Fills the circle nicely */
}

.banner-logo-svg {
    width: 100%;
    height: 100%;
}

@media (max-width: 768px) {
    .header-logo {
        width: 140px;
        height: 140px;
    }
}
</style>