import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/Home.vue'),},
    { path: '/register', name: 'register', component: () => import('../views/Register.vue'),},
    { path: '/sign-in', name: 'signin', component: () => import('../views/SignIn.vue'), },
    { path: '/feed', name: 'feed', component: () => import('../views/Feed.vue'), },
    { path: '/add-product', name: 'addProduct', component: () => import('../views/AddProduct.vue'), },
    { path: '/delete-product/:id', name: 'deleteProduct', component: () => import('../views/DeleteProduct.vue'), },
  ],
})

export default router
