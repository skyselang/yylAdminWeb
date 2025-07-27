<template>
  <div :class="{ hasTagsView: showTagsView }" class="main-container">
    <div
      :class="{
        'fixed-header': fixedHeader,
        'fixed-header-top': fixedHeaderTop,
        'fixed-header-mix': fixedHeaderMix,
        device: device
      }"
    >
      <navbar v-if="layout === 'left'" />
      <tags-view v-if="showTagsView" />
    </div>
    <app-main />
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
import { AppMain, Navbar, TagsView } from './components/index'

const { width } = useWindowSize()

/**
 * 响应式布局宽度
 *
 * 大屏（>=1200px）
 * 中屏（>=992px）
 * 小屏（>=768px）
 */
const WIDTH = 992

const appStore = useAppStore()
const settingsStore = useSettingsStore()

const fixedHeader = computed(() => settingsStore.fixedHeader)
const showTagsView = computed(() => settingsStore.tagsView)
const layout = computed(() => settingsStore.layout)
const fixedHeaderTop = computed(() => settingsStore.layout === 'top')
const fixedHeaderMix = computed(() => settingsStore.layout === 'mix')
const device = computed(() => appStore.device)

watchEffect(() => {
  if (width.value < WIDTH) {
    appStore.toggleDevice('mobile')
    appStore.closeSideBar(true)
  } else {
    appStore.toggleDevice('desktop')

    if (width.value >= 1200) {
      appStore.openSideBar(true)
    } else {
      appStore.closeSideBar(true)
    }
  }
})
</script>

<style lang="scss" scoped>
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 63px);
}

.hideSidebar.mobile .fixed-header {
  width: 100%;
}

.fixed-header-top {
  top: 50px;
  width: 100% !important;
}

.fixed-header-mix {
  top: 50px;
}
</style>
