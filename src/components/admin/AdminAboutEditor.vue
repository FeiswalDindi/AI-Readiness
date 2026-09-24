<script setup>
import { defineProps } from 'vue';
const props = defineProps(['aboutData']);
</script>

<template>
  <div class="card h-100 border-0 shadow-sm p-4">
      <h5 class="fw-bold text-navy mb-3">About Us Text</h5>
      <p class="text-muted small mb-3">This text appears on the "About" page.</p>
      <input type="text" v-model="aboutData.title" class="form-control mb-3" placeholder="Title">
      <RichTextEditor v-model="aboutData.text" />
  </div>
</template>

<style scoped>
.text-navy { color: #1a2b49; }
</style>