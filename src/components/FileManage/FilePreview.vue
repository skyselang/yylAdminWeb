<template>
  <el-row style="width: 100%">
    <el-col :span="fileSpan" :style="fileStyle">
      <div v-if="file.file_url">
        <div v-if="file.file_type === 'image'">
          <el-image
            :style="imageStyle"
            :src="file.file_url"
            :fit="fit"
            :preview-src-list="[file.file_url]"
            :preview-teleported="previewTeleported"
            :lazy="lazy"
            title="点击看大图"
          >
            <template #error>
              <svg-icon icon-class="picture" />
            </template>
          </el-image>
        </div>
        <video v-else-if="file.file_type === 'video'" :style="videoStyle" controls>
          <source :src="file.file_url" type="video/mp4" />
          <object :data="file.file_url" :style="videoStyle">
            <embed :src="file.file_url" :style="videoStyle" />
          </object>
        </video>
        <audio v-else-if="file.file_type === 'audio'" :style="audioStyle" controls>
          <source :src="file.file_url" type="audio/mp3" />
          <embed :src="file.file_url" :style="audioStyle" />
        </audio>
        <div v-else-if="file.file_type === 'word'">
          <svg-icon icon-class="document" :size="iconSize" />
        </div>
        <div v-else-if="file.file_type === 'other'">
          <svg-icon icon-class="folder" :size="iconSize" />
        </div>
      </div>
    </el-col>
    <el-col :span="operSpan">
      <el-button @click="fileDownload(file)">下载</el-button>
    </el-col>
  </el-row>
</template>

<script setup>
import clip from '@/utils/clipboard'
// 文件预览
const props = defineProps({
  file: {
    type: Object,
    default: () => {}
  },
  height: {
    type: Number,
    default: 30
  },
  fit: {
    type: String,
    default: ''
  },
  lazy: {
    type: Boolean,
    default: false
  },
  previewTeleported: {
    type: Boolean,
    default: true
  },
  download: {
    type: Boolean,
    default: false
  }
})

const fileSpan = ref(24)
const operSpan = ref(0)
const fileStyle = computed(() => {
  return { height: props.height + 'px' }
})
const imageStyle = computed(() => {
  return { height: props.height + 'px' }
})
const videoStyle = computed(() => {
  return { height: props.height + 'px' }
})
const audioStyle = computed(() => {
  return { width: '90%' }
})
const iconSize = computed(() => {
  return props.height * 0.7 + 'px'
})

watch(
  () => props.download,
  (download) => {
    if (download) {
      fileSpan.value = 12
      operSpan.value = 12
    }
  },
  { immediate: true, deep: true }
)

function fileName(file) {
  return file.file_name + '.' + file.file_ext
}
function fileDownload(file) {
  clip(fileName(file), '文件名复制成功')
  setTimeout(() => {
    window.open(file.file_url, '_blank')
  }, 500)
}
</script>
