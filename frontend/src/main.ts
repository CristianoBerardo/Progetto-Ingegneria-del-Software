import "./assets/main.css";

import { createPinia } from "pinia";
import { createApp } from "vue";
import { useThemeStore } from "./stores/themeStore";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const themeStore = useThemeStore();
themeStore.initTheme();

app.mount("#app");
