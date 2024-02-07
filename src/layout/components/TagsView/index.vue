<template>
  <div class="tags-container">
    <scroll-pane ref="scrollPaneRef" @scroll="handleScroll">
      <router-link
        ref="tagRef"
        v-for="tag in visitedViews"
        :key="tag.fullPath"
        :class="'tags-item ' + (isActive(tag) ? 'active' : '')"
        :to="{ path: tag.fullPath, query: tag.query }"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openTagMenu(tag, $event)"
      >
        {{ translateRouteTitle(tag.title) }}
        <span
          v-if="!isAffix(tag)"
          class="tags-item-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <svg-icon icon-class="close" />
        </span>
      </router-link>
    </scroll-pane>

    <!-- tag标签操作菜单 -->
    <ul v-show="tagMenuVisible" class="tag-menu" :style="{ left: left + 'px', top: top + 'px' }">
      <li @click="refreshSelectedTag(selectedTag)">
        <svg-icon icon-class="refresh" />
        {{ $t('TagsView.Refresh') }}
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <svg-icon icon-class="close" />
        {{ $t('TagsView.Close') }}
      </li>
      <li @click="closeOtherTags">
        <svg-icon icon-class="sort" />
        {{ $t('TagsView.Close Other') }}
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <svg-icon icon-class="back" />
        {{ $t('TagsView.Close left side') }}
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <svg-icon icon-class="right" />
        {{ $t('TagsView.Close right side') }}
      </li>
      <li @click="closeAllTags(selectedTag)">
        <svg-icon icon-class="rank" />
        {{ $t('TagsView.Close all') }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { resolve } from 'path-browserify'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { translateRouteTitle } from '@/utils/i18n'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
import { usePermissionStore } from '@/store/modules/permission'
import { useTagsViewStore } from '@/store/modules/tagsView'
import ScrollPane from './ScrollPane.vue'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()

const permissionStore = usePermissionStore()
const tagsViewStore = useTagsViewStore()
const appStore = useAppStore()

const { visitedViews } = storeToRefs(tagsViewStore)
const settingsStore = useSettingsStore()
const layout = computed(() => settingsStore.layout)

const selectedTag = ref({
  path: '',
  fullPath: '',
  name: '',
  title: '',
  affix: false,
  keepAlive: false
})

const affixTags = ref([])
const scrollPaneRef = ref()
const left = ref(0)
const top = ref(0)

watch(
  route,
  () => {
    addTags()
    moveToCurrentTag()
  },
  {
    immediate: true //初始化立即执行
  }
)

const tagMenuVisible = ref(false) // 标签操作菜单显示状态
watch(tagMenuVisible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeTagMenu)
  } else {
    document.body.removeEventListener('click', closeTagMenu)
  }
})

function filterAffixTags(routes, basePath = '/') {
  const processRoute = (route) => {
    const fullPath = resolve(basePath, route.path)

    const tag = {
      path: route.path,
      fullPath,
      name: String(route.name),
      title: route.meta?.title || 'no-name',
      affix: route.meta?.affix,
      keepAlive: route.meta?.keepAlive
    }

    if (tag.affix) {
      tags.push(tag)
    }

    if (route.children) {
      route.children.forEach(processRoute)
    }
  }

  let tags = []
  routes.forEach(processRoute)

  return tags
}

function initTags() {
  const tags = filterAffixTags(permissionStore.routes)
  affixTags.value = tags
  for (const tag of tags) {
    // 必须有标签名称
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}

function addTags() {
  if (route.meta.title) {
    tagsViewStore.addView({
      name: route.name,
      title: route.meta.title,
      path: route.path,
      fullPath: route.fullPath,
      affix: route.meta?.affix,
      keepAlive: route.meta?.keepAlive
    })
  }
}

function moveToCurrentTag() {
  // 使用 nextTick() 的目的是确保在更新 tagsView 组件之前，scrollPaneRef 对象已经滚动到了正确的位置。
  nextTick(() => {
    for (const tag of visitedViews.value) {
      if (tag.path === route.path) {
        scrollPaneRef.value.moveToTarget(tag)
        // 当 query 不同时，update
        // route.query = { ...route.query, ...tag.query };
        if (tag.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView({
            name: route.name,
            title: route.meta.title || '',
            path: route.path,
            fullPath: route.fullPath,
            affix: route.meta?.affix,
            keepAlive: route.meta?.keepAlive
          })
        }
      }
    }
  })
}

function isActive(tag) {
  return tag.fullPath === route.fullPath
}

function isAffix(tag) {
  return tag?.affix
}

function isFirstView() {
  try {
    return (
      selectedTag.value.fullPath === '/dashboard' ||
      selectedTag.value.fullPath === tagsViewStore.visitedViews[1].fullPath
    )
  } catch (err) {
    return false
  }
}

function isLastView() {
  try {
    return (
      selectedTag.value.fullPath ===
      tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1].fullPath
    )
  } catch (err) {
    return false
  }
}

