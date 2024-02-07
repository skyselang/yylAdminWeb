<template>
  <SvgIcon v-if="icon" :icon-class="icon" />
  <span v-if="title">{{ translateRouteTitle(title) }}</span>
</template>

<script setup>
import { translateRouteTitle } from '@/utils/i18n'

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
