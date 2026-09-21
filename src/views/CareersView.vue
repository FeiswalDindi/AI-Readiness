<script setup>
import { ref, computed, nextTick } from 'vue';
import { store } from '../store';
import { auth } from '../firebase';

// Auth State
const isLoggedIn = computed(() => !!store.user || !!auth.currentUser);

// Controls which form is visible
const activeForm = ref(null);

// Form States
const isSubmitting = ref(false);
const feedback = ref(null);

const handleLoginClick = () => {
  store.openModal();
};

const openForm = async (formType) => {
    activeForm.value = formType;
    feedback.value = null;
    await nextTick();
    document.getElementById('application-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const closeForm = () => {
    activeForm.value = null;
    feedback.value = null;
};

const submitApplication = async (event) => {
    isSubmitting.value = true;
    feedback.value = null;

    // Grab the actual form HTML element
    const formElement = event.target;
    const formData = new FormData(formElement);

    // Add hidden configuration for FormSubmit to ensure a smooth, silent send
    formData.append("_subject", activeForm.value === 'career' ? "New Career Application" : "New Partnership Proposal");
    formData.append("_captcha", "false"); // Disables the visual robot check!

    try {
        // Silent AJAX request
        const response = await fetch("https://formsubmit.co/ajax/3e6265ca4854258cac18a99095b6f2d5", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            feedback.value = "Successfully submitted! Our team will securely review your details shortly.";
            setTimeout(() => { closeForm(); }, 4000);
        } else {
            throw new Error("Submission Failed");
        }
    } catch (error) {
        feedback.value = "An error occurred submitting your data. Please check your connection and try again.";
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
  <main class="careers-page bg-light pb-5 min-vh-100">
    
    <section class="py-5 bg-navy text-white text-center" style="padding-top: 120px !important;">
      <div class="container py-5 mt-4">
        <h1 class="display-3 fw-bold mb-3">Work With Us</h1>
        <p class="lead text-white-50 mx-auto" style="max-width: 700px;">
            Join a team of innovators, analysts, and strategists dedicated to transforming institutions across East Africa.
        </p>
      </div>
    </section>

    <section class="py-5">
      <div class="container py-4">
        <div class="row g-4 justify-content-center">
          
          <div class="col-md-6 col-lg-5">
            <div class="card h-100 shadow-sm border-0 p-5 text-center hover-card bg-white rounded-4">
              <div class="icon-circle mx-auto mb-4 bg-navy text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 1.172 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z"/>
                  </svg>
              </div>
              <h4 class="fw-bold text-navy mb-3">Careers & Internships</h4>
              <p class="text-muted mb-4 px-lg-3 text-sm">
                We are always looking for talented Policy Analysts, Data Scientists, and Strategy Consultants.
              </p>
              <div class="mt-auto">
                <button @click="openForm('career')" class="btn btn-outline-navy rounded-pill px-5 py-2 fw-bold w-100">
                    View Openings
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-5">
             <div class="card h-100 shadow-sm border-0 p-5 text-center hover-card bg-white rounded-4">
              <div class="icon-circle mx-auto mb-4 bg-navy text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M9.828 4a2 2 0 0 1 2.828 0l2.829 2.829a2 2 0 1 1-2.828 2.829L9.828 6.828a2 2 0 0 1 0-2.828zM3.465 1.162l-.707.707 9.899 9.899.707-.707L3.465 1.162z"/>
                    <path fill-rule="evenodd" d="M9.972 2.508a.5.5 0 0 0-.16-.556l-.178-.129a5.009 5.009 0 0 0-2.076-.783C6.215.862 4.504 1.229 2.84 3.133H1.786a.5.5 0 0 0-.354.147L.146 4.567a.5.5 0 0 0 0 .706l2.571 2.579a.5.5 0 0 0 .708 0l1.286-1.29a.5.5 0 0 0 .146-.353V5.57l8.387 8.873A.5.5 0 0 0 14 14.5l1.5-1.5a.5.5 0 0 0 .017-.689l-9.129-8.63c.747-.456 1.772-.839 3.112-.839a.5.5 0 0 0 .472-.334z"/>
                  </svg>
              </div>
              <h4 class="fw-bold text-navy mb-3">Partner With Us</h4>
              <p class="text-muted mb-4 px-lg-3 text-sm">
                Are you a specialized consultant or technology firm? Let's collaborate to deliver superior value.
              </p>
              <div class="mt-auto">
                <button @click="openForm('partner')" class="btn btn-outline-navy rounded-pill px-5 py-2 fw-bold w-100">
                    Collaboration Form
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <transition name="fade-slide">
        <section v-if="activeForm" id="application-section" class="application-portal pb-5 pt-3">
            <div class="container">
                <div class="card border-0 shadow-lg rounded-4 overflow-hidden bg-white position-relative">
                    
                    <button @click="closeForm" class="btn-close-form position-absolute top-0 end-0 m-4 text-muted border-0 bg-transparent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                    </button>

                    <div class="bg-light-grey p-4 border-bottom text-center">
                        <h4 class="fw-bold text-navy m-0">
                            {{ activeForm === 'career' ? 'Career & Internship Application' : 'Partnership Proposal' }}
                        </h4>
                    </div>

                    <div v-if="!isLoggedIn" class="p-5 text-center my-4">
                        <div class="mb-4 text-navy opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/></svg>
                        </div>
                        <h4 class="fw-bold text-navy mb-3">Authentication Required</h4>
                        <p class="text-muted mb-4 mx-auto" style="max-width: 500px;">
                            Please log in or create an account to submit your details. This ensures your documents are securely tied to your profile.
                        </p>
                        <button @click="handleLoginClick" class="btn btn-navy px-5 py-3 rounded-pill fw-bold text-uppercase ls-1">
                            Log In / Sign Up
                        </button>
                    </div>

                    <div v-else class="p-5">
                        
                        <div v-if="feedback" class="alert alert-success fw-bold rounded-3 mb-4 text-center">
                            {{ feedback }}
                        </div>

                        <form v-if="activeForm === 'career' && !feedback" @submit.prevent="submitApplication">
                            <div class="row g-4 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Full Name</label>
                                    <input type="text" name="Applicant_Name" class="custom-input" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Email Address</label>
                                    <input type="email" name="Applicant_Email" class="custom-input" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Position</label>
                                    <select name="Role_Applied_For" class="custom-input" required>
                                        <option value="">Select a role...</option>
                                        <option>Data Analyst</option>
                                        <option>Research Consultant</option>
                                        <option>ICT Systems Developer</option>
                                        <option>General Internship</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Upload Resume (PDF)</label>
                                    <input type="file" name="Resume_Attachment" class="custom-input file-input" accept=".pdf" required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold text-muted">Cover Letter / Note</label>
                                    <textarea name="Cover_Letter" rows="4" class="custom-input" placeholder="Tell us about your experience..." required></textarea>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-navy w-100 py-3 rounded-pill fw-bold text-uppercase ls-1" :disabled="isSubmitting">
                                {{ isSubmitting ? 'Securely Submitting...' : 'Submit Application' }}
                            </button>
                        </form>

                        <form v-if="activeForm === 'partner' && !feedback" @submit.prevent="submitApplication">
                            <div class="row g-4 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Organization / Consultant Name</label>
                                    <input type="text" name="Organization_Name" class="custom-input" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Contact Email</label>
                                    <input type="email" name="Contact_Email" class="custom-input" required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold text-muted">Partnership Proposal</label>
                                    <textarea name="Proposal_Details" rows="5" class="custom-input" placeholder="Describe how we can collaborate and the expertise you bring..." required></textarea>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold text-muted">Company Profile (Optional)</label>
                                    <input type="file" name="Company_Profile_Attachment" class="custom-input file-input" accept=".pdf">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-navy w-100 py-3 rounded-pill fw-bold text-uppercase ls-1" :disabled="isSubmitting">
                                {{ isSubmitting ? 'Securely Sending Proposal...' : 'Submit Proposal' }}
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </section>
    </transition>

  </main>
</template>

<style scoped>
/* NAVY THEME - Minimized Gold */
.bg-navy { background-color: #1b2c57 !important; }
.text-navy { color: #1b2c57 !important; }
.bg-light-grey { background-color: #f8f9fa; }

.ls-1 { letter-spacing: 1px; }

/* INTRO CARDS */
.icon-circle {
    width: 80px; height: 80px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.3s ease;
    box-shadow: 0 10px 20px rgba(27, 44, 87, 0.2);
}

.hover-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(0,0,0,0.05) !important;
}

.hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important;
    border-color: #1b2c57 !important;
}

.hover-card:hover .icon-circle {
    transform: scale(1.05);
}

/* BUTTON STYLES (Navy & White only) */
.btn-outline-navy {
    border: 2px solid #1b2c57;
    color: #1b2c57;
    background: transparent;
    transition: all 0.3s ease;
}
.btn-outline-navy:hover {
    background: #1b2c57;
    color: white;
}

.btn-navy {
    background-color: #1b2c57;
    color: white;
    border: 2px solid #1b2c57;
    transition: all 0.3s ease;
}
.btn-navy:hover {
    background-color: white;
    color: #1b2c57;
}

/* FORM INPUTS */
.custom-input {
    width: 100%; background-color: #f4f5f7; border: none;
    border-bottom: 2px solid #ccc; border-radius: 4px 4px 0 0;
    padding: 12px 15px; color: #333; transition: all 0.3s ease;
}
.custom-input:focus {
    outline: none; background-color: white;
    border-bottom-color: #1b2c57; 
    box-shadow: 0 5px 15px rgba(27, 44, 87, 0.05);
}
.file-input { background-color: white; border: 1px dashed #ccc; }

.btn-close-form { transition: color 0.2s; }
.btn-close-form:hover { color: #1b2c57 !important; }

/* TRANSITION */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>