<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps(['serviceId']);
const router = useRouter();

const imgFailed = ref(false);

// The Full Database of Services (Now includes the "Overview" as the default)
const servicesData = [
    {
        id: 'overview',
        title: 'Our Expertise',
        desc: 'Comprehensive Advisory Solutions for East Africa',
        details: 'RA Strategic & Analytics Consulting Ltd is a multidisciplinary advisory firm. We empower organizations with data-driven insights, innovative technology, and strategic clarity. Select a pillar from the menu to explore our specific capabilities in detail.',
        features: [
            'Research, Policy & M&E Advisory', 
            'Strategic Corporate Advisory', 
            'ICT & Data Analytics Services',
            'Advanced Products & Solutions'
        ],
        icon: '<path fill-rule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/><path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>'
    },
    {
        id: 'research',
        title: 'Research, Policy & M&E Advisory',
        desc: 'Evidence That Shapes Policy, Strengthens Programmes, and Delivers Impact',
        details: 'We provide rigorous, policy-relevant research and Monitoring, Evaluation & Learning (MEL) advisory services to support evidence-based decision-making across Kenya and East Africa. Our work goes beyond data collection—we translate findings into practical insights, policy options, and actionable recommendations.',
        features: [
            'Socio-Economic & Sector Research (Baseline, Midline, Endline)', 
            'Policy Analysis & Advisory', 
            'Monitoring, Evaluation & Learning (MEL) System Design',
            'Data Collection & Field Operations (Quantitative & Qualitative)',
            'Evidence Synthesis & Knowledge Products'
        ],
        icon: '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/><path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>'
    },
    {
        id: 'ict',
        title: 'ICT & Data Analytics Services',
        desc: 'Technology that works in context. Data that informs decisions.',
        details: 'We assess, design, and implement digital systems that strengthen institutional performance and service delivery. We help organizations turn data into actionable intelligence that informs planning, policy, and performance management while ensuring data governance and privacy compliance.',
        features: [
            'Digital Systems & ICT Advisory (MIS, Automation)', 
            'Data Analytics & Decision Support (BI Dashboards, Predictive Analytics)', 
            'Monitoring, Evaluation & Learning (MEL) Digital Systems',
            'Data Governance, Privacy & Security',
            'Analytics-Driven Policy & Strategy Support'
        ],
        icon: '<path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/><path d="M6.5 7a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3z"/>'
    },
    {
        id: 'strategy',
        title: 'Strategic Corporate Advisory',
        desc: 'Clarity, Governance, and Strategy for Sustainable Growth',
        details: 'We provide Strategic Corporate Advisory services that help organizations across Kenya and East Africa strengthen governance, sharpen strategy, and improve institutional performance. Our advisory approach is grounded in evidence, informed by regional realities, and focused on delivering practical, implementable solutions.',
        features: [
            'Strategy & Strategic Plan Development', 
            'Governance & Board Advisory', 
            'Organizational Diagnostics & Restructuring',
            'Performance & Risk Management',
            'Business Model & Financial Sustainability Advisory',
            'Change Management & Capacity Building'
        ],
        icon: '<path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/><path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/>'
    },
    {
        id: 'products',
        title: 'Products and Solutions',
        desc: 'Advanced tools for deep statistical and qualitative analysis.',
        details: 'We support institutions with industry-leading analytical software. Whether you need advanced econometric modeling, impact evaluations, or structured analysis of qualitative narratives, we provide the tools to ensure your decisions are backed by rigorous data.',
        features: [
            'IBM SPSS Statistics (Advanced Statistical Analysis)', 
            'STATA (Robust Econometric and Policy Analysis)', 
            'NVivo (Qualitative Data Analysis for Deeper Insights)'
        ],
        icon: '<path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.958l-7.923 3.169a1.5 1.5 0 0 1-1.114 0l-7.923-3.169A1 1 0 0 1 0 12.162V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>'
    }
];

const currentService = computed(() => {
    // If no ID is passed, default to 'overview'
    const targetId = props.serviceId || 'overview';
    const found = servicesData.find(s => s.id === targetId);
    return found || servicesData[0];
});

const switchService = (id) => {
    if (id === 'overview') {
        router.push('/services');
    } else {
        router.push(`/services/${id}`);
    }
};

