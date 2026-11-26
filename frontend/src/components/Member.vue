<template>
  <div class="role-page">
    <header class="role-header">
      <div>
        <h1 class="role-title">项目成员</h1>
        <p class="role-sub">查看项目经费，提交并跟踪自己的申请</p>
      </div>
      <button class="btn btn-ghost" type="button" @click="goLogin">退出登录</button>
    </header>

    <section class="cards">
      <div class="card">
        <p class="card-label">总预算</p>
        <p class="card-value">¥ 10,000.00</p>
      </div>
      <div class="card">
        <p class="card-label">可用</p>
        <p class="card-value">¥ 6,540.00</p>
      </div>
      <div class="card">
        <p class="card-label">冻结</p>
        <p class="card-value">¥ 2,000.00</p>
      </div>
      <div class="card">
        <p class="card-label">已使用</p>
        <p class="card-value">¥ 1,460.00</p>
      </div>
    </section>

    <section>
      <h2 class="section-title">我的申请</h2>
      <table class="table">
        <thead>
          <tr>
            <th>申请内容</th>
            <th>申请金额</th>
            <th>批准金额</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.title }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.approved }}</td>
            <td>
              <span class="tag" :class="item.tagClass">{{ item.status }}</span>
            </td>
            <td>
              <button class="btn btn-sm" type="button" @click="demo">查看</button>
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
  { id: 1, title: '实验用服务器内存条', amount: '¥ 800.00', approved: '¥ 800.00', status: '待审批', tagClass: 'tag-pending' },
  { id: 2, title: '实验室打印纸', amount: '¥ 200.00', approved: '¥ 200.00', status: '已批准', tagClass: 'tag-approved' },
  { id: 3, title: '移动硬盘', amount: '¥ 460.00', approved: '¥ 460.00', status: '已结算', tagClass: 'tag-done' }
]

function goLogin() {
  router.push('/login')
}

function demo() {
  alert('演示版本，功能待实现')
}
</script>
