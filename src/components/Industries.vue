<script setup>
// No script needed
</script>

<template>
  <section class="py-5 section-professional">
    <div class="container py-4">
      
      <div class="row justify-content-center text-center mb-5" v-scroll-reveal>
        <div class="col-lg-8">
          <h6 class="text-uppercase text-gold ls-2 fw-bold mb-2">Industries We Serve</h6>
          <h2 class="display-5 fw-bold text-navy">Specialized Expertise</h2>
          <div class="divider mx-auto mt-4 bg-gold fade-gradient"></div>
        </div>
      </div>

      <div class="row g-4" v-scroll-reveal="{ delay: 200 }">
          
          <div class="col-md-6 col-lg-3">
              <div class="industry-card bg-white p-4 h-100 rounded-3 text-center position-relative">
                  <div class="icon-box mx-auto mb-4 bg-navy text-gold shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.176 11h7.648a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H4.176a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                        <path d="M0 7.5V13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7.5l-8-5-8 5zm1.5 0L8 3.5 14.5 7.5v5H1.5v-5z"/>
                        <path d="M4 8.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-3z"/>
                      </svg>
                  </div>
                  <h5 class="fw-bold text-navy mb-3">Public Sector</h5>
                  <p class="text-muted small mb-0">Enhancing governance, policy frameworks, and operational efficiency.</p>
              </div>
          </div>

          <div class="col-md-6 col-lg-3">
              <div class="industry-card bg-white p-4 h-100 rounded-3 text-center position-relative">
                  <div class="icon-box mx-auto mb-4 bg-navy text-gold shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5ZM8 8.46 1.758 5.965 8 3.052l6.242 2.913L8 8.46Z"/>
                        <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
                      </svg>
                  </div>
                  <h5 class="fw-bold text-navy mb-3">NGOs & Academia</h5>
                  <p class="text-muted small mb-0">Driving research impact and sustainable development.</p>
              </div>
          </div>

          <div class="col-md-6 col-lg-3">
              <div class="industry-card bg-white p-4 h-100 rounded-3 text-center position-relative">
                  <div class="icon-box mx-auto mb-4 bg-navy text-gold shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"/>
                      </svg>
                  </div>
                  <h5 class="fw-bold text-navy mb-3">Banking & Finance</h5>
                  <p class="text-muted small mb-0">Risk management, financial diagnostics, and investment advisory.</p>
              </div>
          </div>

          <div class="col-md-6 col-lg-3">
              <div class="industry-card bg-white p-4 h-100 rounded-3 text-center position-relative">
                  <div class="icon-box mx-auto mb-4 bg-navy text-gold shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707zm2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708zm5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708zm2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                      </svg>
                  </div>
                  <h5 class="fw-bold text-navy mb-3">Telco & Media</h5>
                  <p class="text-muted small mb-0">Digital transformation and big data analytics.</p>
              </div>
          </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.section-professional { background-color: #Fcfcfc; border-top: 1px solid #e9ecef; }

/* THEME COLORS (Strict Specs) */
.text-navy { color: #1b2c57 !important; }
.bg-navy { background-color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; }
.bg-gold { background-color: #bea429 !important; }

/* Gradient Divider */
.divider { width: 80px; height: 4px; border-radius: 2px; }
.fade-gradient { background: linear-gradient(90deg, #bea429, transparent); }

.industry-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(0,0,0,0.03);
    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
    border-bottom: 4px solid transparent; 
}

/* Hover Logic: Gold Glow + Border */
.industry-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(190, 164, 41, 0.15) !important;
    border-bottom: 4px solid #bea429;
}

.icon-box {
    width: 70px; height: 70px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 4px solid #fff; 
    box-shadow: 0 5px 15px rgba(27, 44, 87, 0.15);
    transition: all 0.4s ease;
}

/* Icon turns Gold on Card Hover */
.industry-card:hover .icon-box {
    background-color: #bea429 !important;
    color: #1b2c57 !important;
    transform: scale(1.1) rotate(5deg);
}

.ls-2 { letter-spacing: 2px; font-size: 0.8rem; }
</style>