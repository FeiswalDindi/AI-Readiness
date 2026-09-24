<script setup>
import { ref } from 'vue';
import { store } from '../store'; 

const selectedMember = ref(null);

const openMemberModal = (member) => {
    selectedMember.value = member;
};

const closeMemberModal = () => {
    selectedMember.value = null;
};
</script>

<template>
  <main class="about-page bg-light min-vh-100">
    
    <section class="page-header py-5 bg-navy text-white text-center" 
             style="padding-top: 120px !important;"
             :style="store.content.pageBackgrounds?.about ? `background-image: linear-gradient(rgba(27, 44, 87, 0.85), rgba(27, 44, 87, 0.95)), url(${store.content.pageBackgrounds.about}); background-size: cover; background-position: center;` : ''"
    >
      <div class="container py-5 mt-4">
        <h1 class="display-3 fw-bold mb-3">About The Research</h1>
        <p class="lead text-white-50 mx-auto" style="max-width: 800px;">
          Understanding the intersection of Artificial Intelligence, Higher Education, and the rapidly evolving labor markets in East Africa.
        </p>
      </div>
    </section>

    <section class="py-5 bg-white">
      <div class="container py-5">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
             <h6 class="text-uppercase text-gold ls-2 mb-3 fw-bold">Project Context</h6>
             <h2 class="display-5 fw-bold mb-4 text-navy">{{ store.content.about.title }}</h2>
             
             <p class="text-muted mb-4 lead" style="line-height: 1.8; white-space: pre-wrap;">
                {{ store.content.about.text }}
             </p>
          </div>
          <div class="col-lg-6">
             <div class="bg-light-navy rounded-4 p-5 border position-relative overflow-hidden h-100 d-flex flex-column justify-content-center shadow-sm">
                <div class="z-2 position-relative">
                    <h4 class="fw-bold text-navy mb-4 border-bottom pb-3">Key Research Areas</h4>
                    
                    <div class="d-flex align-items-start gap-3 mb-4">
                        <div class="icon-box bg-white text-gold rounded-circle shadow-sm border border-light">
                            <i class="fw-bold">1</i>
                        </div>
                        <div>
                            <h6 class="fw-bold text-navy mb-1">Job Search Efficiency</h6>
                            <p class="text-muted small mb-0">How AI tools enhance the job search process for recent graduates.</p>
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-start gap-3 mb-4">
                        <div class="icon-box bg-white text-gold rounded-circle shadow-sm border border-light">
                            <i class="fw-bold">2</i>
                        </div>
                        <div>
                            <h6 class="fw-bold text-navy mb-1">Market Readiness</h6>
                            <p class="text-muted small mb-0">Measuring the gap between current academic training and AI-driven market demands.</p>
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-start gap-3">
                        <div class="icon-box bg-white text-gold rounded-circle shadow-sm border border-light">
                            <i class="fw-bold">3</i>
                        </div>
                        <div>
                            <h6 class="fw-bold text-navy mb-1">Curriculum Design</h6>
                            <p class="text-muted small mb-0">Implications for local institutions to improve syllabus and program offerings.</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- RESEARCH ADMINISTRATORS -->
    <section id="leadership" class="py-5 bg-light-navy border-top">
        <div class="container py-5 text-center">
            <h6 class="text-gold fw-bold ls-2 mb-2 text-uppercase">The People Behind The Project</h6>
            <h2 class="fw-bold text-navy mb-5 display-6">Our Research Team</h2>
            
            <div class="row g-4 justify-content-center">
                <div class="col-md-6 col-lg-4" v-for="member in store.content.team" :key="member.name">
                    <div 
                        class="card h-100 border-0 shadow-sm text-center team-card p-4 cursor-pointer rounded-0"
                        @click="openMemberModal(member)"
                    >
                        <img :src="member.imageUrl || `https://ui-avatars.com/api/?name=${(member.name.includes('Khan Ul') || member.name.includes('Carn Ul')) ? 'U+K' : encodeURIComponent(member.name)}&background=1b2c57&color=fff&size=128`" class="rounded-circle mx-auto mb-3 shadow" style="width:120px; height:120px; object-fit: cover;" alt="Avatar">
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
            <div class="glass-card bg-white position-relative shadow-lg border-0 rounded-0" style="border-radius: 0 !important;">
                <button class="close-btn text-navy shadow-sm border rounded-0" style="border-radius: 0 !important;" @click="closeMemberModal">×</button>
                
                <div class="text-center mb-4">
                    <img :src="selectedMember.imageUrl || `https://ui-avatars.com/api/?name=${(selectedMember.name.includes('Khan Ul') || selectedMember.name.includes('Carn Ul')) ? 'U+K' : encodeURIComponent(selectedMember.name)}&background=1b2c57&color=fff&size=128`" class="rounded-0 shadow-lg mb-3 border border-4 border-white" style="width: 150px; height: 150px; object-fit: cover; margin-top: -80px;">
                    <h3 class="fw-bold text-navy mb-1">{{ selectedMember.name }}</h3>
                    <h6 class="text-gold fw-bold text-uppercase ls-1 mb-4">{{ selectedMember.role }}</h6>
                    
                    <div class="bg-light-navy p-4 rounded-0 text-start border position-relative overflow-hidden">
                        <svg class="position-absolute" style="top:-20px; right:-20px; opacity: 0.04; pointer-events: none;" xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="#1b2c57" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/></svg>
                        <div class="text-muted mb-0 lh-lg position-relative z-2" style="white-space: pre-wrap;" v-html="selectedMember.description || 'No description provided.'"></div>
                    </div>
                </div>
                
                <button @click="closeMemberModal" class="btn btn-navy w-100 rounded-0 py-3 fw-bold mt-2">Close Profile</button>
            </div>
        </div>
    </transition>

  </main>
</template>

<style scoped>
/* STRICT COLORS */
.bg-navy { background-color: #1b2c57 !important; }
.btn-navy { background-color: #1b2c57 !important; color: white; transition: 0.3s; }
.btn-navy:hover { background-color: #121e3a !important; transform: translateY(-2px); }
.bg-light-navy { background-color: #f4f6fa !important; }
.text-navy { color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; }

.ls-2 { letter-spacing: 2px; }
.ls-1 { letter-spacing: 1px; }

.icon-box {
    min-width: 45px; height: 45px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
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

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>