<template>
  <el-row style="width: 100%">
    <el-col :span="fileSpan" :style="fileStyle">
      <div v-if="fileUrl">
        <el-image
          v-if="fileType === 'image'"
          :style="imageStyle"
          :src="fileUrl"
          :fit="fit"
          :preview-src-list="[fileUrl]"
          :preview-teleported="previewTeleported"
          :lazy="lazy"
          title="点击看大图"
        >
          <template #error>
            <svg-icon icon-class="picture" />
          </template>
        </el-image>
        <video v-else-if="fileType === 'video'" :style="videoStyle" controls>
          <source :src="fileUrl" type="video/mp4" />
          <object :data="fileUrl" :style="videoStyle">
            <embed :src="fileUrl" :style="videoStyle" />
          </object>
        </video>
        <audio v-else-if="fileType === 'audio'" :style="audioStyle" controls>
          <source :src="fileUrl" type="audio/mp3" />
          <embed :src="fileUrl" :style="audioStyle" />
        </audio>
        <div v-else-if="fileType === 'word'">
          <svg-icon icon-class="document" :size="iconSize" />
        </div>
        <div v-else-if="fileType === 'other'">
          <svg-icon icon-class="folder" :size="iconSize" />
        </div>
      </div>
      <div v-else>
        <el-avatar v-if="avatar" :size="height">
          <svg-icon icon-class="user-filled" :size="iconSize" />
        </el-avatar>
      </div>
    </el-col>
    <el-col :span="operSpan">
      <el-row>
        <el-col>
          <el-button @click="fileUpload()">{{ uploadBtn }}</el-button>
          <el-button @click="fileDelete()">{{ deleteBtn }}</el-button>
          <el-button v-if="fileUrl" @click="fileDownload()">下载</el-button>
        </el-col>
        <el-col>
          <el-text size="default" truncated :title="fileTip">{{ fileTip }}</el-text>
        </el-col>
      </el-row>
    </el-col>
    <el-dialog
      v-model="fileDialog"
      :title="fileTitle"
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
// 图片上传
const model = defineModel({
  type: Number,
  default: 0
})
const fileUrl = defineModel('fileUrl', {
  type: String,
  default: ''
})
const props = defineProps({
  fileType: {
    type: String,
    default: 'image'
  },
  fileTitle: {
    type: String,
    default: '上传图片'
  },
  fileTip: {
    type: String,
    default: '图片小于200KB，jpg、png格式。'
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
  uploadBtn: {
    type: String,
    default: '上传'
  },
  deleteBtn: {
    type: String,
    default: '删除'
  },
  avatar: {
    type: Boolean,
    default: false
  },
  upload: {
    type: Boolean,
    default: false
  }
})

const fileSpan = ref(24)
const operSpan = ref(0)
const fileDialog = ref(false)
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
  [() => props.avatar, () => props.upload],
  ([avatar, upload]) => {
    if (avatar) {
      imageStyle.value.width = props.height + 'px'
      imageStyle.value.borderRadius = '50%'
    }
    if (upload) {
      fileSpan.value = 12
      operSpan.value = 12
    }
  },
  { immediate: true }
)

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
    fileUrl.value = fileList[index]['file_url']
  }
}
function fileDelete() {
  model.value = 0
  fileUrl.value = ''
}
function fileDownload() {
  window.open(fileUrl.value, '_blank')
}
</script>
