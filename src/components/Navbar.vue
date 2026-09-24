<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { store } from '../store'; 
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router'; 

import MegaMenu from './MegaMenu.vue'; 

const router = useRouter();
const isScrolled = ref(false);
const isMenuOpen = ref(false);
const navbarRef = ref(null); 

const userData = computed(() => store.user);
const isLoggedIn = computed(() => !!store.user);

const userAvatar = computed(() => {
    if (!userData.value) return null;
    return userData.value.avatar || userData.value.photoURL || null;
});

const userInitial = computed(() => {
    if (userData.value?.email) return userData.value.email.charAt(0).toUpperCase();
    return 'U';
});

// --- FIREBASE AUTO-LOGIN LISTENER ---
onAuthStateChanged(auth, (user) => {
  if (user) {
      store.user = {
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email,
          photoURL: user.photoURL,
          role: 'client' 
      };

      // --- NEW: CATCH RETURN VISITS ---
      // If session storage is empty, they just opened a new tab!
      if (!sessionStorage.getItem('ra_session_active')) {
          sessionStorage.setItem('ra_session_active', 'true');
          store.trackActivity("Session Resumed", `Client returned to the portal: ${user.email}`);
      }
  }
});

const handleAuthClick = async () => {
  if (isLoggedIn.value) store.isLogoutModalOpen = true; 
  else store.openModal();
  closeMenu();
};

