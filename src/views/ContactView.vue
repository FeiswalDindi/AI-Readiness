<script setup>
import { ref, computed } from 'vue';
import { store } from '../store';
import { auth } from '../firebase'; 

const subject = ref('');
const message = ref('');
const isSubmitting = ref(false);
const formFeedback = ref({ type: '', message: '' });

// Auth check
const isLoggedIn = computed(() => !!store.user || !!auth.currentUser);

const handleLoginClick = () => {
  store.openModal(); 
};

const submitForm = async () => {
  if (!subject.value || !message.value) {
      formFeedback.value = { type: 'danger', message: 'Please fill in all fields.' };
      return;
  }
  isSubmitting.value = true;
  formFeedback.value = { type: '', message: '' };

  try {
      // Silent AJAX request to FormSubmit
      const response = await fetch("https://formsubmit.co/ajax/feisalsdindi4@gmail.com", {
          method: "POST",
          headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({
              _subject: "New Contact Form Inquiry: " + subject.value,
              _captcha: "false", // Completely disables the visual robot check
              Client_Name: store.user.displayName,
              Client_Email: store.user.email,
              Message: message.value
          })
      });

      if (response.ok) {
          formFeedback.value = { type: 'success', message: 'Message sent successfully! Our advisory team will review it and get back to you.' };
          subject.value = '';
          message.value = '';
      } else {
          throw new Error("Failed to send");
      }
  } catch (error) {
      formFeedback.value = { type: 'danger', message: 'Network error. Please try again later or use the contact details below.' };
  } finally {
      isSubmitting.value = false;
      setTimeout(() => { formFeedback.value = { type: '', message: '' }; }, 6000);
  }
};
</script>

<template>
  <main class="contact-page-wrapper">
    
    <section class="top-section bg-navy text-white position-relative pb-5">
        <div class="container pt-5">
            <div class="row align-items-center justify-content-center pt-4">
                
                <div class="col-12 col-md-5 d-flex justify-content-center text-center mb-5 mb-md-0">
                    <img :src="store.content.posterUrl || 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&auto=format&fit=crop'" alt="Research Project Logo" class="hero-logo">
                </div>

                <div class="col-12 col-md-7 text-center text-md-start pe-md-5">
                    <h1 class="display-4 fw-bold lh-sm mb-3">
                        Want to collaborate on the research? <br>
                        <span class="text-gold fade-text">Let's talk!</span>
                    </h1>
                    <p class="text-white-50 mb-0">Reach out to the AI Readiness Project team.</p>
                </div>

            </div>
        </div>
    </section>

    <section class="form-section py-5 bg-light-grey">
        <div class="container py-5">
            <div class="row g-5">
                
                <div class="col-lg-6 pe-lg-5">
                    <h2 class="fw-bold text-navy mb-4">Get in touch</h2>
                    <p class="fw-bold fst-italic text-navy small text-uppercase mb-4" style="letter-spacing: 0.5px; line-height: 1.6;">
                        Engage with our research team to discuss AI readiness and labor market integration.
                    </p>
                    <p class="text-muted small mb-5 lh-lg">
                        The AI Readiness Project is actively gathering insights into the rapidly evolving job market. Whether you are an educational institution looking to understand curriculum impacts, a student navigating the job market, or a policymaker interested in scalable interventions, our team is ready to connect with you.
                    </p>
                    
                    <div class="d-flex gap-3 justify-content-center justify-content-lg-start">
                        <a href="#" class="social-icon text-navy"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg></a>
                        <a href="#" class="social-icon text-navy"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg></a>
                        <a href="#" class="social-icon text-navy"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/></svg></a>
                    </div>
                </div>

                <div class="col-lg-6 ps-lg-5">
                    <form v-if="isLoggedIn" @submit.prevent="submitForm">
                        <div class="mb-4">
                            <label class="form-label small text-muted fw-bold mb-1">Subject</label>
                            <input type="text" v-model="subject" class="custom-input" placeholder="Enter inquiry title" required>
                        </div>
                        <div class="mb-5">
                            <label class="form-label small text-muted fw-bold mb-1">Message</label>
                            <textarea v-model="message" rows="5" class="custom-input" placeholder="Enter your message" required></textarea>
                        </div>

                        <div v-if="formFeedback.message" class="alert small fw-bold rounded-1" :class="`alert-${formFeedback.type}`">
                            {{ formFeedback.message }}
                        </div>

                        <button type="submit" class="btn btn-gold w-100 py-3 rounded-pill fw-bold text-uppercase ls-1 shadow-sm submit-btn" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Securely Sending...' : 'Submit Message' }}
                        </button>
                    </form>

                    <div v-else class="h-100 d-flex flex-column justify-content-center text-center py-4 px-3 border border-2 border-light rounded-4 bg-white shadow-sm">
                         <div class="mb-3 text-gold opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                            </svg>
                        </div>
                        <h4 class="fw-bold text-navy mb-2">Login Required</h4>
                        <p class="text-muted small mb-4 px-3">
                            Please log in or create an account to send us a direct message.
                        </p>
                        <button @click="handleLoginClick" class="btn btn-gold px-5 py-3 rounded-pill fw-bold text-uppercase ls-1 shadow-sm mx-auto submit-btn">
                            Log In / Sign Up
                        </button>
                    </div>

                </div>

            </div>
        </div>
    </section>

    <section class="cards-section position-relative pb-5">
        <div class="fading-gold-band"></div>

        <div class="container position-relative z-2 cards-container">
            <div class="row g-4 justify-content-center">
                
                <div class="col-lg-4 col-md-6">
                    <a href="https://maps.google.com/?q=Nairobi,+Kenya" target="_blank" class="contact-card d-block text-decoration-none shadow-lg">
                        <div class="icon-wrap text-gold mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                        </div>
                        <h6 class="fw-bold text-navy text-uppercase ls-1 mb-2">Our Main Office</h6>
                        <p class="text-muted small mb-0">Nairobi, Kenya</p>
                        <p class="text-muted small mb-0">East Africa</p>
                    </a>
                </div>

                <div class="col-lg-4 col-md-6">
                    <a :href="`tel:${store.content.phoneNumber}`" class="contact-card d-block text-decoration-none shadow-lg">
                        <div class="icon-wrap text-gold mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/></svg>
                        </div>
                        <h6 class="fw-bold text-navy text-uppercase ls-1 mb-2">Phone Number</h6>
                        <p class="text-muted small mb-0">{{ store.content.phoneNumber }}</p>
                        <p class="text-muted small mb-0">(Direct Line)</p>
                    </a>
                </div>

                <div class="col-lg-4 col-md-6">
                    <a href="mailto:feisalsdindi4@gmail.com" class="contact-card d-block text-decoration-none shadow-lg">
                        <div class="icon-wrap text-gold mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2-2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/></svg>
                        </div>
                        <h6 class="fw-bold text-navy text-uppercase ls-1 mb-2">Email</h6>
                        <p class="text-navy small fw-bold mb-0 text-decoration-underline">feisalsdindi4@gmail.com</p>
                    </a>
                </div>

            </div>
        </div>
    </section>

  </main>
