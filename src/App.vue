<script setup lang="ts">
import DynamicTree from "./pages/DynamicTree.vue";
import Graph from "./pages/Graph.vue"
import { ref } from "vue";

// Track the active tab
const activeTab = ref(1);
</script>

<template>
  <div>
    <h1 class="text-slate-100 mb-10 text-md">
      Welcome to
      <span class="text-yellow-400"> Qi Card</span>
      live tasks demo!
    </h1>

    <!-- Tab Navigation -->
    <div class="flex border-gray-300">
      <button
        class="py-2 px-4 text-lg font-medium"
        :class="{ 'border-b-2 border-yellow-400': activeTab === 1 }"
        @click="activeTab = 1"
      >
        Dynamic Tree
      </button>
      <button
        class="py-2 px-4 text-lg font-medium"
        :class="{ 'border-b-2 border-yellow-400': activeTab === 2 }"
        @click="activeTab = 2"
      >
        Graph
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-4">
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
  transition: all 0.3s;
}

</style>