function refreshSelectedTag(view) {
  tagsViewStore.delCachedView(view)
  const { fullPath } = view
  nextTick(() => {
    router.replace({ path: '/redirect' + fullPath })
  })
}

function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView && latestView.fullPath) {
    router.push(latestView.fullPath)
  } else {
    // 现在默认情况是如果没有标签视图则重定向到主页，
    // 你可以根据自己的需要进行调整。
    if (view?.name === 'Dashboard') {
      // 要重新加载主页
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

function closeSelectedTag(view) {
  tagsViewStore.delView(view).then((res) => {
    if (isActive(view)) {
      toLastView(res.visitedViews, view)
    }
  })
}

function closeLeftTags() {
  tagsViewStore.delLeftViews(selectedTag.value).then((res) => {
    if (!res.visitedViews.find((item) => item.fullPath === route.fullPath)) {
      toLastView(res.visitedViews)
    }
  })
}
function closeRightTags() {
  tagsViewStore.delRightViews(selectedTag.value).then((res) => {
    if (!res.visitedViews.find((item) => item.fullPath === route.fullPath)) {
      toLastView(res.visitedViews)
    }
  })
}

function closeOtherTags() {
  router.push(selectedTag.value)
  tagsViewStore.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}

function closeAllTags(view) {
  tagsViewStore.delAllViews().then((res) => {
    toLastView(res.visitedViews, view)
  })
}

function openTagMenu(tag, e) {
  const menuMinWidth = 105

  const offsetLeft = proxy?.$el.getBoundingClientRect().left // container 左外边距
  const offsetWidth = proxy?.$el.offsetWidth // container 宽度
  const maxLeft = offsetWidth - menuMinWidth // 左边界
  const l = e.clientX - offsetLeft + 15 // 15: 右外边距

  if (l > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = l
  }

  // 混合模式下，需要减去顶部菜单(fixed)的高度
  if (layout.value === 'mix') {
    top.value = e.clientY - 50
  } else {
    top.value = e.clientY
  }

  tagMenuVisible.value = true
  selectedTag.value = tag
}

function closeTagMenu() {
  tagMenuVisible.value = false
}

function handleScroll() {
  closeTagMenu()
}
function findOutermostParent(tree, findName) {
  let parentMap = {}

  function buildParentMap(node, parent) {
    parentMap[node.name] = parent

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        buildParentMap(node.children[i], node)
      }
    }
  }

  for (let i = 0; i < tree.length; i++) {
    buildParentMap(tree[i], null)
  }

  let currentNode = parentMap[findName]
  while (currentNode) {
    if (!parentMap[currentNode.name]) {
      return currentNode
    }
    currentNode = parentMap[currentNode.name]
  }

  return null
}
const againActiveTop = (newVal) => {
  if (layout.value !== 'mix') return
  const parent = findOutermostParent(permissionStore.routes, newVal)
  if (appStore.activeTopMenu !== parent.path) {
    appStore.changeTopActive(parent.path)
  }
}
// 如果是混合模式，更改selectedTag，需要对应高亮的activeTop
watch(
  () => route.name,
  (newVal) => {
    if (newVal) {
      againActiveTop(newVal)
    }
  },
  {
    deep: true
  }
)
onMounted(() => {
  initTags()
})
</script>

<style lang="scss" scoped>
.tags-container {
  width: 100%;
  height: 34px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 1px var(--el-box-shadow-light);

  .tags-item {
    display: inline-block;
    padding: 7px 8px;
    margin: 0 3px;
    font-size: 12px;
    cursor: pointer;
    border-left: 1px solid var(--el-border-color-light);
    border-right: 1px solid var(--el-border-color-light);

    &:first-of-type {
      margin-left: 15px;
    }

    &:last-of-type {
      margin-right: 15px;
    }

    &:hover {
      color: var(--el-color-primary);
    }

    &.active {
      color: #fff;
      background-color: var(--el-color-primary);
      border-color: var(--el-color-primary);

      &::before {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 5px;
        content: '';
        background: #fff;
        border-radius: 50%;
      }
    }
  }
}

.tag-menu {
  position: absolute;
  z-index: 99;
  font-size: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);

  li {
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background: var(--el-fill-color-light);
    }
  }
}
</style>
