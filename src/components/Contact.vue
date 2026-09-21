<script setup>
import { store } from '../store';
import { auth } from '../firebase';

const handleContactSubmit = () => {
  if (!auth.currentUser) {
    store.openModal();
  } else {
    alert(`Message Sent!`);
  }
};

const openWhatsApp = () => {
    window.open('https://wa.me/254790583820', '_blank');
};
</script>

<template>
  <section id="contact" class="contact-section py-5 bg-white">
    <div class="container">
      
      <div class="row g-5">
        
        <div class="col-lg-7">
             <div class="bg-light p-5 rounded-3 shadow-sm h-100 border border-top-navy">
                <h4 class="fw-bold text-navy mb-4">Send a Direct Message</h4>
                
                <form @submit.prevent="handleContactSubmit">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold text-uppercase text-muted">Your Name</label>
                            <input type="text" class="form-control bg-white custom-input" placeholder="Full Name" required>
                        </div>
                        <div class="col-md-6 mt-3 mt-md-0">
                            <label class="form-label small fw-bold text-uppercase text-muted">Email Address</label>
                            <input type="email" class="form-control bg-white custom-input" placeholder="name@company.com" required>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="form-label small fw-bold text-uppercase text-muted">Message</label>
                        <textarea class="form-control bg-white custom-input" rows="4" placeholder="How can we help?" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-navy fw-bold px-4 py-2">Submit Message</button>
                </form>
             </div>
        </div>

        <div class="col-lg-5">
            <div class="h-100 d-flex flex-column justify-content-center pe-lg-4">
                
                <h6 class="text-uppercase text-gold fw-bold ls-2 mb-2">Reach Out</h6>
                <h2 class="display-6 fw-bold text-navy mb-4">Let's build strategy together.</h2>
                <p class="text-muted mb-5">
                    Ready to transform your organization? Contact us today to discuss how our solutions can support your institutional goals.
                </p>

                <div class="d-flex flex-column gap-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="icon-circle bg-light-gold text-gold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                        </div>
                        <div>
                            <span class="fw-bold d-block text-dark">Nairobi, Kenya</span>
                        </div>
                    </div>

                    <div class="d-flex align-items-center gap-3">
                        <div class="icon-circle bg-light-gold text-gold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/></svg>
                        </div>
                        <div>
                            <a href="mailto:info@rastrategicanalytics.com" class="text-dark text-decoration-none fw-bold hover-gold">info@rastrategicanalytics.com</a>
                        </div>
                    </div>

                    <div class="d-flex align-items-center gap-3">
                        <div class="icon-circle bg-light-gold text-gold">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/></svg>
                        </div>
                        <div>
                            <span class="fw-bold d-block text-dark">+254-790-583-820</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* STRICT COLORS */
.text-navy { color: #1b2c57 !important; }
.bg-navy { background-color: #1b2c57 !important; color: white; transition: 0.3s; }
.bg-navy:hover { background-color: #bea429 !important; color: #1b2c57; }

.text-gold { color: #bea429 !important; }
.bg-light-gold { background-color: rgba(190, 164, 41, 0.15); }

.border-top-navy { border-top: 5px solid #1b2c57 !important; }
.ls-2 { letter-spacing: 2px; }

.icon-circle {
    width: 45px; height: 45px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
}

.hover-gold { transition: color 0.2s; }
.hover-gold:hover { color: #bea429 !important; }

.custom-input { border: 1px solid #dee2e6; transition: all 0.3s; }
.custom-input:focus {
    border-color: #bea429;
    box-shadow: 0 0 0 0.25rem rgba(190, 164, 41, 0.25);
}
</style>