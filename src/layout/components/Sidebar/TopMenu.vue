<template>
  <el-scrollbar>
    <el-menu
      mode="horizontal"
      :default-active="activePath"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      @select="selectMenu"
    >
      <el-menu-item v-for="route in topMenu" :key="route.path" :index="route.path">
        <template #title>
          <Icons v-if="route.meta && route.meta.icon" :icon="route.meta.icon" />
          <span v-if="route.path === '/'">{{ translateRouteTitle('首页') }}</span>
          <template v-else>
            <span v-if="route.meta && route.meta.title">
              {{ translateRouteTitle(route.meta.title) }}
            </span>
          </template>
        </template>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { translateRouteTitle } from '@/utils/index'
import variables from '@/styles/variables.module.scss'
const router = useRouter()
const appStore = useAppStore()
const activePath = computed(() => appStore.activeTopMenu)
// 递归跳转
const goFirst = (menu) => {
  if (!menu.length) return
  const [first] = menu
  if (first.children) {
    goFirst(first.children)
  } else {
    router.push({
      name: first.name
    })
  }
}
const selectMenu = (index) => {
  appStore.changeTopActive(index)
  permissionStore.getMixLeftMenu(index)
  const { mixLeftMenu } = permissionStore
  goFirst(mixLeftMenu)
}
const permissionStore = usePermissionStore()
const topMenu = ref([])
onMounted(() => {
  topMenu.value = permissionStore.routes.filter((item) => !item.meta || !item.meta.hidden)
})
</script>

<style lang="scss" scoped>
.el-menu {
  height: 50px !important;
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: $subMenuHover !important;
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus {
  background-color: $subMenuHover !important;
}
.el-menu--horizontal > .el-menu-item.is-active {
  background-color: $subMenuHover !important;
}
</style>
