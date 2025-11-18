<template>
  <div v-if="device !== 'mobile'" class="setting-container">
    <!-- 用户名称 -->
    <div :title="user.username" class="setting-item">
      <span class="font-size-3.5">{{ user.nickname }}</span>
    </div>
    <!-- 公告 -->
    <div :title="$t('公告')" class="setting-item">
      <Notices />
    </div>
    <!-- 我的消息 -->
    <div v-if="hasPerm(['admin/system.UserCenter/messageList'])" :title="$t('消息')" class="setting-item">
      <Messages />
    </div>
    <!-- 系统设置 -->
    <div v-if="hasPerm(['admin/system.UserCenter/setting'])" :title="$t('设置')" class="setting-item">
      <router-link to="/user-setting">
        <Icons icon="Setting" />
      </router-link>
    </div>
    <!-- 清除缓存 -->
    <div
      v-if="hasPerm(['admin/system.Setting/cacheClear'])"
      :title="$t('清除缓存')"
      class="setting-item"
      @click="clearCache"
    >
      <Icons icon="Delete" />
    </div>
    <!-- 全屏切换 -->
    <div :title="$t('全屏切换')" class="setting-item" @click="toggle">
      <Icons icon="FullScreen" />
    </div>
    <!-- 语言切换 -->
    <div :title="$t('语言切换')" class="setting-item">
      <lang-select />
    </div>
    <!-- 主题切换 -->
    <div :title="$t('主题切换')" class="setting-item">
      <theme-select class="cursor-pointer" />
    </div>
  </div>
  <el-dropdown trigger="click">
    <!-- 用户头像 -->
    <div class="avatar-container">
      <el-avatar v-if="user.avatar_url" :size="40" :src="user.avatar_url" alt="" />
      <el-avatar v-else :size="40" alt="">
        <Icons icon="UserFilled" :size="25" />
      </el-avatar>
      <Icons icon="CaretBottom" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-if="hasPerm(['admin/system.UserCenter/info'])">
          <router-link to="/user-center">
            {{ $t('个人中心') }}
          </router-link>
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          {{ $t('退出系统') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { hasPerm } from '@/utils/index'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { cacheClearApi } from '@/api/system/setting'
import LangSelect from '@/components/LangSelect/index.vue'
import ThemeSelect from '@/components/ThemeSelect/index.vue'
import Notices from '@/components/Notices/index.vue'
import Messages from '@/components/Messages/index.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const tagsViewStore = useTagsViewStore()
const { device } = storeToRefs(appStore)
const { user } = storeToRefs(userStore)
const { t } = useI18n()

// 清除缓存
function clearCache() {
  ElMessage({
    message: t('正在清除缓存'),
    grouping: true,
    type: 'info'
  })
  cacheClearApi()
    .then((res) => {
      ElMessage({
        message: res.msg,
        grouping: true,
        type: 'success'
      })
    })
    .catch(() => {})
}

// 全屏切换
const { toggle } = useFullscreen()

// 退出系统
function logout() {
  ElMessageBox.confirm(t('确定要退出系统吗'), t('提示'), {
    type: 'warning',
    center: true
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
