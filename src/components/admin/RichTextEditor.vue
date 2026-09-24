<template>
  <div class="rich-text-editor border rounded-0 bg-white d-flex flex-column mb-2" :class="{ 'focus-ring': isFocused }">
    <!-- Toolbar -->
    <div class="toolbar d-flex flex-wrap gap-1 p-2 border-bottom bg-light">
      <button type="button" @click.prevent="format('bold')" class="btn btn-sm btn-light border-0 rounded-0 p-1 px-2 text-navy" title="Bold">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4 2v12h4.5a3.5 3.5 0 0 0 0-7h-1.5v-5h3.5a2.5 2.5 0 0 0 0-5H4zm2 2h2.5a1.5 1.5 0 0 1 0 3H6V4zm0 5h3.5a1.5 1.5 0 0 1 0 3H6V9z"/></svg>
      </button>
      <button type="button" @click.prevent="format('italic')" class="btn btn-sm btn-light border-0 rounded-0 p-1 px-2 text-navy" title="Italic">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.528-.71V2.62c-1.32-.057-2.673-.131-3.69-.131-1.026 0-2.39.074-3.69.131v1.125c1.282 0 1.405.115 1.282.71l-1.539 7.22c-.124.594-.247.71-1.529.71v1.125c1.32.056 2.673.13 3.69.13 1.025 0 2.39-.074 3.69-.13v-1.125c-1.283 0-1.406-.116-1.283-.71z"/></svg>
      </button>
      <button type="button" @click.prevent="format('underline')" class="btn btn-sm btn-light border-0 rounded-0 p-1 px-2 text-navy" title="Underline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4 2v6a4 4 0 0 0 8 0V2h-2v6a2 2 0 0 1-4 0V2H4zm-2 11v2h12v-2H2z"/></svg>
      </button>
      <div class="vr mx-1"></div>
      <button type="button" @click.prevent="format('insertUnorderedList')" class="btn btn-sm btn-light border-0 rounded-0 p-1 px-2 text-navy" title="Bullet List">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>
      </button>
      <button type="button" @click.prevent="format('insertOrderedList')" class="btn btn-sm btn-light border-0 rounded-0 p-1 px-2 text-navy" title="Numbered List">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/><path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.207-.151-.31-.344-.31-.229 0-.374.146-.375.36h-.599c.002-.462.4-.707.962-.707.593 0 .963.265.963.7 0 .285-.183.504-.469.605.334.05.534.286.534.622 0 .466-.414.771-1.002.771-.59 0-1.015-.276-1.015-.74h.6c.004.244.205.378.43.378.232 0 .416-.142.416-.347 0-.21-.19-.345-.436-.345H1.713zm.18-5.326h-.605c.002-.455.395-.73.963-.73.55 0 .927.248.927.653 0 .27-.168.49-.446.591.31.077.493.303.493.616 0 .47-.393.766-.967.766-.566 0-.964-.267-.964-.738h.606c.002.261.22.392.427.392.203 0 .358-.125.358-.32 0-.2-.162-.32-.387-.32H1.933v-.444h.346c.198 0 .344-.124.344-.313 0-.17-.145-.297-.333-.297-.2 0-.361.127-.361.306H1.893zm1.104-4.83H1.97v1.89H1.41V2.13h.643l-.936-1.503h.602l.683 1.096h.023l.163-.263.397-.833z"/></svg>
      </button>
      <div class="vr mx-1"></div>
      <button type="button" @click.prevent="format('justifyLeft')" class="btn btn-sm btn-light border-0 rounded-0 p-1 px-2 text-navy">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>
      </button>
      <button type="button" @click.prevent="format('justifyCenter')" class="btn btn-sm btn-light border-0 rounded-0 p-1 px-2 text-navy">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>
      </button>
    </div>
    
    <!-- Content Editor -->
    <div 
      class="editor-content p-3 bg-white"
      :style="{ minHeight: minHeight || '150px' }"
      contenteditable="true"
      @input="updateContent"
      @focus="isFocused = true"
      @blur="isFocused = false"
      ref="editor"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  minHeight: {
    type: String,
    default: '150px'
  }
});

const emit = defineEmits(['update:modelValue']);
const editor = ref(null);
const isFocused = ref(false);

let isInternalChange = false;

onMounted(() => {
  if (editor.value) {
    editor.value.innerHTML = props.modelValue || '';
  }
});

watch(() => props.modelValue, (newVal) => {
  if (isInternalChange) {
    isInternalChange = false;
    return;
  }
  if (editor.value && editor.value.innerHTML !== newVal) {
    editor.value.innerHTML = newVal || '';
  }
});

const format = (command) => {
  document.execCommand(command, false, null);
  updateContent();
  if (editor.value) {
    editor.value.focus();
  }
};

const updateContent = () => {
  isInternalChange = true;
  emit('update:modelValue', editor.value.innerHTML);
};
</script>

<style scoped>
.editor-content {
  outline: none;
  overflow-y: auto;
}
.editor-content p {
  margin-bottom: 0.5rem;
}
.rich-text-editor.focus-ring {
  border-color: #86b7fe !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
