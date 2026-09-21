<script setup>
import { computed } from 'vue';
import { store } from '../store'; // Global store to check login

// Check if user is logged in
const isLocked = computed(() => !store.user);

const handleUnlock = () => {
    store.openModal(); // Trigger the Login Modal
};
</script>

<template>
  <section class="org-section py-5">
    <div class="container">
      
      <div class="row justify-content-center mb-5" v-scroll-reveal>
        <div class="col-lg-8 text-center">
            <h6 class="text-uppercase ls-2 text-muted mb-2">Our Governance</h6>
            <h2 class="display-5 fw-bold text-primary">Organizational Structure</h2>
            <div class="divider mx-auto mt-3"></div>
        </div>
      </div>

      <div class="chart-container" :class="{ 'locked-state': isLocked }" v-scroll-reveal="{ delay: 200 }">
        
        <div class="org-chart">
            
            <div class="level-1">
                <div class="org-card board-card">RA_SAC Ltd Board</div>
                <div class="connector-vertical"></div>
            </div>

            <div class="level-2">
                <div class="org-card ceo-card">Chief Executive Officer</div>
                <div class="connector-vertical"></div>
            </div>

            <div class="level-3-wrapper">
                <div class="connector-horizontal"></div>

                <div class="row justify-content-center w-100 g-0">
                    
                    <div class="col-md-6 d-flex flex-column align-items-center relative-box">
                        <div class="connector-vertical-top"></div>
                        <div class="org-card director-card mb-4">Director Consultancy Services</div>
                        
                        <div class="sub-branch">
                            <div class="connector-vertical-short"></div>
                            <div class="sub-grid">
                                <div class="org-card sub-card">Research & Policy Advisory Lead</div>
                                <div class="org-card sub-card">ICT & Data Analytics Lead</div>
                                <div class="org-card sub-card">Strategic Corporate Advisory Lead</div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 d-flex flex-column align-items-center relative-box">
                        <div class="connector-vertical-top"></div>
                        <div class="org-card director-card mb-4">Chief Operations Officer</div>

                        <div class="sub-branch">
                            <div class="connector-vertical-short"></div>
                            <div class="sub-grid">
                                <div class="org-card sub-card">Finance & Administration</div>
                                <div class="org-card sub-card">Human Capital</div>
                                <div class="org-card sub-card">Corporate Affairs</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div v-if="isLocked" class="blur-overlay">
            <div class="lock-content text-center">
                <div class="icon-lock mb-3">🔒</div>
                <h4 class="fw-bold text-primary">Restricted Access</h4>
                <p class="text-muted mb-4">Please log in to view the detailed organizational hierarchy.</p>
                <button @click="handleUnlock" class="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-lg">
                    Log In to View Structure
                </button>
            </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.org-section {
    background-color: #f8f9fa;
    background-image: radial-gradient(#e0e0e0 1px, transparent 1px);
    background-size: 20px 20px;
}

.text-primary { color: #1a2b49 !important; }
.divider { width: 60px; height: 3px; background: #1a2b49; }

/* LOCK & BLUR STYLES */
.chart-container { position: relative; padding: 20px; }
.locked-state .org-chart {
    filter: blur(8px); /* BLURS THE CONTENT */
    opacity: 0.6;
    pointer-events: none;
    user-select: none;
}
.blur-overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center; z-index: 10;
    background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 50%, #fff 100%);
}
.icon-lock { font-size: 3rem; }
.btn-primary { background: #1a2b49; border: none; }

/* CHART STYLES */
.org-card {
    background: white; border: 1px solid #1a2b49; padding: 15px 25px;
    text-align: center; border-radius: 4px; box-shadow: 0 4px 15px rgba(26, 43, 73, 0.08);
    position: relative; z-index: 2; min-width: 200px; font-weight: 600; color: #1a2b49;
}
.board-card { border-top: 4px solid #1a2b49; text-transform: uppercase; }
.ceo-card { border-left: 4px solid #bea429; }
.director-card { background: #1a2b49; color: white; min-width: 240px; }
.sub-card { font-size: 0.9rem; padding: 10px 15px; min-width: 100%; border: 1px solid #dee2e6; border-left: 3px solid #1a2b49; }

/* CONNECTORS */
.connector-vertical { width: 2px; height: 30px; background: #1a2b49; margin: 0 auto; }
.connector-vertical-top { width: 2px; height: 20px; background: #1a2b49; }
.connector-vertical-short { width: 2px; height: 15px; background: #1a2b49; margin: 0 auto; }
.level-1, .level-2 { display: flex; flex-direction: column; align-items: center; }
.level-3-wrapper { position: relative; width: 100%; }
.connector-horizontal { position: absolute; top: 0; left: 25%; right: 25%; height: 2px; background: #1a2b49; z-index: 1; }
.sub-grid { display: flex; flex-direction: column; gap: 10px; width: 250px; position: relative; }
.sub-grid::before {
    content: ''; position: absolute; left: 50%; top: -15px; bottom: 0;
    width: 2px; background: rgba(26, 43, 73, 0.2); z-index: -1; transform: translateX(-50%);
}
.sub-branch { display: flex; flex-direction: column; align-items: center; }

@media (max-width: 768px) {
    .connector-horizontal { display: none; }
    .connector-vertical-top { display: none; }
    .col-md-6 { margin-bottom: 40px; }
}
</style>