<template>
  <div class="page-center">
    <div v-if="!userType" class="choose-type-container">
      <h3>Scegli il tipo di account</h3>
      <div class="type-selection">
        <div class="type-card" @click="selectType('cliente')">
          <div class="type-img cliente-img">
            <img src="@/assets/icon_client.png" alt="Cliente" style="width: 48px; height: 48px" />
          </div>
          <div class="type-label">Cliente</div>
        </div>
        <div class="type-card" @click="selectType('azienda')">
          <div class="type-img azienda-img">
            <img src="@/assets/icon_producer.png" alt="Azienda" style="width: 48px; height: 48px" />
          </div>
          <div class="type-label">Azienda</div>
        </div>
      </div>
    </div>
    <div v-else class="register-container">
      <h3>Crea un account {{ userType === "cliente" ? "Cliente" : "Azienda" }}</h3>
      <p>
        <input
          type="text"
          :placeholder="userType === 'cliente' ? 'Username' : 'Nome azienda'"
          v-model="username"
        />
      </p>
      <p><input type="text" placeholder="Email" v-model="email" /></p>
      <p><input type="password" placeholder="Password" v-model="password" /></p>
      <p v-if="userType === 'azienda'">
        <input type="text" placeholder="Telefono" v-model="phone" />
      </p>
      <p v-if="userType === 'azienda'">
        <input type="text" placeholder="Indirizzo" v-model="address" />
      </p>
      <p v-if="errMsg" class="error-message">{{ errMsg }}</p>
      <p>
        <button v-if="userType === 'cliente'" @click="registerClient">Crea</button>
        <button v-else @click="registerProducer">Crea</button>
      </p>
      <p class="back-link"><a href="#" @click.prevent="userType = null">Torna indietro</a></p>
    </div>
    <p class="signin-link">Hai già un account? <router-link to="/sign-in">Sign In</router-link></p>
  </div>
</template>

<script setup>
import axios from "axios";
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "@/services/authService";
import { API_URL } from "@/constants/API_URL";

const email = ref("");
const password = ref("");
const router = useRouter();
const errMsg = ref();

const userType = ref(null);
const username = ref("");
const phone = ref("");
const address = ref("");
const API_BASE_URL = API_URL;

function selectType(type) {
  userType.value = type;
  errMsg.value = "";
  username.value = "";
  email.value = "";
  password.value = "";
  phone.value = "";
  address.value = "";
}

const registerClient = async () => {
  if (!username.value) {
    errMsg.value = "Inserisci uno username";
    return;
  }
  if (!email.value) {
    errMsg.value = "Indirizzo email mancante";
    return;
  }
  if (!password.value) {
    errMsg.value = "Inserisci una password";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log("Client registered on Firebase:", userCredential.user);
    const firebaseToken = await userCredential.user.getIdToken();

    console.log("Sending data to backend:", {
      username: username.value,
      email: email.value,
    });

    // Send data to backend
    // const res = await axios.post(`${API_BASE_URL}/auth/register/client/${idToken}`, {
    //   username: username.value,
    //   email: email.value,
    // });

    // ! meglio metterlo nell'header Authorization
    // idToken obtained from Firebase successful sign-up/sign-in
    const res = await axios.post(
      `${API_BASE_URL}/auth/clients`,
      {
        username: username.value,
        email: email.value,
      },
      {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      },
    );
    console.log("Risposta dal backend:", res.data);
    // Save JWT token inside localStorage
    // localStorage.setItem("token", res.data.data.token);
    // localStorage.setItem("userRole", res.data.data.userRole);
    await loginUser(email.value, password.value);
    router.push("/your-orders");
  } catch (error) {
    console.error("Error during Firebase registration:", error);
    if (error.code === "auth/email-already-in-use") {
      errMsg.value = "L'email è già in uso";
    } else if (error.code === "auth/invalid-email") {
      errMsg.value = "L'email non è valida";
    } else if (error.code === "auth/weak-password") {
      errMsg.value = "La password è troppo debole";
    } else {
      errMsg.value = error.response?.data?.message || "Errore durante la registrazione";
    }
  }
};

const registerProducer = async () => {
  if (!username.value) {
    errMsg.value = "Inserisci il nome azienda";
    return;
  }
  if (!email.value) {
    errMsg.value = "Inserisci una email";
    return;
  }
  if (!password.value) {
    errMsg.value = "Inserisci una password";
    return;
  }
  if (!phone.value) {
    errMsg.value = "Inserisci un numero di telefono";
    return;
  }
  if (!address.value) {
    errMsg.value = "Inserisci un indirizzo";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log("Producer registered on Firebase:", userCredential.user);
    const idToken = await userCredential.user.getIdToken();

    console.log("Sending data to backend:", {
      name: username.value,
      phone: phone.value,
      address: address.value,
      email: email.value,
    });

    // Send data to backend
    // const res = await axios.post(`${API_BASE_URL}/auth/register/producer/${idToken}`, {
    //   name: username.value,
    //   phone: phone.value,
    //   address: address.value,
    //   email: email.value,
    // });

    // idToken obtained from Firebase successful sign-up/sign-in
    const res = await axios.post(
      `${API_BASE_URL}/auth/producers`,
      {
        name: username.value,
        phone: phone.value,
        address: address.value,
        email: email.value,
      },
      {
        headers: { Authorization: `Bearer ${idToken}` },
      },
    );

    console.log("Risposta dal backend:", res.data);
    // Save JWT token inside localStorage
    // localStorage.setItem("token", res.data.data.token);
    // localStorage.setItem("userRole", res.data.data.userRole);

    // --- LOGIN ---
    await loginUser(email.value, password.value);
    router.push("/dashboard");
  } catch (error) {
    console.error("Error during Firebase registration:", error);
    if (error.code === "auth/email-already-in-use") {
      errMsg.value = "L'email è già in uso";
    } else if (error.code === "auth/invalid-email") {
      errMsg.value = "L'email non è valida";
    } else if (error.code === "auth/weak-password") {
      errMsg.value = "La password è troppo debole";
    } else {
      errMsg.value = error.response?.data?.message || "Errore durante la registrazione";
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
.register-container {
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
  background: #2b6c18; /* theme color */
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #194f08;
}
.sign-in-google {
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  background: #577c41;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.7em;
  cursor: pointer;
  transition: background 0.2s;
}
.sign-in-google:hover {
  background: #171a16;
}
p {
  text-align: center;
}
.error-message {
  color: #1a4301;
  text-align: center;
  font-size: 0.8em;
}
.signin-link {
  text-align: center;
  margin-top: 18px;
  font-size: 1em;
}
.signin-link a {
  color: #80a469;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.2s;
}
.signin-link a:hover {
  color: #145300;
  text-decoration: underline;
}
.choose-type-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  padding: 32px 24px;
  max-width: 400px;
  margin: 60px auto;
  text-align: center;
}
.type-selection {
  display: flex;
  justify-content: space-around;
  margin-top: 24px;
}
.type-card {
  margin: 10px;
  background: #f7f7f7;
  border: 2px solid #ccc;
  border-radius: 10px;
  width: 130px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border 0.2s,
    box-shadow 1.2s;
}
.type-card:hover {
  border: 3px solid #577c41;
  box-shadow: 0 2px 8px rgba(87, 124, 65, 0.08);
}
.type-img {
  width: 40px;
  height: 40px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.type-label {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
}
.back-link {
  text-align: center;
  margin-top: 10px;
}
.back-link a {
  color: #577c41;
  font-size: 0.9em;
  text-decoration: underline;
  cursor: pointer;
}
</style>
