<template>
  <el-scrollbar :height="height" always>
    <slot></slot>
  </el-scrollbar>
</template>

<script setup>
import { useAppStoreHook } from '@/store/modules/app'
const appStore = useAppStoreHook()
const height = appStore.getSizeHeight()
</script>
