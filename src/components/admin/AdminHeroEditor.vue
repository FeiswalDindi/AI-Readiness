<script setup>
import { defineProps, defineEmits } from 'vue';
import Hero from '../Hero.vue';

const props = defineProps(['slides']);
const emit = defineEmits(['addSlide', 'removeSlide', 'updateSlide']);

const addSlide = () => {
    emit('addSlide');
};

const removeSlide = (index) => {
    if (confirm("Remove this slide?")) {
        emit('removeSlide', index);
    }
};

import confetti from 'canvas-confetti';
import { ref } from 'vue';
import { store } from '../../store';

const uploadingState = ref({});
const uploadProgress = ref({});
const previewMode = ref('desktop');

const handleImageUpload = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;
    
    uploadingState.value = { ...uploadingState.value, [index]: true };
    uploadProgress.value = { ...uploadProgress.value, [index]: 0 };
    
    try {
        const url = await store.uploadImage(file, 'slides', (prog) => {
            uploadProgress.value = { ...uploadProgress.value, [index]: Math.round(prog) };
        });
        props.slides[index].image = url;
    } catch (e) {
        alert("Upload failed. Ensure Firebase Storage is enabled.");
        console.error(e);
    } finally {
        uploadingState.value = { ...uploadingState.value, [index]: false };
        uploadProgress.value = { ...uploadProgress.value, [index]: 0 };
        event.target.value = '';
    }
};
</script>

<template>
  <div class="card border-0 shadow-sm p-4 mb-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
         <h5 class="fw-bold text-navy mb-0">Home Page Slider</h5>
         <button @click="addSlide" class="btn btn-sm btn-outline-primary rounded-0 fw-bold">+ Add New Slide</button>
      </div>

      <!-- EDITOR ON TOP -->
      <div class="row row-cols-1 row-cols-md-2 g-3 mb-5">
          <div v-for="(slide, index) in slides" :key="slide.id" class="col">
              <div class="card border border-secondary p-3 bg-light shadow-sm h-100 rounded-0">
                  <div class="d-flex justify-content-between mb-2 pb-2 border-bottom">
                      <span class="badge bg-secondary rounded-0">Slide {{ index + 1 }}</span>
                      <button @click="removeSlide(index)" class="btn btn-sm text-danger fw-bold p-0">Delete</button>
                  </div>
                  
                  <label class="small text-muted fw-bold">Headline</label>
                  <input v-model="slide.title" class="form-control form-control-sm mb-3 fw-bold rounded-0">
                  
                  <label class="small text-muted fw-bold">Subtitle</label>
                  <RichTextEditor v-model="slide.subtitle" class="mb-3" />
                  
                  <label class="small text-muted fw-bold">Image URL</label>
                  <div class="d-flex gap-2">
                      <div v-if="slide.image" class="border rounded-0 shadow-sm overflow-hidden flex-shrink-0" style="width: 48px; height: 48px;">
                          <img :src="slide.image" class="w-100 h-100 object-fit-cover" alt="Preview">
                      </div>
                      <div class="input-group">
                          <input v-model="slide.image" class="form-control form-control-sm text-muted rounded-0">
                          <input type="file" @change="e => handleImageUpload(e, index)" class="d-none" :id="'slideUpload_'+index" accept="image/*">
                          <label :for="'slideUpload_'+index" class="input-group-text bg-white cursor-pointer fw-bold px-3 m-0 position-relative overflow-hidden rounded-0" style="padding-top: 2px; padding-bottom: 2px;">
                              <div v-if="uploadingState[index]" class="position-absolute top-0 start-0 h-100 bg-success opacity-25" :style="{ width: uploadProgress[index] + '%' }"></div>
                              <span v-if="uploadingState[index]" class="position-relative z-2 small">{{ uploadProgress[index] }}%</span>
                              <span v-else>Upload</span>
                          </label>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <!-- PREVIEW AT THE BOTTOM -->
      <div class="border rounded-0 overflow-hidden shadow-sm position-relative bg-dark d-flex flex-column align-items-center py-4" style="min-height: 600px;">
          <div class="position-absolute top-0 start-0 bg-warning text-dark px-3 py-1 small fw-bold z-2">
              LIVE PREVIEW MODE
          </div>
          
          <div class="position-absolute top-0 end-0 m-3 z-2 btn-group shadow-sm">
              <button @click="previewMode = 'desktop'" class="btn btn-sm rounded-0 fw-bold" :class="previewMode === 'desktop' ? 'btn-light' : 'btn-outline-light'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M6.838 15.223A5.56 5.56 0 0 1 6 12.5V12h4v.5a5.56 5.56 0 0 1-.838 2.723A.5.5 0 0 1 8.73 15.5h-1.46a.5.5 0 0 1-.432-.277z"/></svg> Desktop
              </button>
              <button @click="previewMode = 'mobile'" class="btn btn-sm rounded-0 fw-bold" :class="previewMode === 'mobile' ? 'btn-light' : 'btn-outline-light'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1" viewBox="0 0 16 16"><path d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2zm6 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0z"/></svg> Mobile
              </button>
          </div>

          <div class="preview-wrapper transition-all mt-4" :class="previewMode === 'mobile' ? 'mobile-preview' : 'desktop-preview'">
              <Hero :previewData="slides" />
          </div>
      </div>
  </div>
</template>

<style scoped>
.text-navy { color: #1a2b49; }
.transition-all { transition: all 0.3s ease; }

.preview-wrapper {
    position: relative;
    overflow: hidden;
    background: #fff;
}

.desktop-preview {
    width: 100%;
    height: 600px;
}

.mobile-preview {
    width: 375px;
    height: 700px;
    border: 12px solid #333;
    border-radius: 36px !important; /* Mobile frame rounded corners, this is fine for the device mockup */
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    margin: 20px auto;
}

/* Force Hero component to fit the preview container perfectly */
.preview-wrapper:deep(.hero-section) {
    height: 100% !important;
    min-height: 100% !important;
}

.preview-wrapper:deep(.display-4) {
    /* Scale down hero typography in preview slightly to match container */
    font-size: 2.5rem !important;
}

.mobile-preview:deep(.display-4) {
    font-size: 1.8rem !important;
}
</style>