<template>
  <el-scrollbar
    ref="scrollContainer"
    class="scroll-container"
    :vertical="false"
    @wheel.prevent="handleScroll"
  >
    <slot></slot>
  </el-scrollbar>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

const tagAndTagSpacing = ref(4)
const { proxy } = getCurrentInstance()

const emits = defineEmits(['scroll'])
const emitScroll = () => {
  emits('scroll')
}

const tagsViewStore = useTagsViewStore()

const scrollWrapper = computed(() => proxy?.$refs.scrollContainer.$refs.wrapRef)

onMounted(() => {
  scrollWrapper.value.addEventListener('scroll', emitScroll, true)
})
onBeforeUnmount(() => {
  scrollWrapper.value.removeEventListener('scroll', emitScroll)
})

function handleScroll(e) {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  scrollWrapper.value.scrollLeft = scrollWrapper.value.scrollLeft + eventDelta / 4
}

function moveToTarget(currentTag) {
  const $container = proxy.$refs.scrollContainer.$el
  const $containerWidth = $container.offsetWidth
  const $scrollWrapper = scrollWrapper.value

  let firstTag = null
  let lastTag = null

  // 查找第一个标签和最后一个标签
  if (tagsViewStore.visitedViews.length > 0) {
    firstTag = tagsViewStore.visitedViews[0]
    lastTag = tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1]
  }

  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
  } else {
    const tagListDom = document.getElementsByClassName('tags-item')
    const currentIndex = tagsViewStore.visitedViews.findIndex((item) => item === currentTag)
    let prevTag = null
    let nextTag = null
    for (const k in tagListDom) {
      if (k !== 'length' && Object.hasOwnProperty.call(tagListDom, k)) {
        if (tagListDom[k].dataset.path === tagsViewStore.visitedViews[currentIndex - 1].path) {
          prevTag = tagListDom[k]
        }
        if (tagListDom[k].dataset.path === tagsViewStore.visitedViews[currentIndex + 1].path) {
          nextTag = tagListDom[k]
        }
      }
    }

    try {
      // 标签的偏移下一个标签的左后
      const afterNextTagOffsetLeft =
        nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing.value

      // 标签的偏移前一个标签的左前
      const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagAndTagSpacing.value
      if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
        $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
      } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
        $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
      }
    } catch (error) {}
  }
}

defineExpose({
  moveToTarget
})
</script>

<style lang="scss" scoped>
.scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  .el-scrollbar__bar {
    bottom: 0;
  }

  .el-scrollbar__wrap {
    height: 49px;
  }
}
</style>
