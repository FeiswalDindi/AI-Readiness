<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const services = [
    {
        title: 'Research, Policy & M&E Advisory',
        description: 'Rigorous research, policy analysis, and MEL systems for evidence-based decision-making.',
        path: '/services/research',
        // SVG: Document/Search
        icon: '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/><path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>'
    },
    {
        title: 'Strategic Corporate Advisory',
        description: 'Governance frameworks, organizational restructuring, and strategy for sustainable growth.',
        path: '/services/strategy',
        // SVG: Compass/Strategy
        icon: '<path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/><path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/>'
    },
    {
        title: 'ICT & Data Analytics Services',
        description: 'Digital systems, business intelligence, and data governance for institutional performance.',
        path: '/services/ict',
        // SVG: Computer/Analytics
        icon: '<path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/><path d="M6.5 7a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3z"/>'
    },
    {
        title: 'Products and Solutions',
        description: 'Advanced tools including IBM SPSS, STATA, and NVivo for deep data analysis.',
        path: '/services/products',
        // SVG: Software Box
        icon: '<path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.958l-7.923 3.169a1.5 1.5 0 0 1-1.114 0l-7.923-3.169A1 1 0 0 1 0 12.162V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>'
    }
];

const navigateTo = (path) => {
    router.push(path);
    window.scrollTo(0, 0);
};
</script>

<template>
  <section class="py-5 bg-light-navy border-bottom">
    <div class="container py-4">
      
      <div class="row justify-content-center text-center mb-5" v-scroll-reveal>
        <div class="col-lg-8">
            <h4 class="text-uppercase text-gold ls-2 fw-bold mb-2">Our Services</h4>
            <h2 class="display-6 fw-bold text-navy">Comprehensive Advisory Solutions</h2>
            <div class="divider mx-auto mt-4 bg-gold"></div>
        </div>
      </div>

      <div class="row g-4">
          <div class="col-md-6 col-xl-3" v-for="(service, index) in services" :key="index" v-scroll-reveal="{ delay: index * 100 }">
              <div @click="navigateTo(service.path)" class="card h-100 border-0 shadow-sm service-card bg-white position-relative overflow-hidden">
                  
                  <div class="position-absolute top-0 start-0 w-100 bg-gold" style="height: 4px;"></div>

                  <div class="card-body p-4 text-center d-flex flex-column">
                      
                      <div class="icon-circle bg-light text-navy mx-auto mb-4 mt-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" v-html="service.icon"></svg>
                      </div>

                      <h5 class="fw-bold text-navy mb-3">{{ service.title }}</h5>
                      <p class="text-muted small mb-4 flex-grow-1">
                          {{ service.description }}
                      </p>

                      <div class="text-gold fw-bold small d-flex align-items-center justify-content-center gap-2 mt-auto service-link">
                          Explore Capability
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                          </svg>
                      </div>
                  </div>
              </div>
          </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* COLORS */
.text-navy { color: #1b2c57 !important; }
.bg-navy { background-color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; } 
.bg-gold { background-color: #bea429 !important; }
.bg-light-navy { background-color: #F8FAFC; } 

.divider { width: 60px; height: 3px; }
.ls-2 { letter-spacing: 2px; font-size: 0.8rem; }

/* CARD STYLING */
.service-card {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    border: 1px solid rgba(27, 44, 87, 0.05) !important;
}

.service-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 15px 30px rgba(190, 164, 41, 0.15) !important;
    border-color: #bea429 !important;
}

.icon-circle {
    width: 60px; height: 60px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
}

.service-card:hover .icon-circle {
    background-color: #1b2c57 !important;
    color: white !important;
    transform: scale(1.1);
}

.service-link { transition: all 0.3s ease; }
.service-card:hover .service-link { gap: 10px !important; color: #1b2c57 !important; }
</style>