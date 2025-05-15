<script setup lang="ts">

</script>

<template>
  <nav>
    <router-link to="/"> Home </router-link>
    <router-link to="/feed"> Feed </router-link>
    <router-link to="/sign-in"> Sign In </router-link>
    <router-link to="/register"> Register </router-link>
    <button @click="handleSignOut" v-if="isLoggedIn">Sign Out</button>
  </nav>
  <router-view />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const isLoggedIn = ref(false);
const router = useRouter();

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
      isLoggedIn.value = true;
    } else {
      console.log("No user is signed in.");
      isLoggedIn.value = false;
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