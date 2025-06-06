<template>
  <div class="page-center">
    <div class="sign-in-container">
      <h3>Sign in</h3>
      <p><input type="text" placeholder="Email" v-model="email" /></p>
      <p><input type="password" placeholder="Password" v-model="password" /></p>
      <p v-if="errMsg" class="error-message">{{ errMsg }}</p>
      <p><button @click="signIn">Entra</button></p>
    </div>
    <p class="register-link">
      Non hai ancora un account? <router-link to="/register">Registrati!</router-link>
    </p>
    <p class="reset-link">
      Hai dimenticato la password? <router-link to="/reset-password">Reimposta la password</router-link>
    </p>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { loginUser } from "@/services/authService";
import { useUserStore } from "@/stores/userStore";

const email = ref("");
const password = ref("");
const errMsg = ref(); 
const router = useRouter();
const store = useUserStore(); 
const route = useRoute();
const redirectPath = ref(null);

onMounted(() => {
  if (route.query.redirect) {
    redirectPath.value = route.query.redirect;
  }
});

const signIn = async () => {
  try {
    await loginUser(email.value, password.value, redirectPath.value);
    if (!store.role) {
      console.error("User role not set after login");
      errMsg.value = "Errore nel caricamento del profilo utente";
      return;
    }
    if (store.role === "producer") {
      console.log("Ruolo dell'utente:", store.role);
      router.push("/producer-feed");
    } else if (store.role === "client") {
      console.log("Ruolo dell'utente:", store.role);
      router.push("/client-feed");
    } else if (store.role === "administrator") {
      console.log("Ruolo dell'utente:", store.role);
      router.push("/client-feed");
    } else {
      console.error("Ruolo utente non riconosciuto:", store.role);
      errMsg.value = "Ruolo utente non riconosciuto";
      return;
    }
  } catch (error) {
    console.error("Errore durante login:", error);
    switch (error.code) {
      case "auth/invalid-email":
        errMsg.value = "Email non valida";
        break;
      case "auth/user-not-found":
        errMsg.value = "Utente non trovato";
        break;
      case "auth/wrong-password":
        errMsg.value = "Password errata";
        break;
      default:
        errMsg.value = "Errore durante il login";
        break;
    }
  }
};
</script>

<style scoped>
body {
  min-height: 100vh;
  margin: 0;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h3 {
  text-align: center;
  color: #333;
}
form,
.sign-in-container {
  max-width: 350px;
  margin: 60px auto;
  padding: 32px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin: 8px 0 16px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1em;
}
.page-center {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
button {
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  background: #145300; /* theme color */
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.8em;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #0b2f00;
}
.sign-in-google {
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  background: #577c41; /* theme color */
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.7em;
  cursor: pointer;
  transition: background 0.2s;
}
.sign-in-google:hover {
  background: #1a4301;
}
p {
  text-align: center;
}
.error-message {
  color: #3c2202;
  text-align: center;
  font-size: 0.8em;
}
.register-link {
  text-align: center;
  margin-top: 18px;
  font-size: 1em;
}
.register-link a {
  color: #577c41;
  text-decoration: none;
  transition: color 0.2s;
}
.register-link a:hover {
  color: #145300;;
}
</style>
