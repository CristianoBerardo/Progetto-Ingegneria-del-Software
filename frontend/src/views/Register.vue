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