<script setup lang="ts">
import { useSnackbarStore } from '../../stores/snackbar';

const snackbarStore = useSnackbarStore();
</script>

<template>
  <div
    v-if="snackbarStore.visible"
    class="fixed bottom-5 left-1/2 transform -translate-x-1/2 p-4 max-w-sm w-full text-white rounded-md shadow-lg z-50 transition-all"
    :class="{
      'bg-yellow-500': snackbarStore.type === 'info',
      'bg-sky-500': snackbarStore.type === 'success',
      'bg-red-500': snackbarStore.type === 'error',
    }"
  >
    <p>{{ snackbarStore.message }}</p>
  </div>
</template>