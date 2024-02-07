<template>
  <div v-if="device !== 'mobile'" class="setting-container">
    <!-- 用户名称 -->
    <div class="setting-item">
      <el-tooltip effect="dark" :content="user.username">
        <span>{{ user.nickname }}</span>
      </el-tooltip>
    </div>
    <!-- 系统设置 -->
    <div class="setting-item" v-if="checkPermission(['admin/system.UserCenter/setting'])">
      <el-tooltip effect="dark" :content="$t('route.System setting')">
        <router-link to="/setting">
          <svg-icon icon-class="setting" />
        </router-link>
      </el-tooltip>
    </div>
    <!-- 清除缓存 -->
    <div
      class="setting-item"
      v-if="checkPermission(['admin/system.Setting/cacheClear'])"
      @click="clearCache"
    >
      <el-tooltip effect="dark" :content="$t('navbar.Clear Cache')">
        <svg-icon icon-class="delete" />
      </el-tooltip>
    </div>
    <!-- 全屏切换 -->
    <div class="setting-item" @click="toggle">
      <el-tooltip effect="dark" :content="$t('navbar.full screen')">
        <svg-icon icon-class="full-screen" />
      </el-tooltip>
    </div>
    <!-- 语言切换 -->
    <div class="setting-lang">
      <el-tooltip effect="dark" :content="$t('navbar.Language switching')">
        <lang-select />
      </el-tooltip>
    </div>
    <!-- 主题切换 -->
    <div class="setting-item">
      <el-tooltip effect="dark" :content="$t('navbar.Theme switching')">
        <theme-select class="cursor-pointer" />
      </el-tooltip>
    </div>
  </div>
  <el-dropdown trigger="click">
    <!-- 用户头像 -->
    <div class="avatar-container">
      <el-avatar v-if="user.avatar_url" :size="40" :src="user.avatar_url" />
      <el-avatar v-else :size="40">
        <svg-icon icon-class="user-filled" size="25px" />
      </el-avatar>
      <svg-icon icon-class="caret-bottom" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <router-link to="/">{{ $t('navbar.dashboard') }}</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link
            v-if="checkPermission(['admin/system.UserCenter/info'])"
            to="/system/user-center"
          >
            {{ $t('navbar.userCenter') }}
          </router-link>
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          {{ $t('navbar.logout') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import checkPermission from '@/utils/permission'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { cacheClear } from '@/api/system/setting'
import LangSelect from '@/components/LangSelect/index.vue'
import ThemeSelect from '@/components/ThemeSelect/index.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const tagsViewStore = useTagsViewStore()
const { device } = storeToRefs(appStore)
const { user } = storeToRefs(userStore)

// 清除缓存
function clearCache() {
  ElMessage('正在清除缓存')
  cacheClear()
    .then((res) => {
      ElMessage.success(res.msg)
    })
    .catch(() => {})
}

// 全屏切换
const { toggle } = useFullscreen()

// 退出系统
function logout() {
  ElMessageBox.confirm('确定要退出系统吗？', '提示', {
    type: 'warning'
  })
    .then(() => {
      userStore
        .logout()
        .then(() => {
          tagsViewStore.delAllViews()
        })
        .then(() => {
          router.push(`/login?redirect=${route.fullPath}`)
        })
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
.setting-container {
  display: flex;
  align-items: center;
  .setting-item {
    cursor: pointer;
    margin-top: 4px;
    margin-right: 14px;
  }
}
.setting-lang {
  cursor: pointer;
  margin-top: 12px;
  margin-right: 14px;
}
.avatar-container {
  display: flex;
  place-items: center center;
  margin: 0 6px 0 0;
  cursor: pointer;
  img {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }
}
</style>
