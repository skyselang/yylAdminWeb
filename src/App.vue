<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
const appStore = useAppStore()
const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.changeSetting({ key: 'layout', value: settingsStore.layout })
  settingsStore.changeSetting({ key: 'theme', value: settingsStore.theme })
  settingsStore.changeSetting({ key: 'themeColor', value: settingsStore.themeColor })
  settingsStore.changeSetting({ key: 'faviconUrl', value: settingsStore.faviconUrl })
})
</script>
