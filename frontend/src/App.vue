<script setup lang="ts">

</script>

<template>
  <nav>
    <router-link to="/"> Home </router-link>
    <router-link to="/feed"> Feed </router-link>
    <router-link to="/sign-in"> Sign In </router-link>
    <router-link to="/register"> Register </router-link>
  </nav>
  <router-view />
</template>