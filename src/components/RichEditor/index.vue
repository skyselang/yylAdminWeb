<template>
  <div>
    <!-- 编辑器 -->
    <div :id="editorId"></div>
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

<script>
import E from 'wangeditor'
import { randomString } from '@/utils'
import FileManage from '@/components/FileManage/index.vue'

export default {
  name: 'RichEditor',
  components: { FileManage },
  model: {
    prop: 'content',
    event: 'change'
  },
  props: {
    id: { type: String, default: 'wangeditor' + randomString() },
    content: { type: String, default: '' },
    excludeMenus: {
      type: Array,
      default() {
        return ['image', 'video']
      }
    },
    zIndex: { type: Number, default: 5000 },
    height: { type: Number, default: 500 },
    focus: { type: Boolean, default: false },
    placeholder: { type: String, default: '请输入内容' }
  },
  data() {
    return {
      name: '富文本编辑器',
      editor: null,
      editorId: this.id,
      editorContent: this.content,
      editorContentNew: '',
      fileDialog: false,
      fileTitle: '文件管理',
      fileType: 'image'
    }
  },
  watch: {
    content(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.content)
      }
    }
  },
  mounted() {
    this.editorCreate()
  },
  unmounted() {
    this.editorDestroy()
  },
  methods: {
    // 编辑器创建
    editorCreate() {
      const that = this
      // 扩展菜单
      const { BtnMenu } = E

      class upimage extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(
            `<div class="w-e-menu" data-title="上传图片"><el-button>图片</el-button></div>`
          )
          super($elem, editor)
        }
        clickHandler() {
          that.fileType = 'image'
          that.fileTitle = '上传图片'
          that.fileDialog = true
        }
        tryChangeActive() {}
      }

      class upvideo extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(
            `<div class="w-e-menu" data-title="上传视频"><el-button>视频</el-button></div>`
          )
          super($elem, editor)
        }
        clickHandler() {
          that.fileType = 'video'
          that.fileTitle = '上传视频'
          that.fileDialog = true
        }
        tryChangeActive() {}
      }

      class upaudio extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(
            `<div class="w-e-menu" data-title="上传音频"><el-button>音频</el-button></div>`
          )
          super($elem, editor)
        }
        clickHandler() {
          that.fileType = 'audio'
          that.fileTitle = '上传音频'
          that.fileDialog = true
        }
        tryChangeActive() {}
      }

      class upword extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(
            `<div class="w-e-menu" data-title="上传文档"><el-button>文档</el-button></div>`
          )
          super($elem, editor)
        }
        clickHandler() {
          that.fileType = 'word'
          that.fileTitle = '上传文档'
          that.fileDialog = true
        }
        tryChangeActive() {}
      }

      class upother extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(
            `<div class="w-e-menu" data-title="上传附件"><el-button>附件</el-button></div>`
          )
          super($elem, editor)
        }
        clickHandler() {
          that.fileType = 'other'
          that.fileTitle = '上传附件'
          that.fileDialog = true
        }
        tryChangeActive() {}
      }

      class clear extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(
            `<div class="w-e-menu" data-title="清空内容"><el-button>清空</el-button></div>`
          )
          super($elem, editor)
        }
        clickHandler() {
          that.editor.txt.clear()
        }
        tryChangeActive() {}
      }
      // 配置
      that.editor = new E('#' + that.editorId)
      that.editor.config.excludeMenus = that.excludeMenus
      that.editor.menus.extend('upimageKey', upimage)
      that.editor.config.menus = that.editor.config.menus.concat('upimageKey')
      that.editor.menus.extend('upvideoKey', upvideo)
      that.editor.config.menus = that.editor.config.menus.concat('upvideoKey')
      that.editor.menus.extend('upaudioKey', upaudio)
      that.editor.config.menus = that.editor.config.menus.concat('upaudioKey')
      that.editor.menus.extend('upwordKey', upword)
      that.editor.config.menus = that.editor.config.menus.concat('upwordKey')
      that.editor.menus.extend('upotherKey', upother)
      that.editor.config.menus = that.editor.config.menus.concat('upotherKey')
      that.editor.menus.extend('clearKey', clear)
      that.editor.config.menus = that.editor.config.menus.concat('clearKey')

      that.editor.config.zIndex = that.zIndex
      that.editor.config.height = that.height
      that.editor.config.focus = that.focus
      that.editor.config.placeholder = that.placeholder

      that.editor.config.onchange = (newHtml) => {
        that.editorContentNew = newHtml
        this.$emit('change', that.editorContentNew)
      }

      console.log(that.editor.textElemId)
      console.log(that.editor.toolbarElemId)

      that.editor.create()
      that.editor.txt.clear()
      that.editor.txt.html(that.editorContent)
    },
    // 编辑器销毁
    editorDestroy() {
      this.editorContent = ''
      this.editorContentNew = ''
      if (this.editor) {
        this.editor.txt.html('')
        this.editor.destroy()
        this.editor = null
      }
    },
    // 文件管理
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(filelist, filetype) {
      this.fileDialog = false
      this.fileTitle = ''
      const fileLength = filelist.length
      if (fileLength) {
        for (let i = 0; i < fileLength; i++) {
          if (filetype === 'image') {
            this.editor.cmd.do(
              'insertHTML',
              `<img file-id="${filelist[i]['file_id']}" src="${filelist[i]['file_url']}" style="max-width:50%;"/>`
            )
          } else if (filetype === 'video') {
            this.editor.cmd.do(
              'insertHTML',
              `<video width="50%" height="50%" controls>
                <source file-id="${filelist[i]['file_id']}" src="${filelist[i]['file_url']}" type="video/mp4">
                <object file-id="${filelist[i]['file_id']}" data="${filelist[i]['file_url']}" width="50%" height="50%">
                  <embed file-id="${filelist[i]['file_id']}" src="${filelist[i]['file_url']}" width="50%" height="50%">
                </object>
              </video>`
            )
          } else if (filetype === 'audio') {
            this.editor.cmd.do(
              'insertHTML',
              `<audio width="50%" height="50%" controls>
                <source file-id="${filelist[i]['file_id']}" src="${filelist[i]['file_url']}" type="audio/mp3">
                <embed file-id="${filelist[i]['file_id']}" src="${filelist[i]['file_url']}" width="50%" height="50%">
              </audio>`
            )
          } else {
            this.editor.cmd.do(
              'insertHTML',
              `<a file-id="${filelist[i]['file_id']}" href="${filelist[i]['file_url']}" download="${filelist[i]['file_url']}" target="_blank">${filelist[i]['file_name']}.${filelist[i]['file_ext']}</a>`
            )
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.w-e-toolbar {
  border: 1px solid var(--el-border-color) !important;
  background-color: var(--el-bg-color) !important;
  border-bottom: 0 !important;
}
.w-e-text-container {
  border: 1px solid var(--el-border-color) !important;
  background-color: var(--el-bg-color) !important;
}
</style>
