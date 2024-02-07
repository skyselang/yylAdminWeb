<template>
  <el-row style="width: 100%">
    <el-col :span="12" :style="{ height: height + 'px' }">
      <div v-if="file.file_url">
        <div v-if="file.file_type === 'image'">
          <el-image
            :style="{ height: height + 'px' }"
            :src="file.file_url"
            :fit="fit"
            :preview-src-list="[file.file_url]"
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
        <div v-else></div>
      </div>
    </el-col>
    <el-col :span="12">
      <el-row>
        <el-col>
          <el-button @click="fileUpload()">{{ uploadBtn }}</el-button>
          <el-button @click="fileDelete()">{{ deleteBtn }}</el-button>
          <el-button v-if="file.file_url" @click="fileDownload(file)">下载</el-button>
        </el-col>
        <el-col style="max-height: 40px">
          <el-text size="default" truncated :title="fileTip">{{ fileTip }}</el-text>
        </el-col>
        <el-col style="max-height: 40px">
          <el-text size="default" truncated :title="fileName(file)">
            {{ fileName(file) }}
          </el-text>
        </el-col>
      </el-row>
    </el-col>
    <el-dialog
      v-model="fileDialog"
      :title="fileTitle ? fileTitle : uploadBtn"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="1vh"
      width="80%"
      append-to-body
    >
      <FileManage :file-type="fileType" @file-cancel="fileCancel" @file-submit="fileSubmit" />
    </el-dialog>
  </el-row>
</template>

<script setup>
import FileManage from '@/components/FileManage/index.vue'
import clip from '@/utils/clipboard'
import { watch } from 'vue'
// 单文件上传
const model = defineModel({
  type: Number,
  default: 0
})
const props = defineProps({
  preview: {
    type: Object,
    default: () => {}
  },
  fileType: {
    type: String,
    default: 'all'
  },
  fileTitle: {
    type: String,
    default: ''
  },
  fileTip: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 120
  },
  fit: {
    type: String,
    default: ''
  },
  lazy: {
    type: Boolean,
    default: false
  },
  uploadBtn: {
    type: String,
    default: '上传'
  },
  deleteBtn: {
    type: String,
    default: '删除'
  }
})

const file = ref()
const fileDialog = ref(false)
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
  () => props.preview,
  (preview) => {
    file.value = preview
  },
  { immediate: true }
)

function fileName(file) {
  return file.file_name + '.' + file.file_ext
}
function fileUpload() {
  fileDialog.value = true
}
function fileCancel() {
  fileDialog.value = false
}
function fileSubmit(fileList) {
  fileDialog.value = false
  const fileLength = fileList.length
  if (fileLength) {
    const index = fileLength - 1
    model.value = fileList[index]['file_id']
    file.value = fileList[index]
  }
}
function fileDelete() {
  model.value = 0
  file.value.file_url = ''
  file.value.file_type = ''
  file.value.file_name = ''
  file.value.file_ext = ''
}
function fileDownload(file) {
  clip(fileName(file), '文件名复制成功')
  setTimeout(() => {
    window.open(file.file_url, '_blank')
  }, 500)
}
</script>
