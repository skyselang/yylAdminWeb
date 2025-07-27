<template>
  <div class="w-full logo-wrap h-[50px] pl-5 pr-5">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="h-full w-full flex items-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="w-5 h-5" alt="" />
      </router-link>

      <router-link v-else key="expand" class="h-full w-full flex items-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="w-5 h-5" alt="" />
        <el-text v-if="settingsStore.sidebarName">
          <span class="ml-3 text-sm font-bold color-[var(--sidebarLogoNameColor)]">{{ settingsStore.systemName }}</span>
        </el-text>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
import Logo from '@/assets/images/logo.png'
import { useSettingsStore } from '@/store/modules/settings'

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
})

const settingsStore = useSettingsStore()
const logo = computed(() => (settingsStore.logoUrl ? settingsStore.logoUrl : Logo))
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
