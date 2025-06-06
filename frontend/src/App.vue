<script setup lang="ts">
import { onMounted, ref } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import ThemeToggle from "./components/ThemeToggle.vue";
import { logoutUser } from "./services/authService";
import { useCartStore } from "@/stores/cartStore";

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
    router.push("/home");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
</script>

<template>
  <header>
    <ThemeToggle />
  </header>
  <nav class="main-nav">
    <div class="nav-left">
      <router-link to="/home">Home</router-link>
      <router-link to="/explore-products">Esplora prodotti</router-link>
      <router-link to="/your-orders" v-if="isLoggedIn && userStore.role === 'client'"
        >I tuoi ordini</router-link
      >
      <router-link to="/dashboard" v-if="isLoggedIn && userStore.role === 'producer'"
        >Dashboard</router-link
      >
      <router-link to="/cart" class="cart-link" v-if="userStore.role !== 'producer'">
        <i class="pi pi-shopping-cart"></i>
        Carrello ({{ cartStore.items.length }})
      </router-link>
    </div>

    <div class="nav-auth">
      <router-link to="/register" v-if="!isLoggedIn" class="register-btn">Register</router-link>
      <router-link to="/sign-in" v-if="!isLoggedIn" class="sign-in-btn">Sign In</router-link>
      <button @click="handleSignOut" v-if="isLoggedIn" class="sign-out-btn">Sign Out</button>
    </div>
  </nav>
  <router-view />
</template>

<style scoped>
.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sign-out-btn {
  background-color: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.sign-out-btn:hover {
  background-color: #e74c3c;
  color: white;
  box-shadow: 0 2px 5px rgba(231, 76, 60, 0.3);
}

.sign-out-btn:active {
  transform: translateY(1px);
}

/* Adjust button in dark mode if you're using the theme toggle */
:root.dark-theme .sign-out-btn {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

:root.dark-theme .sign-out-btn:hover {
  background-color: #ff6b6b;
  color: #222;
}

.sign-in-btn {
  background-color: transparent;
  border: 1px solid #30a15f;
  color: #30a15f;
  padding: 5px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  margin-left: 8px;
  text-decoration: none;
  display: inline-block;
}

.sign-in-btn:hover {
  background-color: #30a15f;
  color: white;
  box-shadow: 0 2px 5px rgba(46, 204, 113, 0.3);
}

.sign-in-btn:active {
  transform: translateY(1px);
}

/* Dark mode adjustments */
:root.dark-theme .sign-in-btn {
  border-color: #30a15f;
  color: #30a15f;
}

:root.dark-theme .sign-in-btn:hover {
  background-color: #30a15f;
  color: #222;
}
</style>
