import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import ICONS from "@/utils/icons";

// ==================== TYPE DEFINITIONS ====================
interface Tab {
  id: number;
  label: string;
  icon: string;
  component: any;
}

// ==================== STORE DEFINITION ====================
export const useLayoutStore = defineStore("layout", () => {
  const isSidebarOpen = ref(true);
  const { locale } = useI18n();
  const isMobile = ref(false);

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
  const tabs = ref<Tab[]>([
    {
      id: 1,
      label: "dashboard",
      icon: ICONS.HOME,
      component: () => import("@/pages/Dashboard.vue"),
    },
    {
      id: 2,
      label: "departments",
      icon: ICONS.BUILDINGS,
      component: () => import("@/pages/DynamicTree.vue"),
    },
  ]);

  return {
    tabs,
    isSidebarOpen,
    isMobile,
    toggleSidebar,
  };
});
