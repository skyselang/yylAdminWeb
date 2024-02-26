<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
import { Boot } from '@wangeditor/editor'
import attachmentModule from '@wangeditor/plugin-upload-attachment'

const appStore = useAppStore()
const settingsStore = useSettingsStore()

// wangEditor：注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
Boot.registerModule(attachmentModule)

onMounted(() => {
  settingsStore.changeSetting({ key: 'layout', value: settingsStore.layout })
  settingsStore.changeSetting({ key: 'theme', value: settingsStore.theme })
  settingsStore.changeSetting({ key: 'themeColor', value: settingsStore.themeColor })
  settingsStore.changeSetting({ key: 'faviconUrl', value: settingsStore.faviconUrl })
})
</script>
