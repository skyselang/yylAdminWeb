<template>
  <el-scrollbar :class="{ 'left-menu-mix': mixLeftMenu }">
    <el-menu
      :default-active="activeMenu"
      :collapse="!appStore.sidebar.opened"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      :unique-opened="false"
      :collapse-transition="false"
      :mode="layout === 'top' ? 'horizontal' : 'vertical'"
    >
      <sidebar-item
        v-for="route in menuList"
        :key="route.path"
        :item="route"
        :base-path="resolvePath(route.path)"
        :is-collapse="!appStore.sidebar.opened"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
import { isExternal } from '@/utils/index'
import variables from '@/styles/variables.module.scss'
import SidebarItem from './SidebarItem.vue'
import path from 'path-browserify'

const props = defineProps({
  menuList: {
    required: true,
    default: () => {
      return []
    },
    type: Array
  },
  basePath: {
    type: String,
    required: true
  }
})

const settingsStore = useSettingsStore()
const appStore = useAppStore()
const currRoute = useRoute()
const layout = computed(() => settingsStore.layout)
const mixLeftMenu = computed(() => settingsStore.layout === 'mix')

// 激活菜单
const activeMenu = computed(() => {
  if (currRoute.meta?.activeMenu) {
    return currRoute.meta.activeMenu
  }
  return currRoute.path
})

/**
 * 解析路径(相对路径 → 绝对路径)
 * @param routePath 路由路径
 */
function resolvePath(routePath) {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  // 完整路径(/system/user) = 父级路径(/system) + 路由路径(user)
  let fullPath = path.resolve(props.basePath, routePath)
  return fullPath
}
</script>

<style lang="scss" scoped>
.left-menu-mix {
  padding-bottom: 50px;
  background-color: var(--menuBg);
}
.el-menu {
  border: none;
}
</style>