const handleScroll = () => { isScrolled.value = window.scrollY > 20; };
const handleClickOutside = (event) => {
  if (isMenuOpen.value && navbarRef.value && !navbarRef.value.contains(event.target)) closeMenu();
};
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value; };
const closeMenu = () => { isMenuOpen.value = false; };

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
});
</script>
<template>
  <nav 
    ref="navbarRef"
    class="navbar navbar-expand-lg navbar-dark fixed-top transition-navbar"
    :class="{ 'glass-nav': isScrolled, 'bg-solid': !isScrolled }"
  >
    <div class="container position-relative">
      
      <router-link class="navbar-brand fw-bold brand-container" to="/" @click="closeMenu">
        <span class="brand-text" :class="[isScrolled ? 'text-navy shift-text' : 'text-white']">AI Readiness</span>
        <img :src="store.content.logoUrl || 'https://ui-avatars.com/api/?name=AR&background=bea429&color=1b2c57'" alt="Project Logo" class="brand-logo" :class="{ 'show-logo': isScrolled }">
      </router-link>

      <button class="navbar-toggler border-0" type="button" @click="toggleMenu" :aria-expanded="isMenuOpen">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse custom-mobile-menu" :class="{ 'show': isMenuOpen }" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center gap-3 w-100 justify-content-end">
          
          <li class="nav-item dropdown position-static mega-dropdown">
            <router-link class="nav-link" :class="isScrolled ? 'text-navy' : 'text-white'" to="/" @click="closeMenu">
              Home
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="ms-1 mb-1" viewBox="0 0 16 16">
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
              </svg>
            </router-link>
            
            <MegaMenu @close="closeMenu" />

          </li>
          
          <li class="nav-item"><router-link class="nav-link" :class="isScrolled ? 'text-navy' : 'text-white'" to="/about" @click="closeMenu">About Us</router-link></li>
          <li class="nav-item"><router-link class="nav-link" :class="isScrolled ? 'text-navy' : 'text-white'" to="/services" @click="closeMenu">Services</router-link></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" :class="isScrolled ? 'text-navy' : 'text-white'" href="#" data-bs-toggle="dropdown">Work With Us</a>
            <ul class="dropdown-menu border-0 shadow-lg p-3 rounded-3">
              <li><router-link class="dropdown-item" to="/careers" @click="closeMenu">Careers & Internships</router-link></li>
              <li><router-link class="dropdown-item" to="/partners" @click="closeMenu">Become a Partner</router-link></li>
            </ul>
          </li>
          <li class="nav-item"><router-link class="nav-link" :class="isScrolled ? 'text-navy' : 'text-white'" to="/insights" @click="closeMenu">Insights</router-link></li>
          <li class="nav-item"><router-link class="nav-link" :class="isScrolled ? 'text-navy' : 'text-white'" to="/contact" @click="closeMenu">Contact Us</router-link></li>
          
          <li class="nav-item dropdown auth-item ms-lg-3" v-if="isLoggedIn && userData">
            <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" :class="isScrolled ? 'text-navy' : 'text-white'" href="#" data-bs-toggle="dropdown">
              <div class="user-avatar-small" :class="isScrolled ? 'border-navy' : 'border-white'">
                 <img v-if="userAvatar" :src="userAvatar" alt="User" referrerpolicy="no-referrer">
                 <span v-else class="initial-small">{{ userInitial }}</span>
              </div>
              <span class="d-none d-lg-block fw-bold small">{{ userData.displayName || 'User' }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end border-0 shadow-lg p-3 rounded-3 mt-2">
              <li class="px-2 pb-2 border-bottom mb-2">
                  <span class="d-block fw-bold text-dark">{{ userData.displayName || 'Valued Client' }}</span>
                  <span class="badge bg-gold mt-1" v-if="userData.role === 'admin'">Administrator</span>
              </li>
              <li v-if="userData.role === 'admin'"><router-link class="dropdown-item text-navy" to="/admin" @click="closeMenu">⚙️ Admin Panel</router-link></li>
              <li><router-link class="dropdown-item text-navy" to="/dashboard" @click="closeMenu">👤 My Profile</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><button @click="handleAuthClick" class="dropdown-item fw-bold text-danger">Log Out</button></li>
            </ul>
          </li>

          <li class="nav-item ms-lg-3" v-else>
            <button @click="handleAuthClick" class="btn btn-sm px-4 fw-bold auth-btn" :class="isScrolled ? 'btn-gold' : 'btn-outline-gold'">
              Log In
            </button>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* STRICT COLORS */
.text-navy { color: #1b2c57 !important; }
.text-white { color: white !important; }
.text-gold { color: #bea429 !important; }
.bg-gold { background-color: #bea429 !important; color: #1b2c57;}
.border-gold { border-color: #bea429 !important; }
.border-navy { border: 2px solid #1b2c57; }
.border-white { border: 2px solid rgba(255,255,255,0.8); }

/* GOLD BUTTONS */
.btn-gold { background-color: #bea429; color: #1b2c57; border: none; transition: 0.3s; }
.btn-gold:hover { background-color: #a38c22; color: white; transform: translateY(-2px); }
.btn-outline-gold { border: 2px solid #bea429; color: #bea429; background: transparent; transition: 0.3s; }
.btn-outline-gold:hover { background-color: #bea429; color: #1b2c57; transform: translateY(-2px); }

/* MEGA MENU HOVER LOGIC */
/* Uses :deep() to target the imported component class */
@media (min-width: 992px) {
  .mega-dropdown:hover :deep(.mega-menu) {
      display: block;
      animation: fadeInUp 0.3s ease;
  }
}

/* STANDARD DROPDOWN */
.dropdown-item { padding: 10px 15px; font-size: 0.95rem; border-radius: 6px; color: #495057; transition: all 0.2s ease; }
.dropdown-item:hover { background-color: #f8f9fa; color: #bea429; padding-left: 20px; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* NAVBAR SCROLL LOGIC */
.glass-nav {
    background-color: rgba(255, 255, 255, 0.55) !important;
    backdrop-filter: blur(12px); 
    -webkit-backdrop-filter: blur(12px);
    padding-top: 0.5rem; padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}
.glass-nav .navbar-toggler-icon { filter: invert(1); }

.bg-solid {
    background-color: #1b2c57; 
    box-shadow: none; padding-top: 1rem; padding-bottom: 1rem;
}
.bg-solid .navbar-toggler-icon { filter: invert(0); }

/* BRANDING */
.brand-container { position: relative; display: flex; align-items: center; height: 40px; min-width: 230px; overflow: hidden; }
.brand-text { font-size: 1.5rem; transition: all 0.4s ease-in-out; position: absolute; left: 0; top: 50%; transform: translateY(-50%); }
.shift-text { left: 50px; }
.brand-logo { position: absolute; left: 0; width: 40px; height: 40px; border-radius: 50%; object-fit: cover; opacity: 0; transform: translateY(150%) scale(1.15); transition: all 0.4s ease-in-out; }
.show-logo { opacity: 1; transform: translateY(0) scale(1.15); }

/* AVATAR STYLES */
.user-avatar-small { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: #1b2c57; display: flex; align-items: center; justify-content: center; }
.user-avatar-small img { width: 100%; height: 100%; object-fit: cover; }
.initial-small { color: white; font-size: 0.8rem; font-weight: bold; }

@media (max-width: 991px) {
    .custom-mobile-menu {
        position: absolute; top: 100%; right: 0; width: 300px; 
        background-color: #1b2c57 !important; border: 1px solid rgba(255,255,255,0.1);
        max-height: 85vh; overflow-y: auto; padding: 20px; border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5); margin-top: 10px; 
    }
    .nav-link { color: rgba(255,255,255,0.95) !important; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .nav-link:hover { color: #bea429 !important; }
}
.transition-navbar { transition: all 0.4s ease-in-out; width: 100%; top: 0; z-index: 1000; -webkit-transform: translateZ(0); transform: translateZ(0); backface-visibility: hidden; }
</style>