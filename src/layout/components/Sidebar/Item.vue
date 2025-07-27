<template>
  <Icon v-if="icon" :icon="icon" />
  <span v-else class="el-icon"></span>
  <span v-if="title">{{ translateRouteTitle(title) }}</span>
</template>

<script setup>
import { translateRouteTitle } from '@/utils/index'

defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})
</script>
