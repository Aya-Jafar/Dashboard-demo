<!-- <script setup lang="ts">
defineProps({
  iconClass: {
    type: String,
    default: "h-5 w-5",
  },
  strokeWidth: {
    type: [String, Number],
    default: 2,
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
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
    />
  </svg>
</template> -->

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
    required: true, // The path data is required
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
