<template>
  <el-link type="primary" underline="never" class="mr-2">{{ text }}</el-link>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
