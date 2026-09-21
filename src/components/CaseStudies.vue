<script setup>
import { ref } from 'vue';

// PRO DATA STRUCTURE: Replaced Emojis with SVG Paths
const cases = ref([
    {
        client: 'CONFIDENTIAL',
        category: 'Strategy & Governance',
        title: 'Institutional Strategic Planning',
        result: '5-Year Strategic Roadmap',
        summary: 'Developed a comprehensive strategic plan to enhance operational efficiency and academic growth.',
        icon: "M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z M8 8.46 1.758 5.965 8 3.052l6.242 2.913L8 8.46Z" 
    },
    {
        client: 'CONFIDENTIAL',
        category: 'Research & Policy',
        title: 'Socio-Economic Impact Assessment',
        result: 'Data-Driven Policy Shift',
        summary: 'Conducted baseline and end-line studies to measure the impact of development programs in the region.',
        icon: "M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z"
    },
    {
        client: 'CONFIDENTIAL',
        category: 'Corporate Advisory',
        title: 'Operational Restructuring',
        result: '30% Efficiency Increase',
        summary: 'Streamlined internal processes and implemented a new performance management system.',
        icon: "M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.86z"
    }
]);
</script>

<template>
  <section class="case-studies-section py-5">
    <div class="container">
      
      <div class="row justify-content-center text-center mb-5" v-scroll-reveal>
        <div class="col-lg-8">
            <h6 class="text-uppercase text-gold ls-2 fw-bold">Our Impact</h6>
            <h2 class="display-6 fw-bold text-navy">Recent Case Studies</h2>
            <div class="divider mx-auto mt-3 bg-gold"></div>
            <p class="text-muted mt-3">
                See how we deliver measurable value to our partners.
            </p>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-4 col-md-6" v-for="(item, index) in cases" :key="index" v-scroll-reveal="{ delay: index * 100 }">
            <div class="case-card h-100 bg-white p-4 rounded-3 shadow-sm position-relative overflow-hidden">
                
                <span class="badge bg-light text-navy mb-3 px-3 py-2 rounded-pill small fw-bold border">
                    {{ item.category }}
                </span>

                <h4 class="fw-bold mb-2 text-navy">{{ item.title }}</h4>
                <h6 class="text-muted text-uppercase small mb-3 border-bottom pb-3">
                    Client: {{ item.client }}
                </h6>

                <p class="text-muted mb-4">{{ item.summary }}</p>

                <div class="result-box bg-navy p-3 rounded-3 text-center">
                    <small class="text-white-50 text-uppercase ls-2 d-block mb-1">Key Result</small>
                    <span class="fw-bold fs-5 text-gold">{{ item.result }}</span>
                </div>

                <div class="hover-icon text-navy opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16">
                        <path :d="item.icon" />
                    </svg>
                </div>
            </div>
        </div>
      </div>

      <div class="text-center mt-5">
        <router-link to="/services" class="btn btn-navy-outline rounded-pill px-5 fw-bold py-3">
            View All Services
        </router-link>
      </div>

    </div>
  </section>
</template>

<style scoped>
.case-studies-section { background-color: #ffffff; }

/* STRICT COLOR PALETTE */
.text-navy { color: #1b2c57 !important; }
.bg-navy { background-color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; } 
.bg-gold { background-color: #bea429 !important; }

.ls-2 { letter-spacing: 2px; font-size: 0.75rem; font-weight: 700; }
.divider { width: 60px; height: 3px; }

.btn-navy-outline { border: 2px solid #1b2c57; color: #1b2c57; background: transparent; transition: all 0.3s ease; }
.btn-navy-outline:hover { background: #1b2c57; color: #ffffff; transform: translateY(-3px); }

.case-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    border: 1px solid #e9ecef; z-index: 1; border-top: 4px solid transparent; 
}
.case-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(190, 164, 41, 0.15); 
    border-color: #bea429; 
    border-top: 4px solid #bea429;
}

.hover-icon {
    position: absolute; bottom: -20px; right: -20px; width: 120px; height: 120px;
    opacity: 0.03; transform: rotate(-15deg); transition: transform 0.5s ease, opacity 0.5s ease;
    z-index: -1; color: #1b2c57; 
}
.case-card:hover .hover-icon {
    transform: rotate(0deg) scale(1.1);
    opacity: 0.1; color: #bea429; 
}
</style>