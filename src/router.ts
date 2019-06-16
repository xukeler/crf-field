import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import FieldConf from './components/FieldConf.vue'
import CrfHome from './components/CrfHome.vue'
import CrfAdd from './components/CrfAdd.vue'
import OptionHome from './components/OptionHome.vue'
import BaseMain from './components/BaseMain.vue'
import DomainHome from './components/DomainHome.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'field',
          name: 'FieldConf',
          // meta: ["FieldConf"],
          meta: ["/home/field"],
          component: FieldConf
        },
        {
          path: 'crf',
          // meta: ["crf"],
          meta: ["/home/crf"],
          name: 'CrfHome',
          component: CrfHome
        },
        {
          path: 'crfadd',
          name: 'CrfAdd',
          // meta: ["crf"],
          meta: ["/home/crf"],
          component: CrfAdd
        },
        {
          path: 'option',
          name: 'OptionHome',
          // meta: ["option"],
          meta: ['/home/option'],
          component: OptionHome
        },
        {
          path: 'basemain',
          name: 'BaseMain',
          // meta: ["BaseMain"],
          meta: ["/home/basemain"],
          component: BaseMain
        },
        {
          path: 'domain',
          name: 'DomainHome',
          // meta: ["domain"],
          meta: ['/home/domain'],
          component: DomainHome
        },
        {
          path: '',
          redirect: 'crf'
        },
      ],
    },
    {
      path: '*',
      redirect: '/Login'
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
