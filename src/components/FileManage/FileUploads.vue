<template>
  <el-row class="w-full">
    <el-col :span="12">
      <el-text size="default" truncated :title="fileTip">{{ fileTip }}</el-text>
    </el-col>
    <el-col :span="12">
      <el-button @click="fileUpload()">{{ uploadBtn }}</el-button>
      <el-button @click="fileDelete(-1)">{{ deleteBtn }}</el-button>
    </el-col>
    <el-col v-for="(item, index) in fileList" :key="index" :span="6">
      <el-row class="file-row">
        <el-col :style="{ height: height + 'px' }">
          <el-image
            v-if="item.file_type === 'image'"
            :src="item.file_url"
            :preview-src-list="[item.file_url]"
            :style="{ height: height + 'px' }"
            :fit="fit"
            :lazy="lazy"
            :title="$t('点击看大图')"
          >
            <template #error>
              <Icon icon="Picture" />
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
            <Icon icon="Document" :size="iconSize" />
          </div>
          <div v-else>
            <Icon icon="Folder" :size="iconSize" />
          </div>
        </el-col>
        <el-col class="max-h-10">
          <el-text size="default" truncated :title="fileName(item)">{{ fileName(item) }}</el-text>
        </el-col>
        <el-col class="max-h-10">
          <el-link
            class="mr-2.5"
            type="primary"
            underline="never"
            :title="$t('向左移动')"
            @click="fileMove(index, 'left')"
          >
            <Icon icon="DArrowLeft" />
          </el-link>
          <el-link
            class="mr-2.5"
            type="primary"
            underline="never"
            :title="$t('向左移动')"
            @click="fileMove(index, 'right')"
          >
            <Icon icon="DArrowRight" />
          </el-link>
          <el-link class="mr-2.5" type="primary" underline="never" :title="$t('下载')" @click="fileDownload(item)">
            <Icon icon="Download" />
          </el-link>
          <el-link class="mr-2.5" type="primary" underline="never" :title="$t('删除')" @click="fileDelete(index)">
            <Icon icon="Delete" />
          </el-link>
        </el-col>
      </el-row>
    </el-col>
    <el-dialog
      v-model="fileDialog"
      :title="fileTitle ? fileTitle : uploadBtn"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="80%"
      draggable
      center
      align-center
    >
      <FileManage :file-type="fileType" @file-cancel="fileCancel" @file-submit="fileSubmit" />
    </el-dialog>
  </el-row>
</template>

<script setup>
import FileManage from '@/components/FileManage/index.vue'
import { clipboard } from '@/utils/index'
import { infoApi } from '@/api/file/file'
import i18n from '@/lang/index'
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
    default: () => {
      return i18n.global.t('上传文件')
    }
  },
  deleteBtn: {
    type: String,
    default: () => {
      return i18n.global.t('全部删除')
    }
  },
  idkey: {
    type: String,
    default: 'file_id'
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
  let index1 = index
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
  if (index === -1) {
    fileList.value = []
  } else {
    fileList.value.splice(index, 1)
  }
}
function fileDownload(file) {
  infoApi({ [props.idkey]: file[props.idkey] })
    .then((res) => {
      const file = res.data
      if (file.add_type === 'upload' && file.storage === 'local') {
        infoApi({ [props.idkey]: file[props.idkey], file_name: file['file_name'] }, true)
      } else {
        clipboard(fileName(file), i18n.global.t('文件名已复制'))
        setTimeout(() => {
          window.open(file.file_url, '_blank')
        }, 500)
      }
    })
    .catch(() => {})
}
</script>

<style lang="scss" scope>
.file-row {
  margin-right: 4px;
  margin-bottom: 4px;
  text-align: center;
  border: 1px solid var(--el-border-color);
}
</style>
