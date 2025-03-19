<script setup lang="ts">
import DynamicTree from "./pages/DynamicTree.vue";
import Graph from "./pages/Graph.vue";
import { ref } from "vue";

// Track the active tab
const activeTab = ref(1);
</script>

<template>
  <div class="min-h-screen bg-gray-900 p-8 text-gray-100 font-sans">
    <h1 class="text-3xl font-bold mb-10">
      Welcome to
      <span class="text-yellow-400">Qi Card</span>
      tasks demo!
    </h1>

    <!-- Tab Navigation -->
    <div class="flex border-b border-gray-700">
      <button
        class="py-2 px-4 text-lg font-medium relative"
        :class="{ 'text-yellow-400': activeTab === 1 }"
        @click="activeTab = 1"
      >
        Dynamic Tree
        <span
          v-if="activeTab === 1"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transition-all"
        ></span>
      </button>
      <button
        class="py-2 px-4 text-lg font-medium relative"
        :class="{ 'text-yellow-400': activeTab === 2 }"
        @click="activeTab = 2"
      >
        Graph
        <span
          v-if="activeTab === 2"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transition-all"
        ></span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-8">
      <div v-if="activeTab === 1">
        <!-- Dynamic Tree Tab -->
        <DynamicTree />
      </div>
      <div v-if="activeTab === 2">
        <!-- Graph Tab -->
        <Graph />
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: color 0.3s ease;
}

button:hover {
  color: #fbbf24; /* Yellow-400 */
}
</style>