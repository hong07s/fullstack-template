<template>
  <div class="role-page">
    <header class="role-header">
      <div>
        <h1 class="role-title">财务</h1>
        <p class="role-sub">对已批准的申请登记实际花费</p>
      </div>
      <button class="btn btn-ghost" type="button" @click="goLogin">退出登录</button>
    </header>

    <section class="cards">
      <div class="card">
        <p class="card-label">待结算</p>
        <p class="card-value">3</p>
      </div>
      <div class="card">
        <p class="card-label">本月已结算</p>
        <p class="card-value">¥ 4,100.00</p>
      </div>
    </section>

    <section>
      <h2 class="section-title">待结算申请</h2>
      <table class="table">
        <thead>
          <tr>
            <th>申请人</th>
            <th>申请内容</th>
            <th>项目</th>
            <th>批准金额</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.user }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.project }}</td>
            <td>{{ item.approved }}</td>
            <td>
              <button class="btn btn-sm" type="button" @click="demo">登记结算</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const items = [
  { id: 1, user: '张三', title: '实验用服务器内存条', project: '人工智能实验室', approved: '¥ 800.00' },
  { id: 2, user: '王五', title: '示波器维修', project: '电子工程项目', approved: '¥ 1,500.00' },
  { id: 3, user: '李四', title: '实验耗材', project: '新材料项目', approved: '¥ 300.00' }
]

function goLogin() {
  router.push('/login')
}

function demo() {
  alert('演示版本，功能待实现')
}
</script>
