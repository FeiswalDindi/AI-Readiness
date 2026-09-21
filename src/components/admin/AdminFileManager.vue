<script setup>
import { ref } from 'vue';
import { store } from '../../store';

const isUploading = ref(false);
const newFileName = ref('');
const selectedFile = ref(null);

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        newFileName.value = file.name.split('.')[0]; 
    }
};

const handleUpload = () => {
    if (!selectedFile.value) return;
    isUploading.value = true;

    setTimeout(() => {
        const bytes = selectedFile.value.size;
        let displaySize = (bytes < 1024 * 1024) 
            ? (bytes / 1024).toFixed(0) + ' KB' 
            : (bytes / (1024 * 1024)).toFixed(1) + ' MB';

        store.addResource({
            id: Date.now(),
            title: newFileName.value,
            fileName: selectedFile.value.name, 
            type: selectedFile.value.name.split('.').pop().toUpperCase(),
            size: displaySize,
            status: 'Available',
            date: new Date().toLocaleDateString()
        });

        isUploading.value = false;
        selectedFile.value = null;
        newFileName.value = '';
        alert("File published! (Ensure file is in /public/files/)");
    }, 1500);
};

const deleteResource = (index) => {
    if(confirm("Delete this file?")) store.deleteResource(index);
};
</script>

<template>
  <div class="row g-4">
      <div class="col-lg-5">
          <div class="card border-0 shadow-sm p-4 h-100 bg-white">
              <h5 class="fw-bold text-navy mb-3">Upload Resource</h5>
              <div class="mb-3">
                  <label class="small text-muted mb-1">Select File</label>
                  <input type="file" class="form-control" @change="handleFileSelect">
              </div>
              <div class="mb-3" v-if="selectedFile">
                  <label class="small text-muted mb-1">Display Title</label>
                  <input type="text" class="form-control fw-bold" v-model="newFileName">
                  <small class="text-muted fst-italic mt-1 d-block">Filename: {{ selectedFile.name }}</small>
              </div>
              <button @click="handleUpload" class="btn btn-navy w-100 py-2" :disabled="!selectedFile || isUploading">
                  {{ isUploading ? 'Uploading...' : 'Publish to Portal' }}
              </button>
          </div>
      </div>
      <div class="col-lg-7">
          <div class="card border-0 shadow-sm p-4 h-100 bg-white">
              <h5 class="fw-bold text-navy mb-3">Active Files</h5>
              <ul class="list-group list-group-flush">
                  <li v-for="(file, i) in store.content.resources" :key="file.id" class="list-group-item d-flex justify-content-between align-items-center px-0">
                      <div>
                          <div class="fw-bold text-navy">{{ file.title }}</div>
                          <small class="text-muted">{{ file.fileName }} • {{ file.size }}</small>
                      </div>
                      <button @click="deleteResource(i)" class="btn btn-sm btn-outline-danger px-3">Delete</button>
                  </li>
              </ul>
              <div v-if="!store.content.resources?.length" class="text-center text-muted py-4">No files yet.</div>
          </div>
      </div>
  </div>
</template>

<style scoped>
.text-navy { color: #1a2b49; }
.btn-navy { background-color: #1a2b49; color: white; border: none; }
</style>