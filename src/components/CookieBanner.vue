<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showConsent = ref(false);
const isScrolled = ref(false);

const handleScroll = () => {
  // If user scrolls down more than 100px, make it glassy
  isScrolled.value = window.scrollY > 100;
};

onMounted(() => {
  const accepted = localStorage.getItem('cookiesAccepted');
  if (!accepted) {
    showConsent.value = true;
  }
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const accept = () => {
  localStorage.setItem('cookiesAccepted', 'true');
  showConsent.value = false;
};
</script>

<template>
  <transition name="slide-up">
    <div 
        v-if="showConsent" 
        class="cookie-banner"
        :class="{ 'glassy-mode': isScrolled }"
    >
      <div class="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <div class="d-flex align-items-center gap-3">
            <div class="d-none d-md-block text-gold">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-3zm1-10a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-2z"/>
                  <path d="M9.696 1.255A8 8 0 0 1 12 12.5c-.322.257-.594.577-.77 1H2.5a.5.5 0 0 1-.5-.5V8a5 5 0 0 1 5-5h2.196z"/>
                </svg>
            </div>
            <p class="mb-0 text-white small">
              We use cookies to improve your experience. By continuing, you agree to our use of cookies.
            </p>
        </div>
        
        <div class="d-flex gap-2 w-100 w-md-auto">
          <button @click="accept" class="btn btn-sm btn-light fw-bold px-4 rounded-pill flex-fill">Accept</button>
          <button @click="showConsent = false" class="btn btn-sm btn-outline-light rounded-pill flex-fill">Close</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.cookie-banner {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  width: 90%; max-width: 900px;
  
  /* DEFAULT: Solid Navy */
  background: #1a2b49; 
  
  padding: 15px 20px; border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 9999;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.5s ease;
}

/* SCROLLED STATE: Glassy Transparent */
.glassy-mode {
    background: rgba(26, 43, 73, 0.6); /* Transparent Navy */
    backdrop-filter: blur(12px); 
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.text-gold { color: #c5a059; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.5s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translate(-50%, 100px); opacity: 0; }
</style>