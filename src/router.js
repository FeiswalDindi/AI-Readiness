import { createRouter, createWebHistory } from 'vue-router';

// --- IMPORT VIEWS ---
import HomeView from './views/HomeView.vue';
import DashboardView from './views/DashboardView.vue';
import ContactView from './views/ContactView.vue';
import AboutView from './views/AboutView.vue'; 
import ServicesView from './views/ServicesView.vue';
import CareersView from './views/CareersView.vue';
import InsightsView from './views/InsightsView.vue';
import AdminDashboardView from './views/AdminDashboardView.vue';

const routes = [
    { 
        path: '/', 
        name: 'home',
        component: HomeView,
        meta: { title: 'Home | RA Consulting' } 
    },
    { 
        path: '/about', 
        name: 'about',
        component: AboutView,
        meta: { title: 'About Us | RA Consulting' }
    },
    { 
        path: '/contact', 
        name: 'contact',
        component: ContactView,
        meta: { title: 'Contact Us | RA Consulting' }
    },
    {
        path: '/services/:serviceId?', 
        name: 'services',
        component: ServicesView,
        props: true,
        meta: { title: 'Our Services | RA Consulting' }
    },
    { 
        path: '/careers', 
        name: 'careers',
        component: CareersView,
        meta: { title: 'Join Our Team | RA Consulting' }
    },
    { 
        path: '/partners', 
        name: 'partners',
        component: CareersView, 
        meta: { title: 'Partner With Us | RA Consulting' }
    },
    { 
        path: '/insights', 
        name: 'insights',
        component: InsightsView,
        meta: { title: 'Insights & Resources | RA Consulting' }
    },
    { 
        path: '/admin', 
        name: 'admin', 
        component: AdminDashboardView,
        meta: { title: 'Administration | RA Consulting' }
    },
    { 
        path: '/dashboard', 
        name: 'dashboard',
        component: DashboardView,
        meta: { title: 'My Dashboard | RA Consulting' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    // --- 1. SINGLE SOURCE OF TRUTH FOR SCROLLING ---
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition; // Use browser back button position
        } else {
            return { top: 0, behavior: 'smooth' }; // Scroll to top instantly
        }
    }
});

// --- 2. Title Updater ---
router.afterEach((to) => {
    document.title = to.meta.title || 'RA Strategic & Analytics Consulting';
});



export default router;

