<template>
    <head>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <div class="page-center">
        <div class="sign-in-container">
            <h3>Sign in</h3>
            <p><input type="text" placeholder="Email" v-model="email"/></p>
            <p><input type="password" placeholder="Password" v-model="password"/></p>
            <p v-if="errMsg" class="error-message"> {{ errMsg }}</p>
            <p><button @click="signIn">Submit</button></p>
            <p><button class="sign-in-google" @click="signInWithGoogle">Sign In With Google</button></p>
        </div>
        <p class="register-link">Don't have an account? <router-link to="/register">Register</router-link></p>
        <!-- <p>Forgot your password? <router-link to="/reset-password">Reset Password</router-link></p> -->
    </div>
    </template>
<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref("");
const password = ref("");
const errMsg = ref(); // error message
const router = useRouter();


const signIn = async () => {
    const auth = getAuth(); //saved in local storage by default
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then(async (data) => {
            const idToken = await data.user.getIdToken();
            console.log("Invio token al backend", idToken);
            axios.post('http://localhost:3000/auth/login/firebase', { idToken })
                .then(res => {
                 console.log(res.data.token);
                localStorage.setItem('token', res.data.token);
                router.push('/feed');
            });
            /*
            // Signed in
            console.log("Successfully signed id!");
            //console.log(auth.currentUser);
            console.log(data.user);
            router.push('/feed');*/
        })
        .catch((error) => {
            console.log(error.code);
            switch (error.code) {
                case 'auth/invalid-email':
                    errMsg.value = "Invalid email";
                    break;
                case 'auth/user-not-found':
                    errMsg.value = "This email is not registered";
                    break;
                case 'auth/wrong-password':
                    errMsg.value = "Incorrect password";
                    break;
                case 'auth/missing-password':
                    errMsg.value = "Missing password";
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
.sign-in-container, input, button, h3, p {
    font-family: 'Quicksand', Arial, sans-serif;
}
h3 {
    text-align: center;
    color: #333;
}
form, .sign-in-container {
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
    font-weight: bold;
    text-decoration: none;
    transition: color 0.2s;
}
.register-link a:hover {
    color: #145300;
    text-decoration: underline;
}
</style>