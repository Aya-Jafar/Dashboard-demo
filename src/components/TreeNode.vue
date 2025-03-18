<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});

const toggleNode = (node: any) => {
  if (node.children && node.children.length) {
    node.isOpen = !node.isOpen;
  }
};
</script>

<template>
  <div>
    <!-- Only show toggle if the node has children -->
    <div class="flex items-center cursor-pointer">
      <span v-if="node.children && node.children.length" @click="toggleNode(node)" class="mr-2">
        <svg
          v-if="node.isOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 transform rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </span>
      <span @click="toggleNode(node)" class="font-medium">{{ node.label }}</span>
    </div>

    <!-- Render children if node is open -->
    <div v-if="node.isOpen && node.children" class="ml-6">
      <TreeNode
        v-for="(child, idx) in node.children"
        :key="child.id"
        :node="child"
      />
    </div>
  </div>
</template>
