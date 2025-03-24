<script setup lang="ts">
import DynamicTree from "@/pages/DynamicTree.vue";
import Dashboard from "@/pages/Dashboard.vue";
import { ref } from "vue";
import LangougeToggle from "@components/common/LangougeToggle.vue";
import { useLayoutStore } from "@stores/layout";
import Icon from "@components/common/Icon.vue";
import { storeToRefs } from "pinia";

// Track the active tab
const activeTab = ref(2);

// Use the layout store
const layoutStore = useLayoutStore();
const { isSidebarOpen, tabs } = storeToRefs(layoutStore); 
</script>

<template>

  <div class="min-h-screen text-gray-100 font-sans flex">
    <!-- Sidebar -->
    <div
      class="!bg-slate-900 w-60 p-4 transition-all duration-300 ease-in-out rounded-md"
      :class="{ '-ml-64': !isSidebarOpen }"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between mb-6">
        <!-- <h2 class="text-xl font-semibold">{{ $t("menu") }}</h2> -->
        <img
            src="/src/assets/Qi Card PNG.png"
            alt="logo"
            class="w-13 h-13"
            fetchPriority="high"
          />
        <!-- Toggle Button Inside Sidebar -->
        <button
          v-if="isSidebarOpen"
          @click="layoutStore.toggleSidebar"
          class="text-gray-400 hover:text-white focus:outline-none"
          :aria-label="isSidebarOpen ? $t('closeSidebar') : $t('openSidebar')"
        >
          <Icon
            iconClass="h-6 w-6"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </button>
      </div>

      <!-- Sidebar Navigation -->
      <nav>
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="w-full flex items-center p-2 text-lg font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 mt-2"
          :class="{ 'bg-gray-700': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <Icon
            :iconClass="'h-5 w-5 mr-3'"
            strokeWidth="2"
            :d="tab.icon"
          />
          {{ $t(tab.label) }}
        </button>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 px-5">
      <!-- Header -->
      <div
        class="flex justify-between items-center mb-5 bg-slate-900 rounded-md py-10 h-15 px-5"
      >
        <div class="flex gap-2 items-center">
          <p class="text-2xl font-bold">{{ $t("title") }}</p>
        </div>
        <LangougeToggle class="flex justify-end items-center" />
      </div>

      <!-- Tab Content -->
      <div>
        <div v-if="activeTab === 1">
          <!-- Dashboard  -->
          <Dashboard />
        </div>
        <div v-if="activeTab === 2">
          <!-- Dynamic Tree  -->
          <DynamicTree />
        </div>
      </div>
    </div>

    <!-- Toggle Button -->
    <button
      v-if="!isSidebarOpen"
      @click="layoutStore.toggleSidebar"
      class="fixed left-2 top-2 text-gray-400 hover:text-white focus:outline-none z-50"
      :aria-label="isSidebarOpen ? $t('closeSidebar') : $t('openSidebar')"
    >
      <Icon iconClass="h-6 w-6" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
    </button>
  </div>
</template>

<style scoped>
button {
  transition: color 0.3s ease;
}

button:hover {
  @apply text-[#F2CE00];
}
</style>