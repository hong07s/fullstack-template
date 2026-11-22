<script setup>
  import { ref } from 'vue'
  import Login from './components/Login.vue'
  import Register from './components/Register.vue'

  const page = ref("login")
</script>

<template>
  <!-- <Login v-if="page == 'login'" @go-register="page = 'register'"/>
  <Register v-else @go-login="page = 'login'" /> -->
  <RouterView />
</template>
