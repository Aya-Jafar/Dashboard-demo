import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

const i18n = createI18n({
  //   legacy: false, // use composition API mode
  locale: "en", // default locale
  fallbackLocale: "en",
  messages: {
    en,
    ar,
  },
});

const app = createApp(App);

app.use(createPinia());
app.use(i18n);

app.mount("#app");
