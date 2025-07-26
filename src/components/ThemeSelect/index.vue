<template>
  <el-icon @click="themeChange"><component :is="settingsStore.theme === 'dark' ? Moon : Sunny" /></el-icon>
</template>

<script setup>
import { useSettingsStore } from '@/store/modules/settings'
import { Moon, Sunny } from '@element-plus/icons-vue'

const settingsStore = useSettingsStore()

function themeChange() {
  const themeOld = settingsStore.theme
  const themeNew = themeOld === 'dark' ? 'light' : 'dark'
  settingsStore.changeSetting({ key: 'theme', value: themeNew })
}
</script>
