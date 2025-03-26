<script setup lang="ts">
/**
 * Animated arrow icon that toggles direction
 * @prop {boolean} isOpen - Controls arrow direction
 *
 * @example <OpenIcon :isOpen="isExpanded" />
 */

import ICONS from "@/utils/icons";
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <svg
    v-if="props.isOpen"
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5 transform rotate-90"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      :d="ICONS.OPEN"
    />
  </svg>
  <svg
    v-else
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      :d="ICONS.CLOSED"
    />
  </svg>
</template>
