<template>
  <div class="role-page">
    <header class="role-header">
      <div>
        <h1 class="role-title">管理员</h1>
        <p class="role-sub">维护项目、账号与角色，不参与审批和结算</p>
      </div>
      <button class="btn btn-ghost" type="button" @click="goLogin">退出登录</button>
    </header>

    <section>
      <h2 class="section-title">项目</h2>
      <table class="table">
        <thead>
          <tr>
            <th>项目名称</th>
            <th>负责人</th>
            <th>初始预算</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in projects" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.budget }}</td>
            <td>
              <button class="btn btn-sm btn-ghost" type="button" @click="demo">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section style="margin-top: 28px">
      <h2 class="section-title">账号与角色</h2>
      <table class="table">
        <thead>
          <tr>
            <th>账号</th>
            <th>姓名</th>
            <th>角色</th>
            <th>所属项目</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users" :key="item.id">
            <td>{{ item.account }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.project }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const projects = [
  { id: 1, name: '人工智能实验室', owner: '王老师', budget: '¥ 10,000.00' },
  { id: 2, name: '新材料项目', owner: '刘老师', budget: '¥ 6,000.00' }
]

const users = [
  { id: 1, account: 'zhangsan', name: '张三', role: '成员', project: '人工智能实验室' },
  { id: 2, account: 'wanglaoshi', name: '王老师', role: '老师', project: '人工智能实验室' },
  { id: 3, account: 'caiwu01', name: '赵会计', role: '财务', project: '全部' },
  { id: 4, account: 'admin', name: '管理员', role: '管理员', project: '-' }
]

function goLogin() {
  router.push('/login')
}

function demo() {
  alert('演示版本，功能待实现')
}
</script>
