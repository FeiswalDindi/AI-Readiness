<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store'; 

const router = useRouter();
const user = computed(() => store.user);

const handleReadStory = () => {
    if (user.value) {
        store.trackActivity("Content Access", "User unlocked 'Who We Are' section");
        router.push('/about');
    } else {
        store.openModal();
    }
};
</script>

<template>
  <section class="strategic-section py-5">
    <div class="container py-4">
      <div class="row align-items-center">
        
        <div class="col-lg-6 mb-5 mb-lg-0 pe-lg-5" v-scroll-reveal>
          <h6 class="text-uppercase ls-2 text-gold mb-2 fw-bold">Our Foundation</h6>
          <h2 class="display-5 fw-bold mb-4 text-navy">Sustainable Impact, Strategic Insights.</h2>
          
          <div class="content-locker position-relative" :class="{ 'locked': !user }">
              
              <div class="mb-4">
                  <h5 class="fw-bold text-navy">Our Mission</h5>
                  <p class="text-muted lh-lg">
                      To empower organizations across Eastern Africa with data-driven insights, innovative technology, and strategic clarity to achieve sustainable growth and impact.
                  </p>
              </div>

              <div>
                  <h5 class="fw-bold text-navy">Our Vision</h5>
                  <p class="text-muted lh-lg">
                      To be the premier advisory firm driving institutional excellence and transformative change in the region.
                  </p>
              </div>
              
              <div class="fade-overlay" v-if="!user"></div>
          </div>

          <button @click="handleReadStory" class="btn btn-navy mt-4 px-4 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2">
              <svg v-if="!user" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>
              <span>{{ user ? 'Read Our Full Story' : 'Log in to Read More' }}</span>
          </button>

        </div>

        <div class="col-lg-6" v-scroll-reveal="{ delay: 200 }">
          <div class="position-relative">
            <div class="position-absolute top-0 end-0 bg-grid opacity-10 w-75 h-100 rounded-4 z-0 translate-middle-y mt-5"></div>
            
            <div class="mv-card bg-navy text-white shadow-lg position-relative z-1 mb-4">
                <div class="icon-wrap text-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>
                </div>
                <div>
                    <h5 class="fw-bold mb-2">Evidence-Based</h5>
                    <p class="small text-white-50 mb-0">We combine rigorous analytics with local market knowledge to deliver tailored solutions.</p>
                </div>
            </div>

            <div class="mv-card bg-white border shadow-sm position-relative z-1 ms-lg-5">
                <div class="icon-wrap text-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>
                </div>
                <div>
                    <h5 class="fw-bold text-navy mb-2">Trusted Partner</h5>
                    <p class="small text-muted mb-0">We work closely with leadership as long-term strategic partners for institutions that matter.</p>
                </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* STRICT COLORS */
.text-navy { color: #1b2c57 !important; }
.bg-navy { background-color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; }
.bg-gold { background-color: #bea429 !important; }

.strategic-section { overflow: hidden; transform: translateZ(0); }
.ls-2 { letter-spacing: 2px; font-size: 0.8rem; }

.btn-navy { background-color: #1b2c57; color: white; border: none; transition: 0.3s; }
.btn-navy:hover { background-color: #bea429; color: #1b2c57; transform: translateY(-2px); }

/* --- CONTENT LOCKER STYLES --- */
.content-locker { transition: all 0.5s ease; }
.content-locker.locked { max-height: 120px; overflow: hidden; }

.fade-overlay {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 80px;
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
    pointer-events: none;
}

/* --- CARDS --- */
.mv-card {
    padding: 2rem; border-radius: 16px;
    display: flex; align-items: flex-start; gap: 1.5rem;
    transition: transform 0.3s ease;
}
.mv-card:hover { transform: translateX(-10px); }

.bg-grid {
    background-image: radial-gradient(#1b2c57 2px, transparent 2px);
    background-size: 30px 30px;
}
.opacity-10 { opacity: 0.05; }
</style>