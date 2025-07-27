<template>
  <el-dropdown trigger="click" @command="languageChange">
    <el-icon><MapLocation /></el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="appStore.language === 'zh-cn'" command="zh-cn">简体中文</el-dropdown-item>
        <el-dropdown-item :disabled="appStore.language === 'en'" command="en">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/modules/app'
import { MapLocation } from '@element-plus/icons-vue'

const { locale } = useI18n()
const appStore = useAppStore()

function languageChange(lang) {
  locale.value = lang
  appStore.changeLanguage(lang)
  if (lang == 'en') {
    ElMessage.success('Language Switch Successful!')
  } else {
    ElMessage.success('语言切换成功！')
  }
  location.reload()
}
</script>

<style scoped>
.el-dropdown {
  color: var(--color);
}
</style>
