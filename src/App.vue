<script setup lang="ts">
/**
 * Main application layout with:
 * - Collapsible sidebar navigation
 * - Async tab loading with caching
 * - Language toggle
 * 
 */

import { ref, computed, defineAsyncComponent, onUnmounted } from "vue";
import { useLayoutStore } from "@stores/layout";
import { storeToRefs } from "pinia";
import Icon from "@components/common/Icon.vue";
import LanguageToggle from "@components/common/LanguageToggle.vue";
import Loading from "@components/common/Loading.vue";
import ICONS from "./utils/icons";

// Track the active tab
const activeTab = ref(1);

// Use the layout store
const layoutStore = useLayoutStore();
const { isSidebarOpen, tabs } = storeToRefs(layoutStore);

// Track loaded components
const loadedComponents = new Map<number, any>();

const activeComponent = computed(() => {
  const tab = tabs.value.find((t) => t.id === activeTab.value);
  if (!tab) return null;

  // Return cached component if exists
  if (loadedComponents.has(tab.id)) {
    return loadedComponents.get(tab.id);
  }

  // Create and cache new async component
  const asyncComponent = defineAsyncComponent({
    loader: tab.component,
    errorComponent: {
      template:
        '<div class="p-4 text-center text-red-500">Error loading component</div>',
    },
    delay: 200,
    timeout: 3000,
  });

  loadedComponents.set(tab.id, asyncComponent);
  return asyncComponent;
});

// Cleanup
onUnmounted(() => {
  loadedComponents.clear();
});
</script>

<template>
  <div class="min-h-screen text-gray-100 font-sans flex">
    <!-- Sidebar -->
    <div
      class="!bg-slate-900 p-4 transition-all duration-300 ease-in-out rounded-md flex flex-col"
      :class="isSidebarOpen ? 'w-60' : 'w-20'"
    >
      <!-- Sidebar Header -->
      <div
        class="flex items-center mb-6"
        :class="isSidebarOpen ? 'justify-between' : 'flex-col'"
      >
        <img
          src="/src/assets/Qi Card PNG.png"
          alt="logo"
          :class="isSidebarOpen ? 'w-13 h-13' : 'w-10 h-10'"
          fetchPriority="high"
        />

        <!-- Toggle Button -->
        <button
          @click="layoutStore.toggleSidebar"
          class="text-gray-400 hover:text-white focus:outline-none"
          :class="isSidebarOpen ? '' : 'mb-2'"
          :aria-label="isSidebarOpen ? $t('closeSidebar') : $t('openSidebar')"
        >
          <Icon iconClass="h-6 w-6" strokeWidth="2" :d="ICONS.TOGGLE" />
        </button>
      </div>

      <!-- Sidebar Navigation -->
      <nav class="flex-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="w-full flex items-center p-2 text-lg font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 mt-2 group"
          :class="{ 'bg-gray-700': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <Icon
            :iconClass="'h-5 w-5'"
            :class="isSidebarOpen ? 'mr-3' : 'mx-auto'"
            strokeWidth="2"
            :d="tab.icon"
          />
          <span v-if="isSidebarOpen">{{ $t(tab.label) }}</span>
          <div
            v-else
            class="absolute left-20 ml-2 px-2 py-1 bg-gray-800 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {{ $t(tab.label) }}
          </div>
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

        <LanguageToggle class="flex justify-end items-center" />
      </div>

      <!-- Tab Content -->
      <div>
        <Suspense>
          <component :is="activeComponent" :key="activeTab" />
          <template #fallback>
            <Loading />
          </template>
        </Suspense>
      </div>
    </div>
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
