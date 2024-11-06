<template>
  <div class="w-full logo-wrap h-[50px] bg-gray-800 dark:bg-[var(--el-bg-color-overlay)]">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="h-full w-full flex items-center justify-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="w-5 h-5" />
      </router-link>

      <router-link v-else key="expand" class="h-full w-full flex items-center justify-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="w-5 h-5" />
        <span v-if="settingsStore.sidebarName" class="ml-3 text-white text-sm font-bold">
          {{ settingsStore.systemName }}
        </span>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
import Logo from '@/assets/images/logo.png'
import { useSettingsStore } from '@/store/modules/settings'

const settingsStore = useSettingsStore()

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
})

const logo = computed(() => {
  return settingsStore.logoUrl ? settingsStore.logoUrl : Logo
})
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 2s;
}

.sidebarLogoFade-leave-active,
.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
</style>
