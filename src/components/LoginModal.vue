<script setup>
import { ref } from 'vue';
import { store } from '../store';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'vue-router'; 

const router = useRouter(); 

// Form Fields
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref(''); // New Field

// UI States
const errorMessage = ref(''); 
const isLogin = ref(true);
const isLoading = ref(false);

// Password Visibility Toggles
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleSubmit = async () => {
    errorMessage.value = '';
    isLoading.value = true;
    
    try {
        if (isLogin.value) {
            // --- LOGIN LOGIC ---
            const success = await store.login(email.value, password.value);
            if (success) {
                store.closeModal();
                if (store.isAdmin) router.push('/admin');
            } else {
                errorMessage.value = "Invalid email or password.";
            }
        } else {
            // --- SIGN UP LOGIC ---
            
            // 1. Basic Validation
            if (!name.value) {
                errorMessage.value = "Please enter your full name.";
                isLoading.value = false;
                return;
            }

            // 2. Password Match Validation
            if (password.value !== confirmPassword.value) {
                errorMessage.value = "Passwords do not match!";
                isLoading.value = false;
                return;
            }

            // 3. Password Strength (Optional simple check)
            if (password.value.length < 6) {
                errorMessage.value = "Password must be at least 6 characters.";
                isLoading.value = false;
                return;
            }

            const success = await store.signup(name.value, email.value, password.value);
            if (success) {
                store.closeModal();
                router.push('/'); 
            }
        }
    } catch (e) {
        errorMessage.value = "An unexpected error occurred.";
    } finally {
        if (!errorMessage.value) isLoading.value = false;
        else isLoading.value = false;
    }
};

const handleGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    store.closeModal();
  } catch (error) {
    errorMessage.value = "Google sign-in failed.";
  }
};

// Reset fields when switching modes
const toggleMode = () => {
    isLogin.value = !isLogin.value;
    errorMessage.value = '';
    password.value = '';
    confirmPassword.value = '';
};
</script>

<template>
  <div v-if="store.isLoginModalOpen" class="modal-overlay" @click.self="store.closeModal()">
    <div class="glass-card" :class="{ 'signup-mode': !isLogin }">
      <button class="close-btn" @click="store.closeModal()">×</button>
      
      <div class="text-center mb-4">
        <h3 class="fw-bold text-white">{{ isLogin ? 'Welcome Back' : 'Join the Future' }}</h3>
        <p class="text-white-50 small">
            {{ isLogin ? 'Access your dashboard securely.' : 'Create an account to get started.' }}
        </p>
      </div>

      <button @click="handleGoogle" class="social-btn google mb-3">
        <svg class="icon" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
        <span>Continue with Google</span>
      </button>

      <div class="divider text-white-50">or</div>

      <form @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="mb-3 fade-in">
            <input type="text" v-model="name" placeholder="Full Name" required class="glass-input">
        </div>

        <input type="email" v-model="email" placeholder="Email Address" required class="glass-input mb-3">
        
        <div class="password-wrapper mb-3">
            <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="password" 
                placeholder="Password" 
                required 
                class="glass-input"
            >
            <span class="eye-icon" @click="showPassword = !showPassword" title="Show Password">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/></svg>
            </span>
        </div>

        <div v-if="!isLogin" class="password-wrapper mb-3 fade-in">
            <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                v-model="confirmPassword" 
                placeholder="Confirm Password" 
                required 
                class="glass-input"
            >
            <span class="eye-icon" @click="showConfirmPassword = !showConfirmPassword" title="Show Password">
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/></svg>
            </span>
        </div>
        
        <div v-if="errorMessage" class="error-msg d-flex align-items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
            <span>{{ errorMessage }}</span>
        </div>

        <button type="submit" class="submit-btn" :class="{ 'btn-signup': !isLogin }" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account') }}
        </button>
      </form>

      <p class="toggle-text mt-3 text-white-50">
        {{ isLogin ? "No account?" : "Already have an account?" }}
        <span @click="toggleMode" class="text-white fw-bold pointer">{{ isLogin ? 'Sign up' : 'Log in' }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); 
  display: flex; justify-content: center; align-items: center; z-index: 10000;
}
.glass-card {
  background: rgba(26, 43, 73, 0.85); /* Default Navy */
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px;
  padding: 40px; width: 90%; max-width: 420px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); position: relative; text-align: center;
  transition: all 0.3s ease;
}

/* Enhanced Signup Look */
.signup-mode {
    background: rgba(18, 56, 100, 0.95); /* Deeper, richer blue */
    border: 1px solid rgba(14, 165, 233, 0.5); 
    box-shadow: 0 8px 40px 0 rgba(14, 165, 233, 0.2);
}

.glass-input {
  width: 100%; background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2); padding: 12px;
  border-radius: 8px; color: white; outline: none; transition: 0.2s;
}
.glass-input:focus {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
}
.glass-input::placeholder { color: rgba(255, 255, 255, 0.6); }

/* Password Wrapper */
.password-wrapper { position: relative; }
.eye-icon {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    cursor: pointer; color: rgba(255,255,255,0.7); transition: 0.2s;
}
.eye-icon:hover { color: white; }

.submit-btn {
  width: 100%; padding: 12px; background: #ffffff; color: #1a2b49;
  font-weight: bold; border: none; border-radius: 8px; transition: all 0.2s;
}
.submit-btn:hover { transform: scale(1.02); }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

/* Signup Button Variant */
.btn-signup {
    background: #bea429; /* gold */
    color: white;
}
.btn-signup:hover { background: #bea429; }

.social-btn {
  width: 100%; background: white; border: none; padding: 10px;
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  gap: 10px; font-weight: 600; color: #333;
}
.close-btn {
  position: absolute; top: 15px; right: 20px; background: none;
  border: none; color: rgba(255, 255, 255, 0.6); font-size: 1.5rem;
}
.close-btn:hover { color: white; }
.pointer { cursor: pointer; text-decoration: underline; }
.error-msg { color: #ff9999; font-size: 0.85rem; }
.fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>