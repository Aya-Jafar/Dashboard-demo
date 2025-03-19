<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

type Locale = "en" | "ar";
const setLanguage = (lang: Locale) => {
  locale.value = lang;
  localStorage.setItem("language", lang);
};
</script>

<template>
  <label class="flex cursor-pointer items-center">
    <input
      type="checkbox"
      class="hidden"
      :checked="locale === 'ar'"
      @change="setLanguage(locale === 'ar' ? 'en' : 'ar')"
    />
    <div
      class="relative w-14 h-7 px-7 py-2 bg-gray-700 rounded-full p-1 transition-all duration-300 flex items-center justify-between"
    >
      <!-- "En" Text (English) -->
      <span
        class="absolute left-1 text-sm font-medium text-white transition-all duration-300"
        >En</span
      >

      <!-- "Ar" Text (Arabic) -->
      <span
        class="absolute right-1 text-sm font-medium text-white transition-all duration-300"
        >Ar</span
      >

      <!-- Toggle Knob -->
      <div
        class="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300"
        :class="{ 'translate-x-7': locale === 'ar' }"
      ></div>
    </div>
  </label>
</template>
