import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Member from '../components/Member.vue'
import Teacher from '../components/Teacher.vue'
import Finance from '../components/Finance.vue'
import Admin from '../components/Admin.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/member', component: Member },
    { path: '/teacher', component: Teacher },
    { path: '/finance', component: Finance },
    { path: '/admin', component: Admin },
    { path: '/:pathMatch(.*)*', redirect: '/login' }
  ]
})
