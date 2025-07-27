<template>
  <div class="app-container">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form label-width="120px">
            <el-form-item label="logo">
              <el-switch v-model="settingsStore.sidebarLogo" />
            </el-form-item>
            <el-form-item :label="$t('名称')">
              <el-switch v-model="settingsStore.sidebarName" />
            </el-form-item>
            <el-form-item :label="$t('标签栏')">
              <el-switch v-model="settingsStore.tagsView" />
            </el-form-item>
            <el-form-item :label="$t('固定头部')">
              <el-switch v-model="settingsStore.fixedHeader" />
            </el-form-item>
            <el-form-item :label="$t('组件大小')">
              <el-radio-group v-model="appStore.size" @change="sizeChange">
                <el-radio v-for="v in sizes" :key="v.value" :label="v.label" :value="v.value" />
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('添加修改弹窗')">
              <el-switch v-model="settingsStore.addEditDialog" />
              <el-text v-if="settingsStore.addEditDialog" size="default">{{ $t('对话框弹窗') }}</el-text>
              <el-text v-else size="default">{{ $t('新标签页面') }}</el-text>
            </el-form-item>
            <el-form-item :label="$t('分页每页数量')" prop="page_limit">
              <el-col :span="3">
                <el-select v-model="settingsStore.pageLimit">
                  <el-option v-for="v in pageLimits" :key="v" :value="v" :label="v" />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('主题颜色')">
              <el-color-picker
                v-model="settingsStore.themeColor"
                :predefine="themeColorPresets"
                @change="changeThemeColor"
              />
            </el-form-item>
            <el-form-item :label="$t('侧边栏颜色')">
              <el-radio-group v-model="settingsStore.sidebarColor" @change="changeSidebarColor">
                <el-radio value="white">{{ $t('极简白') }}</el-radio>
                <el-radio value="bule">{{ $t('经典蓝') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('导航模式')">
              <el-radio-group v-model="settingsStore.layout" @change="changeLayout">
                <el-radio value="left">{{ $t('左侧模式') }}</el-radio>
                <el-radio value="top">{{ $t('顶部模式') }}</el-radio>
                <el-radio value="mix">{{ $t('混合模式') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="clearCache">{{ $t('恢复默认') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { screenHeight, localStorageClear } from '@/utils/index'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
import { usePermissionStore } from '@/store/modules/permission'
import i18n from '@/lang/index'

const height = screenHeight()
const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const sizes = [
  { label: i18n.global.t('大'), value: 'large' },
  { label: i18n.global.t('默认'), value: 'default' },
  { label: i18n.global.t('小'), value: 'small' }
]
const pageLimits = settingsStore.pageLimits
const themeColorPresets = [
  '#409EFF', // Element Plus 蓝 - 明亮、友好
  '#1890FF', // Ant Design 拂晓蓝 - 包容、科技、普惠
  '#165dff', // Arco Design 极致蓝
  '#0052d9', // TDesign 腾讯蓝 - 科技创新
  '#0064fa', // Semi Design 蓝
  '#16baaa', // Layui 蓝绿色
  '#2d8cf0', // View Design 蓝
  '#007aff', // uni-app 蓝
  '#f5222d', // 薄暮 - 斗志、奔放
  '#fa541c', // 火山 - 醒目、澎湃
  '#fa8c16', // 日暮 - 温暖、欢快
  '#faad14', // 金盏花 - 活力、积极
  '#fadb14', // 日出 - 出生、阳光
  '#a0d911', // 青柠 - 自然、生机
  '#52c41a', // 极光绿 - 健康、创新
  '#13c2c2', // 明青 - 希望、坚强
  '#2f54eb', // 极客蓝 - 探索、钻研
  '#722ed1', // 酱紫 - 优雅、浪漫
  '#eb2f96', // 法式洋红 - 明快、感性
  '#F53F3F', // 浪漫红
  '#F77234', // 晚秋红
  '#FF7D00', // 活力橙
  '#F7BA1E', // 黄昏
  '#FADC19', // 柠檬黄
  '#9FDB1D', // 新生绿
  '#00B42A', // 仙野绿
  '#14C9C9', // 碧涛青
  '#3491FA', // 海蔚蓝
  '#722ED1', // 暗夜紫
  '#D91AD9', // 青春紫
  '#F5319D', // 品红
  '#86909C', // 中性灰
  '#16b777',
  '#31BDEC',
  '#0080b0',
  '#8e56dd',
  '#b38500',
  '#c43695',
  '#2979ff',
  '#19be6b'
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
function changeThemeColor(color) {
  settingsStore.changeSetting({ key: 'themeColor', value: color })
}

// 侧边栏颜色
function changeSidebarColor(color) {
  settingsStore.changeSetting({ key: 'sidebarColor', value: color })
}

// 导航模式
function changeLayout(layout) {
  settingsStore.changeSetting({ key: 'layout', value: layout })
  if (layout === 'mix') {
    route.name && againActiveTop(route.name)
  }
}

// 本地缓存
function clearCache() {
  ElMessageBox.confirm(i18n.global.t('确定要恢复默认设置吗？'), i18n.global.t('提示'), {
    type: 'warning',
    center: true
  })
    .then(() => {
      localStorageClear()
      location.reload()
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped></style>
