import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import './assets/css/init.scss'
import '@babel/polyfill'; // 兼容IE

Vue.config.productionTip = false

Object.setPrototypeOf = require('setprototypeof') //解决ie兼容性

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
Vue.prototype.$moment = moment;


import api from './api/index';
Vue.prototype.$api = api;

const uuid = require('uuid/v1');
Vue.prototype.$uuid = uuid;


Vue.use(Antd)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
