<template>
  <el-dropdown trigger="click" @command="handleLanguageChange">
    <div>
      <svg-icon icon-class="map-location" style="margin-right: 0" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="appStore.language == 'zh-cn'" command="zh-cn"> 简体中文 </el-dropdown-item>
        <el-dropdown-item :disabled="appStore.language == 'en'" command="en"> English </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/modules/app'

const { locale } = useI18n()
const appStore = useAppStore()

function handleLanguageChange(lang) {
  locale.value = lang
  appStore.changeLanguage(lang)
  if (lang == 'en') {
    ElMessage.success('Language Switch Successful!')
  } else {
    ElMessage.success('语言切换成功！')
  }
}
</script>
