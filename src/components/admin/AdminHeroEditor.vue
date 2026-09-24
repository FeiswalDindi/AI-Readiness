<script setup>
import { defineProps } from 'vue';
import Hero from '../Hero.vue';

// We receive the "Draft" slides from the parent
const props = defineProps(['slides']);

const addSlide = () => {
    props.slides.push({
        id: Date.now(),
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
        title: 'New Headline',
        subtitle: 'New Subtitle'
    });
};

const removeSlide = (index) => {
    if (confirm("Remove this slide?")) {
        props.slides.splice(index, 1);
    }
};

import { ref } from 'vue';
import { store } from '../../store';

const uploadingState = ref({});
const uploadProgress = ref({});

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
         <button @click="addSlide" class="btn btn-sm btn-outline-primary">+ Add New Slide</button>
      </div>

      <div class="row g-4">
          <div class="col-lg-4">
             <div class="d-flex flex-column gap-3" style="max-height: 500px; overflow-y: auto;">
                <div v-for="(slide, index) in slides" :key="slide.id" class="card border p-3 bg-light shadow-sm">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="badge bg-secondary">Slide {{ index + 1 }}</span>
                        <button @click="removeSlide(index)" class="btn btn-sm text-danger fw-bold">Delete</button>
                    </div>
                    <label class="small text-muted fw-bold">Headline</label>
                    <input v-model="slide.title" class="form-control form-control-sm mb-2 fw-bold">
                    
                    <label class="small text-muted fw-bold">Subtitle</label>
                    <input v-model="slide.subtitle" class="form-control form-control-sm mb-2">
                    
                    <label class="small text-muted fw-bold">Image URL</label>
                    <div class="input-group mb-2">
                        <input v-model="slide.image" class="form-control form-control-sm text-muted">
                        <input type="file" @change="e => handleImageUpload(e, index)" class="d-none" :id="'slideUpload_'+index" accept="image/*">
                        <label :for="'slideUpload_'+index" class="input-group-text bg-white cursor-pointer fw-bold px-3 m-0 position-relative overflow-hidden" style="padding-top: 2px; padding-bottom: 2px;">
                            <div v-if="uploadingState[index]" class="position-absolute top-0 start-0 h-100 bg-success opacity-25" :style="{ width: uploadProgress[index] + '%' }"></div>
                            <span v-if="uploadingState[index]" class="position-relative z-2 small">{{ uploadProgress[index] }}%</span>
                            <span v-else>Upload</span>
                        </label>
                    </div>
                </div>
             </div>
          </div>

          <div class="col-lg-8">
              <div class="border rounded overflow-hidden shadow-sm h-100 position-relative bg-dark">
                  <div class="position-absolute top-0 start-0 bg-warning text-dark px-2 py-1 small fw-bold z-2">
                      LIVE PREVIEW MODE
                  </div>
                  <div class="preview-wrapper">
                      <Hero :previewData="slides" />
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<style scoped>
.text-navy { color: #1a2b49; }
.preview-wrapper {
    height: 100%;
    min-height: 400px;
    display: flex;
    flex-direction: column;
}
</style>