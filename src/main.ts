import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";


const app = createApp(App);

// Create a Pinia store instance and register it
app.use(createPinia());

app.mount("#app");
