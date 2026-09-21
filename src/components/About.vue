<script setup>
import { ref } from 'vue';

// Tracks if about.png fails to load
const imgFailed = ref(false);
const isExpanded = ref(false);

const handleReadMore = () => {
  // Unrestricted access - no login required anymore!
  isExpanded.value = true; 
};
</script>

<template>
  <div class="about-page-wrapper">
      
    <section class="page-banner bg-navy position-relative overflow-hidden text-center py-5">
        <div class="container position-relative z-2">
            
            <div class="header-logo mx-auto mb-4">
                <img 
                    v-if="!imgFailed" 
                    src="/about.png" 
                    alt="About Us Logo" 
                    @error="imgFailed = true" 
                    class="banner-logo-img"
                >
                <svg v-else class="banner-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="48" fill="#1b2c57" stroke="#bea429" stroke-width="4"/>
                    <path d="M35 65 L50 25 L65 65 M40 50 L60 50" stroke="#bea429" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>

            <h1 class="display-4 fw-bold mb-0 text-white">About Us</h1>
            <p class="text-gold mt-2 mb-0 ls-2 text-uppercase fw-bold">Who We Are</p>
        </div>
    </section>

    <section class="py-5" id="about-content">
      <div class="container py-4">
        <div class="row align-items-center">
          
          <div class="col-lg-5 mb-4 mb-lg-0">
            <h2 class="fw-bold text-navy display-5">Our Story</h2>
            <div class="line-accent mb-4 bg-gold"></div>
            <p class="lead text-muted">
              RA Strategic & Analytics Consulting Ltd is a multidisciplinary advisory firm offering comprehensive solutions.
            </p>
          </div>

          <div class="col-lg-7">
            <div class="content-wrapper" :class="{ 'expanded': isExpanded }">
              
              <div class="text-content">
                <p>
                  We support organizations across Eastern Africa to enhance performance, strengthen governance, and achieve sustainable growth. Our approach blends analytical rigor with practical implementation to ensure measurable impact.
                </p>
                <p>
                  Our team consists of industry veterans and data scientists dedicated to solving complex business challenges. We believe in evidence-based decision making, utilizing advanced analytics to uncover hidden opportunities for our clients.
                </p>
                <p>
                  From strategic planning to digital transformation, we partner with you every step of the way. We don't just provide reports; we provide roadmaps for success in an increasingly competitive landscape. Our core philosophy is built on integrity, innovation, and long-term partnership.
                </p>
                <p>
                  <strong>Why Choose Us?</strong> We combine local market knowledge with global best practices. Our solutions are tailored, not templated. We understand the nuances of the East African market and are committed to driving real, tangible value for your stakeholders.
                </p>
              </div>

              <div class="blur-overlay" v-if="!isExpanded"></div>
            
            </div>

            <button 
              v-if="!isExpanded" 
              @click="handleReadMore" 
              class="btn btn-outline-navy mt-3 px-4 rounded-pill fw-bold"
            >
              Read More
            </button>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* STRICT COLOR PALETTE */
.bg-navy { background-color: #1b2c57 !important; }
.text-navy { color: #1b2c57 !important; }
.bg-gold { background-color: #bea429 !important; }
.text-gold { color: #bea429 !important; }

/* UTILS */
.ls-2 { letter-spacing: 2px; }

/* PAGE BANNER STYLES */
.page-banner {
    padding: 100px 0 80px 0; 
    margin-top: 60px; 
    border-bottom: 4px solid #bea429;
}

/* THE NEW STANDARDIZED HEADER LOGO */
.header-logo {
    width: 180px; 
    height: 180px; 
    border-radius: 50%;
    overflow: hidden;
    background-color: white; 
    border: 3px solid #bea429; 
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    transition: transform 0.4s ease;
}

.header-logo:hover {
    transform: scale(1.05); 
}

.banner-logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover; 
}

.banner-logo-svg {
    width: 100%;
    height: 100%;
}

/* CONTENT STYLES */
.line-accent {
  width: 60px;
  height: 4px;
  border-radius: 2px;
}

.btn-outline-navy {
    border: 2px solid #1b2c57;
    color: #1b2c57;
    background: transparent;
    transition: all 0.3s ease;
}
.btn-outline-navy:hover {
    background: #1b2c57;
    color: white;
    transform: translateY(-2px);
}

/* THE GATED LOGIC */
.content-wrapper {
  position: relative;
  max-height: 180px; 
  overflow: hidden; 
  transition: max-height 0.8s ease-in-out; 
}

.content-wrapper.expanded {
  max-height: 1000px; 
}

.blur-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  pointer-events: none; 
}

@media (max-width: 768px) {
    .header-logo {
        width: 140px;
        height: 140px;
    }
}
</style>