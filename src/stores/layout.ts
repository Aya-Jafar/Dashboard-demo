import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

export const useLayoutStore = defineStore("layout", () => {
  const isSidebarOpen = ref(true);
  const { locale } = useI18n();

  const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value);


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

  // Define the tabs
  const tabs = ref([
    {
      id: 1,
      label: "dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      id: 2,
      label: "departments",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
  ]);

  return {
    tabs,
    isSidebarOpen,
    toggleSidebar,
  };
});
