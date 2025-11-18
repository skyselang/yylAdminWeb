<template>
  <div ref="divRef" :style="{ height: height + 'px' }"></div>
  <!-- 文件管理 -->
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
</template>

<script setup>
import { useSettingsStore } from '@/store/modules/settings'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from 'vue-i18n'
import { AiEditor } from 'aieditor'
import 'aieditor/dist/style.css'
import FileManage from '@/components/FileManage/index.vue'

const props = defineProps({
  modelValue: {
    type: [String],
    default: ''
  },
  height: {
    type: [Number],
    default: 500
  }
})

const { t } = useI18n()
const emit = defineEmits(['update:modelValue'])
const modelValue = useVModel(props, 'modelValue', emit)

const settingsStore = useSettingsStore()
const appStore = useAppStore()
const placeholder = t('请输入内容')
const theme = settingsStore.theme == 'dark' ? 'dark' : 'light'
const lang = appStore.language == 'zh-cn' ? 'zh' : 'en'

const divRef = ref()
let aiEditor = null

onMounted(() => {
  aiEditor = new AiEditor({
    element: divRef.value,
    placeholder: placeholder,
    lang: lang,
    theme: theme,
    content: modelValue.value,
    toolbarExcludeKeys: ['ai'],
    image: {
      customMenuInvoke: (editor) => {
        fileDialog.value = true
        fileType.value = 'image'
      }
    },
    video: {
      customMenuInvoke: (editor) => {
        fileDialog.value = true
        fileType.value = 'video'
      }
    },
    attachment: {
      customMenuInvoke: (editor) => {
        fileDialog.value = true
        fileType.value = 'word'
      }
    },
    onChange: (aiEditor) => {
      modelValue.value = aiEditor.getHtml()
    }
  })
})

// 文件管理
const fileDialog = ref(false)
const fileTitle = ref('文件管理')
const fileType = ref('image')
function fileCancel() {
  fileDialog.value = false
}
function fileSubmit(files) {
  fileDialog.value = false
  let htmls = ''
  const length = files.length
  for (let i = 0; i < length; i++) {
    if (files[i]['file_type'] === 'image') {
      htmls += `<img file-id="${files[i]['file_id']}" src="${files[i]['file_url']}" style="width:640px;" alt="" />`
    } else if (files[i]['file_type'] === 'video') {
      htmls += `<div data-w-e-type="video" data-w-e-is-void><video width="640" height="480" controls>
                <source file-id="${files[i]['file_id']}" src="${files[i]['file_url']}" type="video/mp4">
                <object file-id="${files[i]['file_id']}" data="${files[i]['file_url']}">
                  <embed file-id="${files[i]['file_id']}" src="${files[i]['file_url']}" width="640" height="480">
                </object>
              </video></div>`
    } else if (files[i]['file_type'] === 'audio') {
      htmls += `<div data-w-e-type="audio" data-w-e-is-void data-w-e-is-inline><audio controls>
                <source file-id="${files[i]['file_id']}" src="${files[i]['file_url']}" type="audio/mp3">
                <embed file-id="${files[i]['file_id']}" src="${files[i]['file_url']}">
              </audio></div>`
    } else {
      htmls += `<div data-w-e-type="attachment" data-w-e-is-void data-w-e-is-inline><a file-id="${files[i]['file_id']}" href="${files[i]['file_url']}" download="${files[i]['file_url']}" target="_blank">${files[i]['file_name']}.${files[i]['file_ext']}</a></div>`
    }
  }
  aiEditor.insert(htmls)
}

onUnmounted(() => {
  aiEditor && aiEditor.destroy()
})
</script>
