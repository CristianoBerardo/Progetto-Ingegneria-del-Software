<template>
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email"/></p>
    <p><input type="password" placeholder="Password" v-model="password"/></p>
    <p v-if="errMsg"> {{ errMsg }}</p>
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
const errMsg = ref();

const register = async () => {
    const auth = getAuth(); //saved in local storage by default
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
            // Signed in
            console.log("Successfully registered!");
            console.log(auth.currentUser);
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