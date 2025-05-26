<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const isLoggedIn = ref(false);
const router = useRouter();

let auth = getAuth();
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.email);
      isLoggedIn.value = true;
    } else {
      console.log("No user is signed in.");
      isLoggedIn.value = false;
      localStorage.setItem("token", "");
      localStorage.setItem("userRole", "");

    }
  });
});

const handleSignOut = async () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out.");
      router.push("/");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
};
</script>

<template>
  <nav class="main-nav">
    <router-link to="/">Home</router-link>
    <router-link to="/feed">Feed</router-link>
    <router-link to="/sign-in" v-if="!isLoggedIn">Sign In</router-link>
    <router-link to="/register">Register</router-link>
    <router-link to="/add-product">Aggiungi Prodotto</router-link>
    <router-link to="/modify-product/">Modifica Prodotto</router-link>
    <router-link to="/delete-product/">Rimuovi Prodotto</router-link>
    
    <button @click="handleSignOut" v-if="isLoggedIn">Sign Out</button>
  </nav>
  <router-view />
</template>