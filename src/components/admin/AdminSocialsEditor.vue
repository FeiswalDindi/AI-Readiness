<script setup>
import { defineProps } from 'vue';
const props = defineProps(['socials']);

const addSocialPost = () => { 
    props.socials.unshift({ 
        id: Date.now(), 
        platform: 'LinkedIn', 
        date: new Date().toISOString(), 
        text: 'New update...', 
        link: '#' 
    }); 
};

const removeSocialPost = (index) => { 
    props.socials.splice(index, 1); 
};

const updateTimestamp = (post) => { 
    post.date = new Date().toISOString(); 
};

const formatLastUpdated = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div class="card border-0 shadow-sm p-4 h-100">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h5 class="fw-bold text-navy mb-0">Social Media Feeds</h5>
            <small class="text-muted d-none d-md-block">Updates propagate automatically to the footer.</small>
        </div>
        <button @click="addSocialPost" class="btn btn-sm btn-outline-primary">+ Add Post</button>
      </div>

      <div class="table-responsive d-none d-md-block">
        <table class="table align-middle">
          <thead class="bg-light small text-uppercase">
            <tr>
              <th style="width: 150px">Platform</th>
              <th>Post Content</th>
              <th style="width: 200px">Link URL</th>
              <th style="width: 150px">Last Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(post, index) in socials" :key="post.id">
              <td>
                  <select v-model="post.platform" class="form-select form-select-sm" @change="updateTimestamp(post)">
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter (X)">Twitter (X)</option>
                      <option value="Facebook">Facebook</option>
                  </select>
              </td>
              <td>
                  <textarea v-model="post.text" @input="updateTimestamp(post)" class="form-control form-control-sm" rows="1"></textarea>
              </td>
              <td><input v-model="post.link" type="text" class="form-control form-control-sm"></td>
              <td class="small text-muted">{{ formatLastUpdated(post.date) }}</td>
              <td><button @click="removeSocialPost(index)" class="btn btn-sm text-danger">×</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-md-none d-flex flex-column gap-3">
            <div v-for="(post, index) in socials" :key="post.id" class="bg-light p-3 rounded border">
               <div class="d-flex justify-content-between mb-2 align-items-center">
                  <select v-model="post.platform" class="form-select form-select-sm w-auto shadow-sm" @change="updateTimestamp(post)">
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter (X)">Twitter (X)</option>
                      <option value="Facebook">Facebook</option>
                  </select>
                  <button @click="removeSocialPost(index)" class="btn btn-sm text-danger fw-bold">Delete</button>
               </div>
               <textarea v-model="post.text" @input="updateTimestamp(post)" class="form-control form-control-sm mb-2" rows="3" placeholder="Post Content"></textarea>
               <input v-model="post.link" type="text" class="form-control form-control-sm mb-2" placeholder="Link URL">
            </div>
      </div>
  </div>
</template>

<style scoped>
.text-navy { color: #1a2b49; }
</style>