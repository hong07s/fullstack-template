<template>
  <button class="back-login-btn" type="button" @click="gotologin">登录</button>
  <h1>校园管理经费系统注册</h1>
  
  <h3 class="h3-login">新用户名</h3>
    <input class="login-input" v-model="username">

    <h3 class="h3-login">新密码</h3>
    <input class="login-input" v-model="password">
    
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const emit = defineEmits(['go-login'])

function gotologin() {
  router.push('/login')
}
</script>

<style>
.back-login-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 6px 16px;
  font: inherit;
  font-size: 14px;
  color: #fff;
  background: #aa3bff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.back-login-btn:hover {
  background: #9333ea;
}
</style>