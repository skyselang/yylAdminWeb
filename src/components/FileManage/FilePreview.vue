<template>
  <el-row class="w-full">
    <el-col :span="fileSpan" :style="fileStyle">
      <div v-if="file.file_url">
        <div v-if="file.file_type === 'image'">
          <el-image
            :src="file.file_url"
            :preview-src-list="previewSrcList"
            :preview-teleported="previewTeleported"
            :style="imageStyle"
            :lazy="lazy"
            :fit="fit"
            :title="$t('点击看大图')"
          >
            <template #error>
              <Icons icon="Picture" />
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
          <Icons icon="Document" :size="iconSize" />
        </div>
        <div v-else-if="file.file_type === 'other'">
          <Icons icon="Folder" :size="iconSize" />
        </div>
      </div>
    </el-col>
    <el-col :span="operSpan">
      <el-button @click="fileDown(file)">下载</el-button>
    </el-col>
  </el-row>
</template>

<script setup>
import { clipboard } from '@/utils/index'
import { infoApi } from '@/api/file/file'
import i18n from '@/lang/index'
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
    default: 'contain'
  },
  lazy: {
    type: Boolean,
    default: false
  },
  previewSrcList: {
    type: Array,
    default: () => []
  },
  previewTeleported: {
    type: Boolean,
    default: true
  },
  download: {
    type: Boolean,
    default: false
  },
  idkey: {
    type: String,
    default: 'file_id'
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
const previewSrcList = computed(() => {
  return props.previewSrcList ? props.previewSrcList : [props.file.file_url]
})

watch(
  () => props.download,
  (download) => {
    if (download) {
      fileSpan.value = 14
      operSpan.value = 10
    }
  },
  { immediate: true, deep: true }
)

function fileName(file) {
  return file.file_name + '.' + file.file_ext
}
function fileDown(file) {
  if (file.add_type === 'upload' && file.storage === 'local') {
    infoApi({ [props.idkey]: file[props.idkey], file_name: file['file_name'], is_down: true })
  } else {
    clipboard(fileName(file), i18n.global.t('文件名已复制'))
    setTimeout(() => {
      window.open(file.file_url, '_blank')
    }, 500)
  }
}
</script>
