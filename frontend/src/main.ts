import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnCEYeCvKlVrd5nMLo43o6ioFugLF6zL0",
  authDomain: "agritrento-ee49c.firebaseapp.com",
  projectId: "agritrento-ee49c",
  storageBucket: "agritrento-ee49c.firebasestorage.app",
  messagingSenderId: "265629131019",
  appId: "1:265629131019:web:d8cb065dedeaea109b420e",
  measurementId: "G-ETEJWDTJJ6"
};

// Initialize Firebase
initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
