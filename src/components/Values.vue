<script setup>
import { ref } from 'vue';

// Official 5 Core Values from the Word Document
const values = ref([
    {
        title: "Integrity",
        text: "We uphold the highest ethical standards, ensuring transparency, honesty, and accountability in all our engagements.",
        path: "M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.655-.197-1.534-.446-2.837-.856-.44-.139-1.028-.323-1.636-.505a.55.55 0 0 0-.31 0c-.608.182-1.196.366-1.636.505Z"
    },
    {
        title: "Excellence",
        text: "We are committed to delivering rigorous, high-quality, and actionable solutions that exceed client expectations.",
        path: "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.344 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
    },
    {
        title: "Innovation",
        text: "We embrace forward-thinking approaches, leveraging advanced analytics and digital tools to solve complex challenges.",
        path: "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
    },
    {
        title: "Collaboration",
        text: "We build strong, long-term partnerships with our clients, valuing local context and co-creating solutions.",
        path: "M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
    },
    {
        title: "Impact-Driven",
        text: "We focus on practical outcomes that drive sustainable performance and meaningful change.",
        path: "M8 0l1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"
    }
]);
</script>

<template>
  <section class="values-section py-5 bg-light">
    <div class="container py-4">
      
      <div class="row justify-content-center text-center mb-5" v-scroll-reveal>
        <div class="col-lg-8">
            <h6 class="text-uppercase text-gold ls-2 mb-2 fw-bold">Our Philosophy</h6>
            <h2 class="display-6 fw-bold text-navy">Core Values</h2>
            <div class="divider mx-auto mt-3 bg-gold"></div>
        </div>
      </div>

      <div class="row g-4 justify-content-center">
        <div class="col-lg-4 col-md-6" v-for="(item, index) in values" :key="index" v-scroll-reveal="{ delay: index * 100 }">
          <div class="value-card p-4 h-100 bg-white rounded-4 shadow-sm border text-center">
            
            <div class="icon-circle bg-navy text-gold mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                    <path :d="item.path" />
                </svg>
            </div>

            <h5 class="fw-bold mb-3 text-navy">{{ item.title }}</h5>
            <p class="small text-muted mb-0 lh-lg">{{ item.text }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* STRICT COLORS */
.text-navy { color: #1b2c57 !important; }
.bg-navy { background-color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; } 
.bg-gold { background-color: #bea429 !important; }

/* LAYOUT */
.divider { width: 60px; height: 3px; }
.ls-2 { letter-spacing: 2px; font-size: 0.8rem; }

/* CARD & HOVER EFFECTS */
.value-card {
  transition: all 0.3s ease;
  border-bottom: 4px solid transparent !important;
}

.value-card:hover {
  transform: translateY(-8px);
  border-color: #bea429 !important;
  box-shadow: 0 15px 30px rgba(190, 164, 41, 0.1) !important;
}

.icon-circle {
    width: 64px; height: 64px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.3s ease;
}

.value-card:hover .icon-circle {
    transform: scale(1.1) rotate(5deg);
}
</style>