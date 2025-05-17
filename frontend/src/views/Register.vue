<template>
    <head>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <div class="page-center">
        <div class="register-container">
            <h3>Create an account</h3>
            <p><input type="text" placeholder="Email" v-model="email"/></p>
            <p><input type="password" placeholder="Password" v-model="password"/></p>
            <p v-if="errMsg" class="error-message"> {{ errMsg }}</p>
            <p><button @click="register">Submit</button></p>
            <p><button class="sign-in-google" @click="signInWithGoogle">Sign In With Google</button></p>
        </div>
        <p class="signin-link">Already have an account? <router-link to="/sign-in">Sign In</router-link></p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {getAuth, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref("");
const password = ref("");
const router = useRouter();
const errMsg = ref();

const register = async () => {
    const auth = getAuth(); //saved in local storage by default
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
            // Signed in
            console.log("Successfully registered!");
            //console.log(auth.currentUser);
            console.log(data.user);
            router.push('/feed');
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
</style>