<template>
  <div class="role-page">
    <header class="role-header">
      <div>
        <h1 class="role-title">项目老师</h1>
        <p class="role-sub">审批自己负责项目的申请</p>
      </div>
      <button class="btn btn-ghost" type="button" @click="goLogin">退出登录</button>
    </header>

    <section class="cards">
      <div class="card">
        <p class="card-label">待审批</p>
        <p class="card-value">2</p>
      </div>
      <div class="card">
        <p class="card-label">本月已批准</p>
        <p class="card-value">¥ 1,260.00</p>
      </div>
    </section>

    <section>
      <h2 class="section-title">待审批申请</h2>
      <table class="table">
        <thead>
          <tr>
            <th>申请人</th>
            <th>申请内容</th>
            <th>项目</th>
            <th>金额</th>
            <th>提交时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.user }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.project }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.time }}</td>
            <td>
              <button class="btn btn-sm" type="button" @click="demo">批准</button>
              <button class="btn btn-sm btn-ghost" type="button" @click="demo">减额</button>
              <button class="btn btn-sm btn-ghost" type="button" @click="demo">拒绝</button>
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
  { id: 1, user: '张三', title: '显卡采购', project: '人工智能实验室', amount: '¥ 1,200.00', time: '11-25 14:20' },
  { id: 2, user: '李四', title: '实验耗材', project: '新材料项目', amount: '¥ 300.00', time: '11-26 09:05' }
]

function goLogin() {
  router.push('/login')
}

function demo() {
  alert('演示版本，功能待实现')
}
</script>
