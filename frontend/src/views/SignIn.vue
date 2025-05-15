<template>
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email"/></p>
    <p><input type="password" placeholder="Password" v-model="password"/></p>
    <p v-if="errMsg"> {{ errMsg }}</p>
    <p><button @click="signIn">Submit</button></p>
    <p><button @click="signInWithGoogle">Sign In With Google</button></p>

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
            console.log(auth.currentUser);
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