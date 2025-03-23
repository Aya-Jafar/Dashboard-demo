import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

export const useLayoutStore = defineStore("layout", () => {
  const isSidebarOpen = ref(true);

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


  

  return {
    isSidebarOpen,
  };
});