</template>

<style scoped>
/* COLORS */
.bg-navy { background-color: #1b2c57 !important; }
.text-navy { color: #1b2c57 !important; }
.bg-gold { background-color: #bea429 !important; }
.text-gold { color: #bea429 !important; }
.contact-page-wrapper { background-color: #f4f5f7; }
.bg-light-grey { background-color: #f4f5f7; }

.ls-1 { letter-spacing: 1px; }

/* 1. TOP SECTION */
.top-section {
    padding-top: 120px; 
}

.hero-logo {
    width: 500px; 
    height: 350px; 
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #bea429;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    transition: transform 0.4s ease;
}

.hero-logo:hover {
    transform: scale(1.05);
}

.fade-text {
    background: linear-gradient(to right, #bea429, #ffd700, #bea429);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* 2. MIDDLE SECTION (Socials & Form) */
.social-icon { transition: all 0.3s ease; }
.social-icon:hover { color: #bea429 !important; transform: scale(1.1); }

/* CUSTOM FORM INPUTS */
.custom-input {
    width: 100%;
    background-color: #ebedef;
    border: none;
    border-bottom: 2px solid #ccc;
    border-radius: 4px 4px 0 0;
    padding: 12px 15px;
    color: #333;
    transition: all 0.3s ease;
}
.custom-input:focus {
    outline: none;
    background-color: white;
    border-bottom-color: #bea429;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.submit-btn {
    background-color: #bea429;
    color: white;
    border: none;
    transition: all 0.3s ease;
}
.submit-btn:hover {
    background-color: #1b2c57 ;
    transform: translateY(-3px);
    color: white;
}

/* 3. BOTTOM SECTION (Fading Gold Band & Cards) */
.cards-section {
    margin-top: -30px; 
}
.fading-gold-band {
    position: absolute;
    top: 50%; 
    left: 0;
    width: 100%; 
    height: 180px;
    z-index: 1;
    background: linear-gradient(135deg, rgba(119, 100, 3, 0.9) 0%, rgba(255, 215, 0, 0.4) 50%, rgba(190, 164, 41, 0.9) 100%);
}

.cards-container {
    padding-bottom: 50px;
}

.contact-card {
    background: white;
    border-radius: 20px;
    padding: 45px 20px;
    text-align: center;
    transition: all 0.3s ease;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 100%;
    border-bottom: 4px solid transparent;
}
.contact-card:hover {
    transform: translateY(-8px);
    border-color: #1b2c57 ;
}

@media (max-width: 991px) {
    .fading-gold-band { top: 30%; height: 100%; }
}

@media (max-width: 768px) {
    .hero-logo {
        width: 180px;
        height: 180px;
    }
}
</style>