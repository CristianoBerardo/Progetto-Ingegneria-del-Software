<template>
    <head>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <div class="sign-in-container">
    <h3>Log in</h3>
    <p><input type="text" placeholder="Email" v-model="email"/></p>
    <p><input type="password" placeholder="Password" v-model="password"/></p>
    <p v-if="errMsg" class="error-message"> {{ errMsg }}</p>
    <p><button @click="signIn">Submit</button></p>
    <p><button @click="signInWithGoogle">Sign In With Google</button></p>
    </div>
    <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    <!-- <p>Forgot your password? <router-link to="/reset-password">Reset Password</router-link></p> -->
    </template>
<script setup>
import { ref } from 'vue';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref("");
const password = ref("");
const errMsg = ref(); // error message
const router = useRouter();


const signIn = async () => {
    const auth = getAuth(); //saved in local storage by default
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
            // Signed in
            console.log("Successfully signed id!");
            //console.log(auth.currentUser);
            console.log(data.user);
            router.push('/feed');
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
    const response = await fetch('http://localhost:3000/api/auth/google', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
};
</script>


<style scoped>
body {
    background: #f7f7f7;
    font-family: 'Quicksand', Arial, sans-serif;
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
button {
    width: 80%;
    padding: 10px;
    margin-bottom: 10px;
    background: #1a4301; /* theme color */
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.8em;
    cursor: pointer;
    transition: background 0.2s;
}
button:hover {
    background: #145300; 
}
p {
    text-align: center;
}
.error-message {
    color: #1a4301;
    text-align: center;
    font-size: 0.8em;
}

</style>