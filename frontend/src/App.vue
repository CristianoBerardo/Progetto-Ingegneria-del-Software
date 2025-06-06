<script setup lang="ts">
import { onMounted, ref } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { useUserStore } from '@/stores/userStore';
import ThemeToggle from './components/ThemeToggle.vue';
import { logoutUser } from "./services/authService";
import { useCartStore } from '@/stores/cartStore';

const isLoggedIn = ref(false);
const userStore = useUserStore();
const router = useRouter();
const cartStore = useCartStore();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log("User is signed in:", user.email);
      isLoggedIn.value = true;
    } else {
      // console.log("No user is signed in.");
      isLoggedIn.value = false;
    }
  });
  cartStore.loadFromLocalStorage(); 
});

const handleSignOut = async () => {
  try {
    await logoutUser();
    console.log("User signed out successfully.");
    isLoggedIn.value = false;
    router.push('/home');
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
</script>

<template>
  <header>
    <h4>Benvenuto in AgriTrento!</h4>
    <ThemeToggle />
  </header>
  <nav class="main-nav">
    <router-link to="/home">Home</router-link>
    <router-link to="/client-feed" v-if="isLoggedIn && userStore.role === 'client'">Feed</router-link>
    <router-link to="/producer-feed" v-if="isLoggedIn && userStore.role === 'producer'">Feed</router-link>
    <router-link to="/sign-in" v-if="!isLoggedIn">Sign In</router-link>
    <router-link to="/register" v-if="!isLoggedIn">Register</router-link>
    <router-link to="/explore-products">Esplora prodotti</router-link>
    <button @click="handleSignOut" v-if="isLoggedIn">Sign Out</button>
    <router-link to="/cart" class="cart-link">
      <i class="pi pi-shopping-cart"></i> 
      Carrello ({{ cartStore.items.length }})
    </router-link>

   
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
