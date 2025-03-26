<script setup lang="ts">
/**
 * SVG Icon Component
 * @prop {string} [iconClass="h-5 w-5"] - Tailwind classes for sizing
 * @prop {string|number} [strokeWidth=2] - Stroke width
 * @prop {string} d - SVG path data (required)
 *
 * @example <Icon d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
 */
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
