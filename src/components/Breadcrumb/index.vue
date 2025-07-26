<template>
  <el-breadcrumb class="h-[50px] flex items-center">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === breadcrumbs.length - 1">
          {{ translateRouteTitle(item.meta.title) }}
        </span>
        <a v-else @click.prevent="handleLink(item)">
          {{ translateRouteTitle(item.meta.title) }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import router from '@/router'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { compile } from 'path-to-regexp'
import { translateRouteTitle } from '@/utils/index'

const currentRoute = useRoute()
const pathCompile = (path) => {
  const { params } = currentRoute
  const toPath = compile(path)
  return toPath(params)
}

const breadcrumbs = ref([])

function getBreadcrumb() {
  let matched = currentRoute.matched.filter((item) => item.meta && item.meta.title)
  const first = matched[0]
  if (!isDashboard(first)) {
    matched = [{ path: '/dashboard', meta: { title: '首页' } }].concat(matched)
  }
  breadcrumbs.value = matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false
  })
}

function isDashboard(route) {
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.toString().trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
}

function handleLink(item) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect).catch((err) => {
      console.warn(err)
    })
    return
  }
  router.push(pathCompile(path)).catch((err) => {
    console.warn(err)
  })
}

watch(
  () => currentRoute.path,
  (path) => {
    if (path.startsWith('/redirect/')) {
      return
    }
    getBreadcrumb()
  }
)

onBeforeMount(() => {
  getBreadcrumb()
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  margin-left: 8px;
  line-height: 50px;
}

.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}
</style>
