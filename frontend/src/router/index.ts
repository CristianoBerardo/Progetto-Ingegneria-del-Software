import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createRouter, createWebHistory } from "vue-router";

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
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      alert("You must be signed in to view this page");
      next("/sign-in");
    }
  } else {
    next();
  }
});

export default router;
