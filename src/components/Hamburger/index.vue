<template>
  <div
    class="px-[15px] flex items-center justify-center color-[var(--el-text-color-regular)]"
    @click="toggleClick"
  >
    <svg-icon class="hamburger" :class="{ 'is-active': isActive }" icon-class="fold" />
  </div>
</template>

<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false,
    required: true
  }
})

const emit = defineEmits(['toggleClick'])

function toggleClick() {
  emit('toggleClick')
}
</script>

<style lang="scss" scoped>
.hamburger {
  cursor: pointer;
  vertical-align: middle;
  transform: scaleX(-1);
}

.hamburger.is-active {
  transform: scaleX(1);
}
</style>
