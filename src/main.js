import Vue from 'vue'

import { getElementSize } from '@/utils/settings'

import 'normalize.css/normalize.css' // 重置css

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // 全局css

import App from './App'
import store from './store'
import router from './router'

import './permission' // 权限控制

Vue.use(Element, {
  size: getElementSize() // 设置 element-ui 默认 size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
