<script setup lang="ts">
import { onMounted, ref } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { useUserStore } from '@/stores/userStore';
import ThemeToggle from './components/ThemeToggle.vue';

const isLoggedIn = ref(false);
const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.email);
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

<template>
  <header>
    <h4>Benvenuto in AgriTrento!</h4>
    <ThemeToggle />
  </header>
  <nav class="main-nav">
    <router-link to="/">Home</router-link>
    <router-link to="/client-feed" v-if="isLoggedIn && userStore.role === 'client'">Feed</router-link>
    <router-link to="/producer-feed" v-if="isLoggedIn && userStore.role === 'producer'">Feed</router-link>
    <router-link to="/sign-in" v-if="!isLoggedIn">Sign In</router-link>
    <router-link to="/register" v-if="!isLoggedIn">Register</router-link>
    <button @click="handleSignOut" v-if="isLoggedIn">Sign Out</button>
  </nav>
  <router-view />
</template>
<!-- 
<style scoped>
.main-nav {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--color-background);
}
</style> -->
