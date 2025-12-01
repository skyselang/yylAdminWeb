<template>
  <Icons v-if="icon" :icon="icon" />
  <span v-else class="el-icon"></span>
  <span v-if="title" :title="title">{{ title }}</span>
</template>

<script setup>
import { translateRouteTitle } from '@/utils/index'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const title = translateRouteTitle(props.title)
</script>
