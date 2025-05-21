import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: () => import("../views/Home.vue") },
    { path: "/register", name: "register", component: () => import("../views/Register.vue") },
    { path: "/sign-in", name: "signin", component: () => import("../views/SignIn.vue") },
    {
      path: "/feed",
      name: "feed",
      component: () => import("../views/Feed.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/add-product",
      name: "addProduct",
      component: () => import("../views/AddProduct.vue"),
    },
    {
      path: "/delete-product/",
      name: "deleteProduct",
      component: () => import("../views/DeleteProduct.vue"),
    },
    {
      path: "/modify-product/",
      name: "modifyProduct",
      component: () => import("../views/ModifyProduct.vue"),
    },
  ],
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
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