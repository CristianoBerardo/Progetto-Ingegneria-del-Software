<template>
    <div class="page-center">
        <div v-if="!userType" class="choose-type-container">
            <h3>Scegli il tipo di account</h3>
            <div class="type-selection">
                <div class="type-card" @click="selectType('cliente')">
                    <div class="type-img cliente-img">
                        <img src="@/assets/icon_client.jpg" alt="Cliente" style="width:48px; height:48px;" />
                    </div>
                    <div class="type-label">Cliente</div>
                </div>
                <div class="type-card" @click="selectType('azienda')">
                    <div class="type-img azienda-img">
                        <img src="@/assets/icon_farmer_market.jpg" alt="Azienda" style="width:48px; height:48px;" />
                    </div>
                    <div class="type-label">Azienda</div>
                </div>
            </div>
        </div>
        <div v-else class="register-container">
            <h3>Crea un account {{ userType === 'cliente' ? 'Cliente' : 'Azienda' }}</h3>
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
            <p><button @click="register">Submit</button></p>
            <p><button class="sign-in-google" @click="signInWithGoogle">Sign In With Google</button></p>
            <p class="back-link"><a href="#" @click.prevent="userType = null">Torna indietro</a></p>
        </div>
        <p class="signin-link">Hai già un account? <router-link to="/sign-in">Sign In</router-link></p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref("");
const password = ref("");
const router = useRouter();
const errMsg = ref();

const userType = ref(null);
const username = ref("");
const phone = ref("");
const address = ref("");

function selectType(type) {
    userType.value = type;
    errMsg.value = "";
    username.value = "";
    email.value = "";
    password.value = "";
    phone.value = "";
    address.value = "";
}

const register = async () => {
    if (!username.value) {
        errMsg.value = userType.value === 'cliente' ? "Inserisci uno username" : "Inserisci il nome azienda";
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
    if (userType.value === 'azienda') {
        if (!phone.value) {
            errMsg.value = "Inserisci un numero di telefono";
            return;
        }
        if (!address.value) {
            errMsg.value = "Inserisci un indirizzo";
            return;
        }
    }
    const auth = getAuth(); //saved in local storage by default
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(async (userCredential) => {
            const idToken = await userCredential.user.getIdToken();
            axios.post(`http://localhost:3000/auth/register/${idToken}`, {
                userType: userType.value,
                name: username.value,
                phone: phone.value,
                address: address.value,
                email: email.value
            })
            .then(res => {
                localStorage.setItem('token', res.data.token);
                console.log("Token ricevuto dal backend", res.data.token);
                router.push('/feed');
            })
            .catch(err => {
                errMsg.value = "Errore durante la registrazione";
                console.error("Errore durante la registrazione:", err);
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            switch (errorCode) {
                case 'auth/invalid-email':
                    errMsg.value = "Invalid email";
                    break;
                case 'auth/email-already-in-use':
                    errMsg.value = "This email is already registered\nWant to sign in?";
                    break;
                case 'auth/weak-password':
                    errMsg.value = "Password should be at least 6 characters";
                    break;
                default:
                    errMsg.value = "Email or password was incorrect";
                    break;
            }
        });
};
const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
        .then((result) => {
            console.log(result.user);
            router.push('/feed');
        }).catch((error) => {
            console.log(error.code);
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errMsg.value = "Popup closed by user";
                    break;
                case 'auth/popup-blocked':
                    errMsg.value = "Popup blocked";
                    break;
                default:
                    errMsg.value = "Error signing in with Google";
                    break;
            }
        });
};
</script>

<style scoped>
body {
    min-height: 100vh;
    margin: 0;
    background: #f7f7f7;
    font-family: 'Quicksand', Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.register-container, input, button, h3, p {
    font-family: 'Quicksand', Arial, sans-serif;
}
h3 {
    text-align: center;
    color: #333;
}
form, .register-container {
    max-width: 350px;
    margin: 60px auto;
    padding: 32px 24px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.08);
}
input[type="text"], input[type="password"] {
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
.sign-in-google{
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
    color: #577c41;
    font-weight: bold;
    text-decoration: none;
    transition: color 0.2s;
}
.signin-link a:hover {
    color: #145300;
    text-decoration: underline;
}
/* ...existing code... */
.choose-type-container {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.08);
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
    transition: border 0.2s, box-shadow 0.2s;
}
.type-card:hover {
    border: 2px solid #577c41;
    box-shadow: 0 2px 8px rgba(87,124,65,0.08);
}
.type-img {
    width: 60px;
    height: 60px;
    background: #e0e0e0;
    border-radius: 50%;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    color: #888;
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