<script setup>
import { store } from '../store';
import { useRouter } from 'vue-router';

const router = useRouter();

const confirmLogout = () => {
    console.log("Initiating Logout...");
    
    // 1. Trigger the logout action in store.js
    store.logout(); 
    
    // 2. Close the modal
    store.isLogoutModalOpen = false;
    
    // 3. Force redirect to home
    router.push('/').then(() => {
        // Optional: Force a window refresh if the Navbar is being stubborn
        // window.location.reload(); 
    });
};
</script>

<template>
  <transition name="fade">
    <div v-if="store.isLogoutModalOpen" class="modal-overlay" @click.self="store.isLogoutModalOpen = false">
      <div class="glass-card text-center">
        <div class="mb-4 text-gold">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
        </div>
        
        <h3 class="fw-bold text-white mb-3">Confirm Logout</h3>
        <p class="text-white-50 mb-4 small">Are you sure you want to end your active session?</p>
        
        <div class="d-flex gap-3 mt-4">
            <button @click="store.isLogoutModalOpen = false" class="btn-cancel w-100">Cancel</button>
            <button @click="confirmLogout" class="btn-confirm w-100">Logout</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center; z-index: 11000;
}
.glass-card {
  background: rgba(26, 43, 73, 0.85); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px; padding: 40px; width: 90%; max-width: 400px;
}
.text-gold { color: #D4AF37; }
.btn-cancel {
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    color: white; padding: 12px; border-radius: 12px; font-weight: bold;
}
.btn-confirm {
    background: #e74c3c; border: none;
    color: white; padding: 12px; border-radius: 12px; font-weight: bold;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>