<template>
  <el-row style="width: 100%">
    <el-col :span="12">
      <el-text size="default" truncated :title="fileTip">{{ fileTip }}</el-text>
    </el-col>
    <el-col :span="12">
      <el-button @click="fileUpload()">{{ uploadBtn }}</el-button>
      <el-button @click="fileDelete('all')">{{ deleteBtn }}</el-button>
    </el-col>
    <el-col v-for="(item, index) in fileList" :key="index" :span="6">
      <el-row class="file-row">
        <el-col :style="{ height: height + 'px' }">
          <el-image
            v-if="item.file_type === 'image'"
            :style="{ height: height + 'px' }"
            :src="item.file_url"
            :fit="fit"
            :preview-src-list="[item.file_url]"
            :lazy="lazy"
            title="点击看大图"
          >
            <template #error>
              <svg-icon icon-class="picture" />
            </template>
          </el-image>
          <video v-else-if="item.file_type === 'video'" :style="videoStyle" controls>
            <source :src="item.file_url" type="video/mp4" />
            <object :data="item.file_url" :style="videoStyle">
              <embed :src="item.file_url" :style="videoStyle" />
            </object>
          </video>
          <audio v-else-if="item.file_type === 'audio'" :style="audioStyle" controls>
            <source :src="item.file_url" type="audio/mp3" />
            <embed :src="item.file_url" :style="audioStyle" />
          </audio>
          <div v-else-if="item.file_type === 'word'">
            <svg-icon icon-class="document" :size="iconSize" />
          </div>
          <div v-else>
            <svg-icon icon-class="folder" :size="iconSize" />
          </div>
        </el-col>
        <el-col style="max-height: 40px">
          <el-text size="default" truncated :title="fileName(item)">
            {{ fileName(item) }}
          </el-text>
        </el-col>
        <el-col style="max-height: 40px">
          <el-link
            class="file-link"
            type="primary"
            :underline="false"
            title="向左移动"
            @click="fileMove(index, 'left')"
          >
            <svg-icon icon-class="d-arrow-left" />
          </el-link>
          <el-link
            class="file-link"
            type="primary"
            :underline="false"
            title="向左移动"
            @click="fileMove(index, 'right')"
          >
            <svg-icon icon-class="d-arrow-right" />
          </el-link>
          <el-link
            class="file-link"
            type="primary"
            :underline="false"
            title="下载"
            @click="fileDownload(item)"
          >
            <svg-icon icon-class="download" />
          </el-link>
          <el-link
            class="file-link"
            type="primary"
            :underline="false"
            title="删除"
            @click="fileDelete(index)"
          >
            <svg-icon icon-class="delete" />
          </el-link>
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
// 多文件上传
const props = defineProps({
  modelValue: {
    type: [Array, Object],
    default: () => []
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
    default: 100
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
    default: '上传文件'
  },
  deleteBtn: {
    type: String,
    default: '全部删除'
  }
})

const fileList = ref([])
const fileDialog = ref(false)
const emit = defineEmits(['update:modelValue'])
watch(
  () => props.modelValue,
  (modelValue) => {
    fileList.value = modelValue
  },
  { immediate: true }
)
const videoStyle = computed(() => {
  return { height: props.height + 'px' }
})
const audioStyle = computed(() => {
  return { width: '90%' }
})
const iconSize = computed(() => {
  return props.height * 0.7 + 'px'
})

function fileName(file) {
  return file.file_name + '.' + file.file_ext
}
function fileUpload() {
  fileDialog.value = true
}
function fileCancel() {
  fileDialog.value = false
}
function fileSubmit(fileLists) {
  fileDialog.value = false
  const fileLength = fileLists.length
  if (fileLength) {
    for (let i = 0; i < fileLength; i++) {
      fileList.value.push(fileLists[i])
    }
    emit('update:modelValue', fileList)
  }
}
function fileMove(index, direction = 'right') {
  const length = fileList.value.length
  var index1 = index
  if (direction === 'left') {
    if (index <= 0) {
      return false
    }
    --index1
  } else {
    if (index >= length - 1) {
      return false
    }
    ++index1
  }
  const value = fileList.value[index]
  const value1 = fileList.value[index1]
  fileList.value[index] = value1
  fileList.value[index1] = value
}
function fileDelete(index) {
  if (index === 'all') {
    fileList.value = []
  } else {
    fileList.value.splice(index, 1)
  }
}
function fileDownload(file) {
  clip(fileName(file), '文件名复制成功')
  setTimeout(() => {
    window.open(file.file_url, '_blank')
  }, 500)
}
</script>

<style lang="scss" scope>
.file-row {
  margin-right: 4px;
  margin-bottom: 4px;
  text-align: center;
  border: 1px solid var(--el-border-color);
}
.file-link {
  margin-right: 10px;
}
</style>
