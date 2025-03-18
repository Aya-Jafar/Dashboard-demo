<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from "vue";

// Defining props for message, type, and duration
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "info", // Could be success, error, info
  },
  duration: {
    type: Number,
    default: 3000, // Duration before auto dismiss in ms
  },
});

const visible = ref(false);

// Show snackbar and then dismiss after duration
onMounted(() => {
  visible.value = true;

  setTimeout(() => {
    visible.value = false;
  }, props.duration);
});
</script>

<template>
  <div
    v-if="visible"
    class="fixed bottom-5 left-1/2 transform -translate-x-1/2 p-4 max-w-sm w-full bg-blue-500 text-white rounded-md shadow-lg z-50 transition-all"
    :class="{
      'bg-blue-500': type === 'info',
      'bg-green-500': type === 'success',
      'bg-red-500': type === 'error',
    }"
  >
    <p>{{ message }}</p>
  </div>
</template>
