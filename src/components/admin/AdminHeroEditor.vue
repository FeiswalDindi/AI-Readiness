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
                    <input v-model="slide.image" class="form-control form-control-sm text-muted">
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