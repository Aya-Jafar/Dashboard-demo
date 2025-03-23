<script setup lang="ts">
import DynamicTree from "./pages/DynamicTree.vue";
import Dashboard from "./pages/Dashboard.vue";
import { ref, watch, onMounted } from "vue";
import LangougeToggle from "./components/common/LangougeToggle.vue";

import { useI18n } from "vue-i18n";

// Track the active tab
const activeTab = ref(2);

const { locale } = useI18n();

// Initialize locale from localStorage
const savedLocale = localStorage.getItem("language");
if (savedLocale) {
  locale.value = savedLocale; // Set the locale to the saved value
  document.documentElement.dir = savedLocale === "ar" ? "rtl" : "ltr"; // Apply RTL/LTR
}

// Watch for changes to the locale
watch(
  locale,
  (newLocale) => {
    localStorage.setItem("language", newLocale); // Save the new locale to localStorage
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr"; // Apply RTL/LTR
  },
  { immediate: true }
);
</script>

<template>
  <div class="min-h-screen bg-gray-900 p-8 text-gray-100 font-sans">
    <div class="flex justify-between items-center mb-15">
      <div class="flex gap-3 items-center">
        <img src="/src/assets/Qi Card PNG.png" alt="logo" class="w-20 h-20" />
        <p class="text-4xl font-bold">{{ $t("title") }}</p>
      </div>
      <LangougeToggle class="mb-5 flex justify-end items-center" />
    </div>

    <!-- Tab Navigation -->
    <div class="flex border-b border-gray-700">
      <button
        class="py-2 px-4 text-lg font-medium relative"
        :class="{ 'font-bold border-b border-[#F2CE00]': activeTab === 1 }"
        @click="activeTab = 1"
      >
        Dashboard
        <span
          v-if="activeTab === 1"
          class="absolute bottom-0 left-0 w-full h-0.5 text-[#F2CE00] transition-all"
        ></span>
      </button>

      <button
        class="py-2 px-4 text-lg font-medium relative"
        :class="{ 'font-bold border-b border-[#F2CE00]': activeTab === 2 }"
        @click="activeTab = 2"
      >
        Dynamic Tree
        <span
          v-if="activeTab === 2"
          class="absolute bottom-0 left-0 w-full h-0.5 text-[#F2CE00] transition-all"
        ></span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-8">
      <div v-if="activeTab === 1">
        <!-- Graph Tab -->
        <Dashboard />
      </div>
      <div v-if="activeTab === 2">
        <!-- Dynamic Tree Tab -->
        <DynamicTree />
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
