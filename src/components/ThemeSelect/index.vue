<template>
  <svg-icon
    :icon-class="settingsStore.theme == 'dark' ? 'moon' : 'sunny'"
    @click="handleThemeChange"
  />
</template>

<script setup>
import { useSettingsStore } from '@/store/modules/settings'

const settingsStore = useSettingsStore()

function handleThemeChange() {
  const themeOld = settingsStore.theme
  const themeNew = themeOld == 'dark' ? 'light' : 'dark'
  settingsStore.changeSetting({ key: 'theme', value: themeNew })
}
</script>
