<script setup>
import { computed } from 'vue';
import { store } from '../store';
import { useRouter, useRoute } from 'vue-router'; 

const router = useRouter();
const route = useRoute(); 
const currentYear = computed(() => new Date().getFullYear());

const handleAdminClick = () => {
  if (store.isAdmin) {
    router.push('/admin');
  } else {
    store.openModal();
  }
};
</script>

<template>
  <footer class="bg-navy text-white pt-5 pb-3 mt-auto position-relative" style="z-index: 100;">
    <div class="container">
      
      <div v-if="route.path !== '/contact'" class="text-center mb-5 pb-4 border-bottom border-white-10">
          <h3 class="fw-bold text-white mb-3">Want to participate in the research?</h3>
          <p class="text-white-50 mb-4" style="max-width: 600px; margin: 0 auto;">
              Complete the pilot survey to earn 20 KES airtime and join the movement.
          </p>
          <a :href="store.content.qualtricsLink" target="_blank" class="btn btn-gold rounded-pill px-5 py-3 fw-bold shadow-lg hover-scale">
              Take Pilot Survey
          </a>
      </div>

      <div class="row g-4 mt-2">
        
        <div class="col-lg-4 col-md-6">
          <h5 class="fw-bold mb-3 d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#bea429" viewBox="0 0 16 16">
               <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
            </svg>
            <span class="text-white">AI Readiness</span>
          </h5>
          <p class="text-white-50 small mb-4 pe-lg-4">
            Measuring the impact of AI in educational institutions and rapidly evolving labor markets across East Africa.
          </p>
          
          <div class="d-flex gap-3">
            <a href="#" class="social-icon" aria-label="LinkedIn">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
            </a>
            <a href="#" class="social-icon" aria-label="Twitter X">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
            </a>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <h6 class="fw-bold text-gold mb-3">Quick Links</h6>
          <ul class="list-unstyled d-flex flex-column gap-2 small">
            <li><router-link to="/" class="footer-link">Home</router-link></li>
            <li><router-link to="/about" class="footer-link">About Research</router-link></li>
            <li><router-link to="/careers" class="footer-link">Get Involved</router-link></li>
            <li><router-link to="/insights" class="footer-link">Insights & Findings</router-link></li>
            <li>
                <a href="#" @click.prevent="handleAdminClick" class="footer-link text-white-50">
                    Administration
                </a>
            </li>
          </ul>
        </div>

        <div class="col-lg-4 col-md-6">
           <h6 class="fw-bold text-gold mb-3">Contact</h6>
           <ul class="list-unstyled d-flex flex-column gap-2 small">
             <li>
                <a href="mailto:feisalsdindi4@gmail.com" class="footer-link">feisalsdindi4@gmail.com</a>
             </li>
             <li>
                <a :href="`tel:${store.content.phoneNumber}`" class="footer-link">{{ store.content.phoneNumber }}</a>
             </li>
             <li>
                <a :href="store.content.whatsappLink" target="_blank" class="footer-link">Join our WhatsApp Community</a>
             </li>
           </ul>
        </div>

      </div>
      <hr class="border-secondary my-4 opacity-25">
      <div class="text-center small text-white-50">
        &copy; {{ currentYear }} AI Readiness Project. All Rights Reserved.
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 1. STRICT COLORS (No old blues/golds here) */
.bg-navy { background-color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; } 

.btn-gold {
    background-color: #bea429 !important;
    color: #1b2c57 !important;
    border: none;
    transition: all 0.3s ease;
}
.btn-gold:hover {
    background-color: #a38c22 !important; 
    color: white !important;
    transform: translateY(-3px);
}

.border-white-10 { border-color: rgba(255, 255, 255, 0.1) !important; }

/* 2. SOCIAL ICONS FIX - White Hover with Navy text */
.social-icon {
  width: 36px; height: 36px;
  background-color: rgba(255, 255, 255, 0.05);
  color: white; 
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* This guarantees it turns White, not Gold */
.social-icon:hover {
  background-color: white !important;
  color: #1b2c57 !important; 
  transform: translateY(-3px);
  border-color: white !important;
}

/* 3. LINKS FIX */
.footer-link {
  color: rgba(255, 255, 255, 0.7); 
  text-decoration: none; 
  transition: all 0.2s ease; 
  cursor: pointer;
  display: inline-block; 
}
.footer-link:hover { 
  color: #bea429 !important; 
  padding-left: 5px; 
}

.hover-scale:hover { transform: scale(1.05); }
</style>