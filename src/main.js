import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // 重置css

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // 全局css

import App from './App'
import store from './store'
import router from './router'

import './permission' // 权限控制
import * as filters from './filters' // 全局筛选器

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // 设置element-ui 默认 size
})

// 注册全局筛选器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
