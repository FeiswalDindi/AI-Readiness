<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import LoginModal from './components/LoginModal.vue';
// 1. IMPORT IS HERE (This was correct)
import Chatbot from './components/Chatbot.vue'; 
import CookieBanner from './components/CookieBanner.vue';
import GoogleOneTap from './components/GoogleOneTap.vue';
import LogoutModal from './components/LogoutModal.vue';
import FloatingWhatsApp from './components/FloatingWhatsApp.vue';
import { onMounted, watch } from 'vue';
import { store } from './store';

watch(() => store.content.logoUrl, (newUrl) => {
    if (newUrl) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = newUrl;
    }
}, { immediate: true });

onMounted(async () => {
    if (store.user) {
        await store.syncUserProfile();
    }
    
    // Check if returning from Qualtrics Survey
    const query = new URLSearchParams(window.location.search);
    if (query.get('survey') === 'completed') {
        if (store.user) {
            await store.markSurveyCompleted();
        } else {
            store.intent = 'record_survey';
            store.isLoginModalOpen = true;
        }
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
</script>

<template>
  <div class="app-wrapper">
    <Navbar />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <Footer />
    
    <LoginModal />
    <LogoutModal />
    <CookieBanner />
    <GoogleOneTap />
    
    <Chatbot /> <FloatingWhatsApp />
    
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>

