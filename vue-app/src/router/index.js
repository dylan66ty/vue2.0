import Vue from 'vue'
import VueRouter from '../vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import A from '../views/A.vue'
import B from '../views/B.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    children: [
      {
        path: 'a',
        component: A,
      },
      {
        path: 'b',
        component: B,
      }
    ]
  }
]

const router = new VueRouter({
  routes
})



export default router
