
<script setup lang="ts">
defineProps({
  iconClass: {
    type: String,
    default: "h-5 w-5",
  },
  strokeWidth: {
    type: [String, Number],
    default: 2,
  },
  d: {
    type: String,
    required: true, 
  },
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="iconClass"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      :d="d"
    />
  </svg>
</template>