watch(() => props.serviceId, () => {
    const contentArea = document.getElementById('service-content-start');
    if (contentArea) {
        const yOffset = -120; 
        const y = contentArea.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
});
</script>

<template>
  <main class="services-page bg-light pb-5">
    
    <section class="page-header py-5 bg-navy text-white text-center">
      <div class="container py-5 mt-4">
          
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

        <h6 class="text-uppercase text-gold ls-2 mb-3" v-scroll-reveal="{ delay: 100 }">Our Solutions</h6>
        <h1 class="display-4 fw-bold mb-3" v-scroll-reveal="{ delay: 200 }">{{ currentService.title }}</h1>
        <p class="lead text-white-50 mx-auto" style="max-width: 600px;" v-scroll-reveal="{ delay: 300 }">
           {{ currentService.desc }}
        </p>
      </div>
    </section>

    <div id="service-content-start" class="container py-5">
        <div class="row g-5">
            
            <div class="col-lg-4">
                <div class="sticky-top sidebar-wrapper">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div class="card-header bg-white p-4 border-bottom">
                            <h5 class="fw-bold text-navy mb-0">Menu</h5>
                        </div>
                        <div class="list-group list-group-flush rounded-0">
                            <button 
                                v-for="service in servicesData" 
                                :key="service.id"
                                @click="switchService(service.id)"
                                class="list-group-item list-group-item-action p-4 text-muted fw-bold d-flex justify-content-between align-items-center"
                                :class="{ 'active-sidebar': currentService.id === service.id }"
                            >
                                {{ service.id === 'overview' ? 'Overview' : service.title }}
                                <svg v-if="currentService.id === service.id" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="p-4 bg-navy text-white rounded-4 text-center shadow-sm mb-4">
                        <h6 class="text-gold fw-bold mb-3">Why Choose Us?</h6>
                        <p class="small text-white-50 mb-0">
                            We combine local market knowledge with global best practices. Our solutions are tailored, secure, and built for sustainable impact.
                        </p>
                    </div>

                    <router-link to="/contact" class="btn btn-gold w-100 py-3 fw-bold shadow-sm rounded-4 d-flex align-items-center justify-content-center gap-2 btn-quote-hover">
                        Request a Quote
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                        </svg>
                    </router-link>
                </div>
            </div>

            <div class="col-lg-8 min-h-content">
                <transition name="service-fade" mode="out-in">
                    <div :key="currentService.id" class="w-100">
                        
                        <div class="card border-0 shadow-sm rounded-4 p-5 mb-4 bg-white">
                            <div class="icon-circle bg-light-gold text-gold mb-4 mx-auto mx-md-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16" v-html="currentService.icon"></svg>
                            </div>
                            <h3 class="fw-bold text-navy mb-4">
                                {{ currentService.id === 'overview' ? 'Institution Overview' : 'Service Overview' }}
                            </h3>
                            <p class="text-muted lh-lg" style="font-size: 1.1rem;">
                                {{ currentService.details }}
                            </p>
                        </div>

                        <div class="card border-0 shadow-sm rounded-4 p-5 bg-white">
                            <h4 class="fw-bold text-navy mb-4 border-bottom pb-3">
                                {{ currentService.id === 'overview' ? 'Our Key Pillars' : 'Core Deliverables' }}
                            </h4>
                            <ul class="list-unstyled d-flex flex-column gap-3">
                                <li v-for="(feature, index) in currentService.features" :key="index" class="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#bea429" class="flex-shrink-0 mt-1" viewBox="0 0 16 16">
                                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                    </svg>
                                    <span class="text-dark fw-bold">{{ feature }}</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </transition>
            </div>

        </div>
    </div>
  </main>
</template>

<style scoped>
/* STRICT COLORS */
.bg-navy { background-color: #1b2c57 !important; }
.text-navy { color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; }
.bg-gold { background-color: #bea429 !important; }
.bg-light-gold { background-color: rgba(190, 164, 41, 0.1); }
.border-gold { border-color: #bea429 !important; }
.ls-2 { letter-spacing: 2px; }

/* HEADER LOGO */
.header-logo {
    width: 150px; height: 150px; 
    border-radius: 50%; overflow: hidden; background-color: white; 
    border: 3px solid #bea429; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    transition: transform 0.4s ease;
}
.header-logo:hover { transform: scale(1.05); }
.banner-logo-img { width: 100%; height: 100%; object-fit: cover; }
.banner-logo-svg { width: 100%; height: 100%; }

/* STICKY SIDEBAR */
.sidebar-wrapper { top: 120px; } /* Pushed down to clear glassy navbar */

/* SIDEBAR THEME */
.active-sidebar {
    background-color: #1b2c57 !important; color: white !important; border-color: #1b2c57 !important;
}
.list-group-item { transition: all 0.2s ease; border: none; border-bottom: 1px solid rgba(0,0,0,0.05); }
.list-group-item-action:hover:not(.active-sidebar) { background-color: #f8f9fa; color: #bea429 !important; padding-left: 25px; }

/* BUTTONS */
.btn-gold { background-color: #bea429; color: #1b2c57; border: none; }
.btn-quote-hover { transition: all 0.3s ease; }
.btn-quote-hover:hover { background-color: #a38c22; color: white; transform: translateY(-3px); }

/* CONTENT */
.min-h-content { min-height: 600px; } /* Prevents layout collapse during transition */
.icon-circle { width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

/* TRANSITIONS */
.service-fade-enter-active, .service-fade-leave-active { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
.service-fade-enter-from { opacity: 0; transform: translateX(20px); }
.service-fade-leave-to { opacity: 0; transform: translateX(-20px); }

@media (max-width: 768px) { .header-logo { width: 120px; height: 120px; } }
</style>