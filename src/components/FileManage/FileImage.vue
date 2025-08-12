<template>
  <el-row class="w-full">
    <el-col :span="fileSpan" :style="fileStyle">
      <div v-if="fileUrl">
        <el-image
          v-if="fileType === 'image'"
          :src="fileUrl"
          :preview-src-list="[fileUrl]"
          :preview-teleported="teleported"
          :style="imageStyle"
          :lazy="lazy"
          :fit="fit"
          :title="$t('点击看大图')"
        >
          <template #error>
            <Icons icon="Picture" :size="iconSize" />
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
          <Icons icon="Document" :size="iconSize" />
        </div>
        <div v-else-if="fileType === 'other'">
          <Icons icon="Folder" :size="iconSize" />
        </div>
      </div>
      <div v-else>
        <el-avatar v-if="avatar" :size="height" alt="">
          <Icons icon="UserFilled" :size="iconSize" />
        </el-avatar>
      </div>
    </el-col>
    <el-col :span="operSpan">
      <el-row>
        <el-col>
          <el-button @click="fileUpload()">{{ uploadBtn }}</el-button>
          <el-button @click="fileDelete()">{{ deleteBtn }}</el-button>
          <el-button v-if="fileUrl" @click="fileDownload()">{{ $t('下载') }}</el-button>
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
import { infoApi } from '@/api/file/file'
import i18n from '@/lang/index'
// 图片上传
const model = defineModel({
  type: Number
})
const fileUrl = defineModel('fileUrl', {
  type: String
})
const props = defineProps({
  fileType: {
    type: String,
    default: 'image'
  },
  fileTitle: {
    type: String,
    default: () => {
      return i18n.global.t('上传图片')
    }
  },
  fileTip: {
    type: String,
    default: () => {
      return i18n.global.t('图片小于200KB，jpg、png格式')
    }
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
  teleported: {
    type: Boolean,
    default: true
  },
  uploadBtn: {
    type: String,
    default: ''
  },
  deleteBtn: {
    type: String,
    default: () => {
      return i18n.global.t('删除')
    }
  },
  avatar: {
    type: Boolean,
    default: false
  },
  upload: {
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
const uploadBtn = computed(() => {
  if (props.uploadBtn) {
    return props.uploadBtn
  } else if (props.fileTitle) {
    return props.fileTitle
  }
  return i18n.global.t('上传')
})

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
  infoApi({ [props.idkey]: model.value })
    .then((res) => {
      const file = res.data
      if (file.add_type === 'upload' && file.storage === 'local') {
        infoApi({ [props.idkey]: file[props.idkey], file_name: file['file_name'], is_down: true })
      } else {
        window.open(fileUrl.value, '_blank')
      }
    })
    .catch(() => {})
}

watch(
  [() => props.avatar, () => props.upload],
  ([avatar, upload]) => {
    if (avatar) {
      imageStyle.value.width = props.height + 'px'
      imageStyle.value.borderRadius = '50%'
    }
    if (upload) {
      fileSpan.value = 10
      operSpan.value = 14
    }
  },
  { immediate: true }
)
</script>
