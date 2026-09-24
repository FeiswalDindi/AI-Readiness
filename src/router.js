import { createRouter, createWebHistory } from 'vue-router';

// --- IMPORT VIEWS ---
import HomeView from './views/HomeView.vue';
import DashboardView from './views/DashboardView.vue';
import ContactView from './views/ContactView.vue';
import AboutView from './views/AboutView.vue'; 
import CareersView from './views/CareersView.vue';
import InsightsView from './views/InsightsView.vue';
import AdminDashboardView from './views/AdminDashboardView.vue';
import FocusAreaView from './views/FocusAreaView.vue';

const routes = [
    { 
        path: '/focus/:area', 
        name: 'focus',
        component: FocusAreaView,
        meta: { title: 'Project Focus | AI Readiness Project' }
    },
    { 
        path: '/', 
        name: 'home',
        component: HomeView,
        meta: { title: 'Home | AI Readiness Project' } 
    },
    { 
        path: '/about', 
        name: 'about',
        component: AboutView,
        meta: { title: 'About Research | AI Readiness Project' }
    },
    { 
        path: '/contact', 
        name: 'contact',
        component: ContactView,
        meta: { title: 'Contact Us | AI Readiness Project' }
    },
    { 
        path: '/careers', 
        name: 'careers',
        component: CareersView,
        meta: { title: 'Research Assistants | AI Readiness Project' }
    },
    { 
        path: '/partners', 
        name: 'partners',
        component: CareersView, 
        meta: { title: 'Partner With Us | AI Readiness Project' }
    },
    { 
        path: '/insights', 
        name: 'insights',
        component: InsightsView,
        meta: { title: 'Research Findings | AI Readiness Project' }
    },
    { 
        path: '/admin', 
        name: 'admin', 
        component: AdminDashboardView,
        meta: { title: 'Administration | AI Readiness Project' }
    },
    { 
        path: '/dashboard', 
        name: 'dashboard',
        component: DashboardView,
        meta: { title: 'My Dashboard | AI Readiness Project' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    // --- 1. SINGLE SOURCE OF TRUTH FOR SCROLLING ---
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition; // Use browser back button position
        } else if (to.hash) {
            return { el: to.hash, behavior: 'smooth' };
        } else {
            return { top: 0, behavior: 'smooth' }; // Scroll to top smoothly
        }
    }
});

// --- 2. Title Updater ---
router.afterEach((to) => {
    document.title = to.meta.title || 'AI Readiness Project';
});



export default router;

