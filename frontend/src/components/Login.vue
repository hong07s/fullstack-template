<template>
    <h1>校园管理经费系统登录</h1>

    <h3 class="h3-login">用户名</h3>
    <input class="login-input" v-model="username">

    <h3 class="h3-login">密码</h3>
    <input class="login-input" v-model="password">

    <button id="login-button" @click="getUser">登录</button>
    <div v-if="submit">
        <p>{{ submit.username }}</p>
        <p>{{ submit.password }}</p>
    </div>

</template>

<script setup>
    import {ref} from "vue"

    const username = ref("")
    const password = ref("")

    const submit = ref(null)

    function getUser(){
        submit.value = {
            username: username.value,
            password: password.value
        }
    }

</script>

<style>
    .login-input {
        display: block;          /* 关键：input 默认是 inline-block，margin auto 对它无效 */
        width: 240px;            /* 必须要固定宽度，否则 auto 没有参照 */
        margin: 8px auto 16px;   /* 左右 auto = 水平居中，上下留间距 */
        box-sizing: border-box;
        height: 36px;
        padding: 0 10px;
        font-size: 14px;
        text-align: left;        /* 输入的文字左对齐，不然会跟着 #app 居中 */
        border: 1px solid #ccc;
        border-radius: 6px;
        outline: none;
    }

    .login-input:focus {
        border-color: #aa3bff;
    }

    #login-button {
        display: block;
        width: 240px;
        margin: 24px auto 0;
        height: 38px;
        font: inherit;
        font-size: 15px;
        color: #fff;
        background: #aa3bff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s, transform 0.05s;
        }

    #login-button:hover {
        background: #9333ea;
    }

    #login-button:active {
        transform: translateY(1px);
    }

    #login-button:disabled {
        background: #c9b3e6;
        cursor: not-allowed;
    }


</style>