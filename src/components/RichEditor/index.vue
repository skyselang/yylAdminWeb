<template>
  <div class="editor-wrapper">
    <!-- 工具栏 -->
    <el-affix target=".editor-wrapper" :offset="150">
      <Toolbar
        id="toolbar-container"
        :editor="editorRef"
        :default-config="toolbarConfig"
        :mode="mode"
      />
    </el-affix>
    <!-- 编辑器 -->
    <Editor
      id="editor-container"
      v-model="modelValue"
      :default-config="editorConfig"
      :mode="mode"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
    <!-- 文件管理 -->
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
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/modules/app'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import FileManage from '@/components/FileManage/index.vue'

const props = defineProps({
  modelValue: {
    type: [String],
    default: ''
  }
})
const appStore = useAppStore()
const emit = defineEmits(['update:modelValue'])
// 切换语言 - 'en' 或者 'zh-CN'
i18nChangeLanguage(appStore.language == 'zh-cn' ? 'zh-CN' : 'en')
const modelValue = useVModel(props, 'modelValue', emit)
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// 编辑器模式
const mode = ref('default')
// 工具条配置
const toolbarConfig = ref({
  insertKeys: {
    index: 24, // 自定义插入的位置
    keys: ['uploadAttachment'] // “上传附件”菜单
  }
})
// 编辑器配置
const editorConfig = ref({
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 自定义选择图片
      customBrowseAndUpload() {
        fileDialog.value = true
        fileType.value = 'image'
      }
    },
    uploadVideo: {
      // 自定义选择视频
      customBrowseAndUpload() {
        fileDialog.value = true
        fileType.value = 'video'
      }
    },
    uploadAttachment: {
      // 自定义选择附件
      customBrowseAndUpload() {
        fileDialog.value = true
        fileType.value = 'word'
      }
    }
  }
})

const handleCreated = (editor) => {
  // 记录 editor 实例，重要！
  editorRef.value = editor
}

function handleChange(editor) {
  modelValue.value = editor.getHtml()
}

// 文件管理
const fileDialog = ref(false)
const fileTitle = ref('文件管理')
const fileType = ref('image')
function fileCancel() {
  fileDialog.value = false
}
function fileSubmit(files) {
  fileDialog.value = false
  var htmls = ''
  const length = files.length
  for (let i = 0; i < length; i++) {
    if (files[i]['file_type'] === 'image') {
      htmls += `<img file-id="${files[i]['file_id']}" src="${files[i]['file_url']}" style="width:640px;"/>`
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
  const editor = editorRef.value
  editor.dangerouslyInsertHtml(htmls)
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
.editor-wrapper {
  border: 1px solid #cfd3dc;
}
</style>
