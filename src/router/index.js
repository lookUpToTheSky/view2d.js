import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import Workspace from '../views/workspace.vue'

Vue.use(VueRouter)

  const routes = [{
    path: '/',
    // name: 'home',
    component: Home,
    children: [
      {
        path: '',
        name: 'index',
        component: () => import ('../views/index.vue')
      },
      {
        path: '/add-equipment',
        name: 'add-equipment',
        component: () => import ('../views/add-equipment.vue')
      },
      {
        path: '/list-equipment',
        name: 'list-equipment',
        component: () => import ('../views/list-equipment.vue')
      },
      {
        path: '/workspace',
        name: 'workspace',
        component: () => import ('../views/workspace.vue')
      }
    ]
  },{
    path: '/preview',
    name: 'preview',
    component: () => import ('../views/preview.vue')
  }
]


const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
