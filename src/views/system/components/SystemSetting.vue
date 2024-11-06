<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="logo">
        <el-switch v-model="settingsStore.sidebarLogo" />
      </el-form-item>
      <el-form-item label="名称">
        <el-switch v-model="settingsStore.sidebarName" />
      </el-form-item>
      <el-form-item label="标签栏">
        <el-switch v-model="settingsStore.tagsView" />
      </el-form-item>
      <el-form-item label="固定头部">
        <el-switch v-model="settingsStore.fixedHeader" />
      </el-form-item>
      <el-form-item label="组件大小">
        <el-select v-model="appStore.size" style="width: 12%" @change="sizeChange">
          <el-option v-for="item in sizes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="主题颜色">
        <ul class="w-full space-x-2 flex py-2">
          <li
            v-for="(color, index) in themeColors"
            :key="index"
            class="inline-block w-[30px] h-[30px] cursor-pointer theme-wrap"
            :style="{ background: color }"
            @click="changeThemeColor(color)"
          >
            <svg-icon v-show="color === currentThemeColor" icon-class="check" />
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="导航模式">
        <ul class="layout">
          <el-tooltip content="左侧模式" placement="right">
            <li
              :class="'layout-item layout-left ' + (settingsStore.layout === 'left' ? 'is-active' : '')"
              @click="changeLayout('left')"
            >
              <div></div>
              <div></div>
            </li>
          </el-tooltip>
          <el-tooltip content="顶部模式" placement="right">
            <li
              :class="'layout-item layout-top ' + (settingsStore.layout === 'top' ? 'is-active' : '')"
              @click="changeLayout('top')"
            >
              <div></div>
              <div></div>
            </li>
          </el-tooltip>
          <el-tooltip content="混合模式" placement="right">
            <li
              :class="'layout-item layout-mix ' + (settingsStore.layout === 'mix' ? 'is-active' : '')"
              @click="changeLayout('mix')"
            >
              <div></div>
              <div></div>
            </li>
          </el-tooltip>
        </ul>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import screenHeight from '@/utils/screen-height'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
import { usePermissionStore } from '@/store/modules/permission'

const height = ref(680)
const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const sizes = [
  { label: '大', value: 'large' },
  { label: '默认', value: 'default' },
  { label: '小', value: 'small' }
]

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
  const parent = findOutermostParent(permissionStore.routes, newVal)
  if (appStore.activeTopMenu !== parent.path) {
    appStore.changeTopActive(parent.path)
  }
}

// 组件大小
function sizeChange(size) {
  appStore.changeSize(size)
}

// 主题颜色
const themeColors = ref(['#409EFF', '#304156', '#11a983', '#13c2c2', '#6959CD', '#f5222d'])
const currentThemeColor = computed(() => {
  return settingsStore.themeColor
})
function changeThemeColor(color) {
  settingsStore.changeSetting({ key: 'themeColor', value: color })
}

// 导航模式
function changeLayout(layout) {
  settingsStore.changeSetting({ key: 'layout', value: layout })
  if (layout === 'mix') {
    route.name && againActiveTop(route.name)
  }
}

onMounted(() => {
  height.value = screenHeight(160)
})
</script>

<style lang="scss" scoped>
.layout {
  flex-wrap: wrap;
  width: 100%;
  height: 50px;

  &-item {
    position: relative;
    margin-bottom: 10px;
    width: 18%;
    height: 45px;
    overflow: hidden;
    cursor: pointer;
    background: #f0f2f5;
    border-radius: 4px;
  }

  &-item.is-active {
    border: 2px solid var(--el-color-primary);
  }

  &-mix div:nth-child(1) {
    width: 100%;
    height: 30%;
    background: #1b2a47;
    box-shadow: 0 0 1px #888;
  }

  &-mix div:nth-child(2) {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30%;
    height: 70%;
    background: #1b2a47;
    box-shadow: 0 0 1px #888;
  }

  &-top div:nth-child(1) {
    width: 100%;
    height: 30%;
    background: #1b2a47;
    box-shadow: 0 0 1px #888;
  }

  &-left div:nth-child(1) {
    width: 30%;
    height: 100%;
    background: #1b2a47;
  }

  &-left div:nth-child(2) {
    position: absolute;
    top: 0;
    right: 0;
    width: 70%;
    height: 30%;
    background: #fff;
    box-shadow: 0 0 1px #888;
  }
}

.theme-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
</style>
