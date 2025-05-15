<template>
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email"/></p>
    <p><input type="password" placeholder="Password" v-model="password"/></p>
    <p><button @click="register">Submit</button></p>
    <p><button @click="signInWithGoogle">Sign In With Google</button></p>

</template>
<script setup>
import { ref } from 'vue';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref("");
const password = ref("");
const router = useRouter();
const register = async () => {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            router.push('/feed');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
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