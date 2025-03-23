<script setup lang="ts">
import DynamicTree from "./pages/DynamicTree.vue";
import Dashboard from "./pages/Dashboard.vue";
import { ref, watch, onMounted } from "vue";
import LangougeToggle from "./components/common/LangougeToggle.vue";
import { useI18n } from "vue-i18n";
import { useLayoutStore } from "./stores/layout";
import Icon from "./components/common/Icon.vue"; // Import the Icon component
import { storeToRefs } from "pinia";

// Track the active tab
const activeTab = ref(1);

// Track sidebar visibility
const layoutStore = useLayoutStore();
const { isSidebarOpen } = storeToRefs(layoutStore);
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans flex">
    <!-- Sidebar -->
    <div
      class="!bg-[#1E2938] w-60 p-4 transition-all duration-300 ease-in-out rounded-md"
      :class="{ '-ml-64': !isSidebarOpen }"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold">{{ $t("menu") }}</h2>
        <!-- Toggle Button Inside Sidebar -->
        <button
          v-if="isSidebarOpen"
          @click="isSidebarOpen = !isSidebarOpen"
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
          class="w-full flex items-center p-2 text-lg font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
          :class="{ 'bg-gray-700': activeTab === 1 }"
          @click="activeTab = 1"
        >
          <Icon
            iconClass="h-5 w-5 mr-3"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
          {{ $t("dashboard") }}
        </button>

        <button
          class="w-full flex items-center p-2 text-lg font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 mt-2"
          :class="{ 'bg-gray-700': activeTab === 2 }"
          @click="activeTab = 2"
        >
          <Icon
            iconClass="h-5 w-5 mr-3"
            strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
          {{ $t("departments") }}
        </button>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 px-5">
      <!-- Header -->
      <div
        class="flex justify-between items-center mb-5 bg-[#1F2937] rounded-md py-2 px-3"
      >
        <div class="flex gap-3 items-center">
          <img
            src="/src/assets/Qi Card PNG.png"
            alt="logo"
            class="w-20 h-20"
            fetchPriority="high"
          />
          <p class="text-3xl font-bold">{{ $t("title") }}</p>
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
      @click="isSidebarOpen = !isSidebarOpen"
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
