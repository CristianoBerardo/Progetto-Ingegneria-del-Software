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

const navigateToProfile = () => {
  if (userStore.role === 'client') {
    router.push('/your-orders');
  } else if (userStore.role === 'producer') {
    router.push('/dashboard');
  } else if (userStore.role === 'administrator') {
    router.push('/admin-feed');
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
      <router-link to="/cart" class="cart-link" v-if="userStore.role !== 'producer'">
        <i class="pi pi-shopping-cart"></i>
        Carrello ({{ cartStore.items.length }})
      </router-link>
    </div>

    <div class="nav-auth">
      <router-link to="/register" v-if="!isLoggedIn" class="register-btn">Register</router-link>
      <router-link to="/sign-in" v-if="!isLoggedIn" class="sign-in-btn">Sign In</router-link>
      
      <!-- Menu Profilo per utenti loggati -->
      <div v-if="isLoggedIn" class="profile-menu" @click="navigateToProfile">
        <div class="profile-link">
          <i class="pi pi-user"></i>
          <span>Il mio profilo</span>
        </div>
      </div>
      
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

.profile-menu {
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid #dee2e6;
}

.profile-link:hover {
  background-color: #e9ecef;
  color: #212529;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.profile-link i {
  font-size: 1.1rem;
}

.admin-link {
  background-color: #6f42c1;
  color: white !important;
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.admin-link:hover {
  background-color: #5a359a;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(111, 66, 193, 0.3);
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