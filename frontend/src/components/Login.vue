<template>
    <button class="register-btn" type="button" @click="gotosignup">注册</button>
    <h1>{{ title }}</h1>

    <h3 class="h3-login">用户名</h3>
    <input class="login-input" v-model="username">

    <h3 class="h3-login">密码</h3>
    <input class="login-input" v-model="password">

    <button id="login-button" @click="postData">登录</button>

</template>

<script setup>
    import {ref} from "vue"
    import axios from "axios"

    const title = ref("校园管理经费系统登录")

    const username = ref("")
    const password = ref("")

    const resData = ref(null)

    // function gotosignup(){
    //     title.value = 
    // }

    // 登录
    async function postData(){
        if ( !username.value.trim() && !password.value.trim() ){
            alert("用户名不能为空")
        }
        else if ( !password.value.trim() ){
            alert("请输入密码")
        }
        else {
            try {
                const user = {
                    "username": username.value,
                    "password": password.value
                }
                const resp = await axios.post("http://127.0.0.1:8000/login", user)
                resData.value = resp.data
                console.log("返回结果：", resp.data)
                return user
            } catch(e) {
                console.error(e)
            }
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

    .register-btn {
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

    .register-btn:hover {
        background: #9333ea;
    }


</style>