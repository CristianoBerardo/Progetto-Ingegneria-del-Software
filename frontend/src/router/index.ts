import { auth } from "@/firebase";
import { useUserStore } from "@/stores/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { createRouter, createWebHistory } from "vue-router";
import { useToast } from "vue-toastification";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/home", name: "home", component: () => import("../views/Home.vue") },
    { path: "/", redirect: "/home" },
    { path: "/register", name: "register", component: () => import("../views/Register.vue") },
    { path: "/sign-in", name: "signin", component: () => import("../views/SignIn.vue") },
    { path: "/login", redirect: "/sign-in" },
    {
      path: "/reset-password",
      name: "resetPassword",
      component: () => import("../views/ResetPassword.vue"),
    },
    {
      path: "/explore-products",
      name: "exploreProducts",
      component: () => import("../views/ExploreProducts.vue"),
    },
    { path: "/cart", name: "cart", component: () => import("../views/CartView.vue") },
    {
      path: "/order-confirmation",
      name: "order-confirmation",
      component: () => import("../views/OrderConfirmation.vue"),
    },

    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/ProducerFeed.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/your-orders",
      name: "your-orders",
      component: () => import("../views/ClientFeed.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/admin-feed",
      name: "admin-feed",
      component: () => import("../views/AdminFeed.vue"),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    // Redirect delle vecchie rotte verso ProducerFeed
    {
      path: "/add-product",
      redirect: "/dashboard",
    },
    {
      path: "/delete-product",
      redirect: "/dashboard",
    },
    {
      path: "/modify-product",
      redirect: "/dashboard",
    },
  ],
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      reject,
    );
  });
};

router.beforeEach(async (to, from, next) => {
  const toast = useToast();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      // Controlla se la rotta richiede privilegi admin
      if (to.matched.some((record) => record.meta.requiresAdmin)) {
        const userStore = useUserStore();
        if (userStore.role !== "administrator") {
          toast.error("Accesso negato: solo gli amministratori possono accedere a questa pagina", {
            closeOnClick: true,
          });

          next("/home");
          return;
        }
      }
      next();
    } else {
      toast.error("Devi effettuare il login per accedere a questa pagina", {
        closeOnClick: true,
      });

      next("/sign-in");
    }
  } else {
    next();
  }
});

export default router;
