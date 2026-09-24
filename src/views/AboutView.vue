<script setup>
import { store } from '../store'; 
</script>

<template>
  <main class="about-page bg-light min-vh-100">
    
    <section class="page-header py-5 bg-navy text-white text-center" style="padding-top: 120px !important;">
      <div class="container py-5 mt-4">
        <h1 class="display-3 fw-bold mb-3">About The Research</h1>
        <p class="lead text-white-50 mx-auto" style="max-width: 800px;">
          Understanding the intersection of Artificial Intelligence, Higher Education, and the rapidly evolving labor markets in East Africa.
        </p>
      </div>
    </section>

    <section class="py-5 bg-white">
      <div class="container py-5">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
             <h6 class="text-uppercase text-gold ls-2 mb-3 fw-bold">Project Context</h6>
             <h2 class="display-5 fw-bold mb-4 text-navy">{{ store.content.about.title }}</h2>
             
             <p class="text-muted mb-4 lead" style="line-height: 1.8;">
                Offering highly scalable insights for universities and policymakers seeking to enhance AI readiness among graduates in rapidly evolving labour markets.
             </p>
             <p class="text-muted" style="line-height: 1.8;">
                Given the low cost of this light-touch information intervention — a short, online awareness training — we expect any modest, positive results to offer a scalable policy lever for educational institutions and policymakers in Kenya and similar contexts to improve the job search processes and job market readiness of their students to the evolving job market needs. 
             </p>
             <p class="text-muted" style="line-height: 1.8;">
                Any potential effects on willingness-to-pay for further training may also have implications for local institutions on how to improve curriculum design and post-graduate program offerings.
             </p>
          </div>
          <div class="col-lg-6">
             <div class="bg-light-navy rounded-4 p-5 border position-relative overflow-hidden h-100 d-flex flex-column justify-content-center shadow-sm">
                <div class="z-2 position-relative">
                    <h4 class="fw-bold text-navy mb-4 border-bottom pb-3">Key Research Areas</h4>
                    
                    <div class="d-flex align-items-start gap-3 mb-4">
                        <div class="icon-box bg-white text-gold rounded-circle shadow-sm border border-light">
                            <i class="fw-bold">1</i>
                        </div>
                        <div>
                            <h6 class="fw-bold text-navy mb-1">Job Search Efficiency</h6>
                            <p class="text-muted small mb-0">How AI tools enhance the job search process for recent graduates.</p>
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-start gap-3 mb-4">
                        <div class="icon-box bg-white text-gold rounded-circle shadow-sm border border-light">
                            <i class="fw-bold">2</i>
                        </div>
                        <div>
                            <h6 class="fw-bold text-navy mb-1">Market Readiness</h6>
                            <p class="text-muted small mb-0">Measuring the gap between current academic training and AI-driven market demands.</p>
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-start gap-3">
                        <div class="icon-box bg-white text-gold rounded-circle shadow-sm border border-light">
                            <i class="fw-bold">3</i>
                        </div>
                        <div>
                            <h6 class="fw-bold text-navy mb-1">Curriculum Design</h6>
                            <p class="text-muted small mb-0">Implications for local institutions to improve syllabus and program offerings.</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
/* STRICT COLORS */
.bg-navy { background-color: #1b2c57 !important; }
.bg-light-navy { background-color: #f4f6fa !important; }
.text-navy { color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; }

.ls-2 { letter-spacing: 2px; }

.icon-box {
    min-width: 45px; height: 45px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
}
</style>