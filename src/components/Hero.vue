<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { store } from '../store';

const props = defineProps({
  previewData: { type: Array, default: null }
});

const slides = computed(() => props.previewData || store.content.heroSlides);
const currentSlide = ref(0);
let slideInterval;

const nextSlide = () => {
  if (slides.value.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length;
  }
};

watch(slides, () => { currentSlide.value = 0; }, { deep: true });

onMounted(() => { slideInterval = setInterval(nextSlide, 5000); });
onUnmounted(() => { clearInterval(slideInterval); });
</script>

<template>
  <header class="hero-section text-white d-flex align-items-center position-relative overflow-hidden">
    
    <div 
      v-for="(slide, index) in slides" 
      :key="index"
      class="hero-bg"
      :style="{ backgroundImage: `url(${slide.image})` }"
      :class="{ 'active': currentSlide === index }"
    ></div>

    <div class="overlay"></div>

    <div class="container position-relative z-2 text-center">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                
                <transition name="fade" mode="out-in">
                  <div :key="currentSlide" v-if="slides[currentSlide]">
                    <h1 class="display-3 fw-bold mb-4 animate-title text-white">
                        {{ slides[currentSlide].title }}
                    </h1>
                    <p class="lead mb-5 opacity-75 fs-4 animate-subtitle">
                        {{ slides[currentSlide].subtitle }}
                    </p>
                  </div>
                </transition>
                
                <div class="d-flex flex-column flex-md-row justify-content-center gap-3 animate-buttons w-100 px-4 px-md-0">
                    <router-link to="/services" class="btn btn-gold btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg w-sm-100">
                        {{ store.content.hero.buttonText }}
                    </router-link>
                    <router-link to="/contact" class="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold w-sm-100">
                        Partner With Us
                    </router-link>
                </div>

                <div class="d-flex justify-content-center gap-2 mt-5">
                  <span 
                    v-for="(slide, index) in slides" :key="index"
                    class="dot" :class="{ 'active': currentSlide === index }"
                    @click="currentSlide = index"
                  ></span>
                </div>

                <div class="mt-5 brand-permanent-box fade-in-up">
                    <hr class="brand-line">
                    <h2 class="brand-title">STRATEGIC & ANALYTICS</h2>
                    <h3 class="brand-subtitle">CONSULTING</h3>
                    <hr class="brand-line">
                    <p class="brand-tagline"><i>Insight. &nbsp; Strategy. &nbsp; Impact.</i></p>
                </div>

            </div>
        </div>
    </div>
  </header>
</template>

<style scoped>
.hero-section { height: 100vh; min-height: 700px; background-color: #1b2c57; position: relative; }

.hero-bg {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background-size: cover; background-position: center; opacity: 0;
    transition: opacity 1.5s ease-in-out, transform 6s ease; transform: scale(1); z-index: 0;
}
.hero-bg.active { opacity: 1; transform: scale(1.05); }

/* STRICT NAVY RGB (27, 44, 87) */
.overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(135deg, rgba(27, 44, 87, 0.95), rgba(27, 44, 87, 0.6)); z-index: 1;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.dot { width: 12px; height: 12px; background: rgba(255,255,255,0.3); border-radius: 50%; cursor: pointer; transition: all 0.3s; }
.dot.active { background: #bea429; transform: scale(1.3); box-shadow: 0 0 10px rgba(190, 164, 41, 0.5); }

.btn-gold { background-color: #bea429; color: #1b2c57; border: none; transition: all 0.3s ease; }
.btn-gold:hover { background-color: #a38c22; transform: translateY(-3px); color: white; }

/* RECREATED BRANDING STYLES */
.brand-permanent-box { text-align: center; max-width: 600px; margin: 0 auto; }
.brand-line { border-top: 2px solid #bea429; opacity: 1; margin: 8px 0; }
.brand-title { color: #FFFFFF; font-weight: 800; letter-spacing: 3px; font-family: 'Georgia', serif; font-size: 1.8rem; margin: 0; }
.brand-subtitle { color: #bea429; font-weight: 800; letter-spacing: 4px; font-family: 'Georgia', serif; font-size: 1.3rem; margin: 0; }
.brand-tagline { color: #FFFFFF; font-size: 1.1rem; letter-spacing: 1.5px; margin-top: 8px; font-family: 'Georgia', serif; }

.fade-in-up { animation: fadeInUp 1s ease-out forwards; animation-delay: 0.5s; opacity: 0; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
    .brand-title { font-size: 1.2rem; }
    .brand-subtitle { font-size: 1rem; }
    .brand-tagline { font-size: 0.9rem; }
}
</style>