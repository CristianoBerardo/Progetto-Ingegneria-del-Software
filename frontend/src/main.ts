import "./assets/main.css";
import 'primeicons/primeicons.css'

import { createPinia } from "pinia";
import { createApp } from "vue";
import { useThemeStore } from "./stores/themeStore";
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

const toastOptions = {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false
}
  
app.use(pinia);
app.use(router);
app.use(Toast, toastOptions);

const themeStore = useThemeStore();
themeStore.initTheme();

app.mount("#app");
