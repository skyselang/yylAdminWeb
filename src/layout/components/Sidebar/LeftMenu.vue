<template>
  <el-menu
    :default-active="currRoute.path"
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
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
import { isExternal } from '@/utils/index'
import variables from '@/styles/variables.module.scss'
import SidebarItem from './SidebarItem.vue'
import path from 'path-browserify'

const settingsStore = useSettingsStore()
const appStore = useAppStore()
const currRoute = useRoute()
const layout = computed(() => settingsStore.layout)
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

/**
 * 解析路径
 * @param routePath 路由路径
 */
function resolvePath(routePath) {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }

  // 完整路径 = 父级路径(/level/level_3) + 路由路径
  const fullPath = path.resolve(props.basePath, routePath) // 相对路径 → 绝对路径
  return fullPath
}
</script>
