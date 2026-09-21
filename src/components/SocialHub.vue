<script setup>
import { store } from '../store';

// 1. SMART TIME FORMATTER
const timeAgo = (dateString) => {
    // If it's old legacy text (like "2 Days Ago"), just show it
    if (!dateString.includes('T') && !dateString.includes('-')) return dateString;

    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
};

// 2. ICON HELPER
const getPlatformConfig = (platformName) => {
    const p = platformName ? platformName.toLowerCase() : 'linkedin';
    if (p.includes('linked')) {
        return { 
            color: '#0077b5', 
            icon: '<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>'
        };
    } else if (p.includes('twitter') || p.includes('x')) {
        return { 
            color: '#000000', 
            icon: '<path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>'
        };
    } else {
        return { 
            color: '#1877f2', 
            icon: '<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>'
        };
    }
};
</script>

<template>
  <section class="py-5 bg-white border-top">
    <div class="container py-4">
      
      <div class="row justify-content-center text-center mb-5" v-scroll-reveal>
        <div class="col-lg-8">
            <h6 class="text-uppercase text-gold ls-2 fw-bold mb-2">Stay Connected</h6>
            <h2 class="display-6 fw-bold text-navy">Community & Updates</h2>
            <div class="divider mx-auto mt-4 bg-gold"></div>
        </div>
      </div>

      <div class="row g-4">
          <div class="col-md-4" v-for="(post, index) in store.content.socialUpdates" :key="post.id">
              <div class="card h-100 border-0 shadow-sm social-card">
                  <div class="card-body p-4 d-flex flex-column">
                      
                      <div class="d-flex align-items-center mb-3">
                          <div 
                            class="icon-circle text-white me-3" 
                            :style="{ backgroundColor: getPlatformConfig(post.platform).color }"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" v-html="getPlatformConfig(post.platform).icon"></svg>
                          </div>
                          <div>
                              <h6 class="fw-bold mb-0 text-navy">{{ post.platform }}</h6>
                              <small class="text-muted">{{ timeAgo(post.date) }}</small>
                          </div>
                      </div>

                      <p class="text-muted small mb-4 flex-grow-1">
                          "{{ post.text }}"
                      </p>

                      <a :href="post.link" target="_blank" class="text-navy fw-bold small text-decoration-none stretched-link">
                          View Post &rarr;
                      </a>

                  </div>
              </div>
          </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.text-navy { color: #1a2b49; }
.text-gold { color: #D4AF37; }
.bg-gold { background-color: #D4AF37; }
.ls-2 { letter-spacing: 2px; font-size: 0.8rem; }
.divider { width: 60px; height: 3px; border-radius: 2px; }
.social-card { transition: transform 0.3s ease; background: #f8f9fa; }
.social-card:hover { transform: translateY(-5px); background: #fff; box-shadow: 0 15px 30px rgba(26, 43, 73, 0.1) !important; }
.icon-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
</style>