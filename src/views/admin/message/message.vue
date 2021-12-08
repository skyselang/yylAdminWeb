<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="22">
          <el-select v-model="query.search_field" class="filter-item" style="width:110px;" placeholder="">
            <el-option value="title" label="标题" />
            <el-option value="admin_user" label="用户" />
            <el-option value="admin_user_id" label="用户ID" />
            <el-option value="admin_message_id" label="消息ID" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item" style="width:200px;" placeholder="标题/用户/用户ID" clearable />
          <el-select v-model="query.date_field" class="filter-item" style="width:110px;" placeholder="">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="filter-item"
            style="width:240px;"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="2" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height" style="width:100%" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="40" title="全选/反选" />
      <el-table-column prop="admin_message_id" label="消息ID" min-width="100" sortable="custom" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="is_open" label="开启" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_open" :active-value="1" :inactive-value="0" @change="isopen([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" sortable="custom" />
      <el-table-column prop="admin_user" label="添加用户" min-width="120" show-overflow-tooltip />
      <el-table-column prop="create_time" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="120" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选中操作 -->
    <div style="margin-left:10px; margin-top:20px">
      <el-checkbox v-model="selectButton" style="padding-right:10px" title="全选/反选" @change="selectAll()" />
      <el-button size="mini" type="text" @click="selectOpen('isopen')">开启</el-button>
      <el-button size="mini" type="text" @click="dele(selection)">删除</el-button>
    </div>
    <el-dialog title="操作" :visible.sync="selectDialog">
      <el-form ref="selectRef" label-width="100px">
        <el-form-item v-if="selectType==='isopen'" label="开启" prop="">
          <el-switch v-model="is_open" style="margin-left: 10px;" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectCancel">取消</el-button>
        <el-button type="primary" @click="selectSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="1vh" width="50%" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false" @opened="dialogOpened()" @closed="dialogClosed()">
      <el-form ref="ref" :model="model" :rules="rules" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" />
        </el-form-item>
        <el-form-item label="开启" prop="is_open">
          <el-switch v-model="model.is_open" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="model.intro" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div id="content" />
        </el-form-item>
        <el-form-item v-if="model.admin_message_id" label="用户" prop="create_time">
          <el-col :span="10">
            <el-input v-model="model.admin_user" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">用户ID</el-col>
          <el-col :span="10">
            <el-input v-model="model.admin_user_id" disabled />
          </el-col>
        </el-form-item>
        <el-form-item v-if="model.admin_message_id" label="添加时间" prop="create_time">
          <el-col :span="10">
            <el-input v-model="model.create_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">修改时间</el-col>
          <el-col :span="10">
            <el-input v-model="model.update_time" disabled />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 文件管理(富文本编辑器) -->
    <el-dialog :title="fileTitle" :visible.sync="editorDialog" width="80%" top="1vh">
      <file-manage :file-type="editorFileType" @fileCancel="fileCancelEd" @fileSubmit="fileSubmitEd" />
    </el-dialog>
  </div>
</template>

<script>
import E from 'wangeditor'
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import FileManage from '@/components/FileManage'
import { list, info, add, edit, dele, isopen } from '@/api/admin/message'

export default {
  name: 'AdminSystemMessage',
  components: { Pagination, FileManage },
  data() {
    return {
      name: '消息',
      height: 680,
      loading: false,
      data: [],
      count: 0,
      query: {
        page: 1,
        limit: 15,
        search_field: 'title',
        date_field: 'create_time'
      },
      dialog: false,
      dialogTitle: '',
      model: {
        admin_message_id: '',
        admin_user_id: 0,
        admin_user: '',
        title: '',
        type: 1,
        sort: 250,
        is_open: 1,
        intro: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      },
      fileDialog: false,
      fileType: 'image',
      fileTitle: '文件管理',
      editor: null,
      editorDialog: false,
      editorFileType: 'image',
      selection: [],
      selectButton: false,
      selectDialog: false,
      selectType: '',
      is_open: 0
    }
  },
  created() {
    this.height = screenHeight(280)
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.selectButton = false
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加、修改
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row.admin_message_id
      info({
        admin_message_id: row.admin_message_id
      }).then(res => {
        this.model = res.data
      })
    },
    cancel() {
      this.reset()
      this.dialog = false
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.admin_message_id) {
            edit(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '记录吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].admin_message_id
          message = '确定要删除' + this.name + ' <span style="color:red">' + row[0].title + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          dele({
            list: row
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
    },
    // 重置
    reset() {
      this.model = this.$options.data().model
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
      }
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.list()
    },
    // 排序
    sort(sort) {
      this.query.sort_field = sort.prop
      this.query.sort_value = ''
      if (sort.order === 'ascending') {
        this.query.sort_value = 'asc'
        this.list()
      }
      if (sort.order === 'descending') {
        this.query.sort_value = 'desc'
        this.list()
      }
    },
    // 选中操作
    select(selection) {
      if (selection.length) {
        this.selectButton = true
      } else {
        this.selectButton = false
      }
      this.selection = selection
    },
    selectAlert(message = '') {
      this.$alert(message || '请选择需要操作的' + this.name, '提示', { confirmButtonText: '确定', callback: action => {} })
    },
    selectAll() {
      if (this.selectButton) {
        this.$refs.table.toggleAllSelection()
      } else {
        this.$refs.table.clearSelection()
      }
    },
    selectOpen(selectType) {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectDialog = true
        this.selectType = selectType
      }
    },
    selectCancel() {
      this.selectDialog = false
    },
    selectSubmit() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        const type = this.selectType
        if (type === 'region') {
          this.region(this.selection, true)
        } else if (type === 'isopen') {
          this.isopen(this.selection, true)
        } else if (type === 'repwd') {
          this.repwd(this.selection, true)
        }
        this.selectDialog = false
      }
    },
    // 是否开启
    isopen(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_open = row[0].is_open
        if (select) {
          is_open = this.is_open
        }
        isopen({
          list: row,
          is_open: is_open
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
        })
      }
    },
    // 富文本编辑器
    dialogOpened() {
      const that = this
      // 扩展菜单
      const { BtnMenu } = E
      class upimg extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(`<div class="w-e-menu" data-title="上传图片"><el-button>图片</el-button></div>`)
          super($elem, editor)
        }
        clickHandler() {
          that.editorFileType = 'image'
          that.fileTitle = '上传图片'
          that.editorDialog = true
        }
        tryChangeActive() {}
      }
      class upfile extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(`<div class="w-e-menu" data-title="上传附件"><el-button>附件</el-button></div>`)
          super($elem, editor)
        }
        clickHandler() {
          that.editorFileType = 'word'
          that.fileTitle = '上传附件'
          that.editorDialog = true
        }
        tryChangeActive() {}
      }
      class upvideo extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(`<div class="w-e-menu" data-title="上传视频"><el-button>视频</el-button></div>`)
          super($elem, editor)
        }
        clickHandler() {
          that.editorFileType = 'video'
          that.fileTitle = '上传视频'
          that.editorDialog = true
        }
        tryChangeActive() {}
      }
      class clear extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(`<div class="w-e-menu" data-title="清空内容"><el-button>清空</el-button></div>`)
          super($elem, editor)
        }
        clickHandler() {
          that.editor.txt.clear()
        }
        tryChangeActive() {}
      }
      that.editor = new E('#content')
      that.editor.config.excludeMenus = ['image', 'video']
      that.editor.menus.extend('upimgKey', upimg)
      that.editor.config.menus = that.editor.config.menus.concat('upimgKey')
      that.editor.menus.extend('upfileKey', upfile)
      that.editor.config.menus = that.editor.config.menus.concat('upfileKey')
      that.editor.menus.extend('upvideoKey', upvideo)
      that.editor.config.menus = that.editor.config.menus.concat('upvideoKey')
      that.editor.menus.extend('clearKey', clear)
      that.editor.config.menus = that.editor.config.menus.concat('clearKey')

      that.editor.config.height = 500
      that.editor.config.focus = false
      that.editor.config.placeholder = ''
      that.editor.config.onchange = (newHtml) => {
        that.model.content = newHtml
      }
      that.editor.create()
      that.editor.txt.html(that.model.content)
    },
    dialogClosed() {
      this.editor.destroy()
      this.editor = null
    },
    // 上传图片、附件、视频
    fileUpload(filetype, fileTitle = '文件管理') {
      this.fileType = filetype
      this.fileTitle = fileTitle
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(filelists, filetype) {
      this.fileDialog = false
      this.fileTitle = ''
      const file_len = filelists.length
      if (filelists) {
        for (let i = 0; i < file_len; i++) {
          if (filetype === 'image') {
            this.model.imgs.push(filelists[i])
          } else if (filetype === 'word') {
            this.model.files.push(filelists[i])
          } else if (filetype === 'video') {
            this.model.videos.push(filelists[i])
          }
        }
      }
    },
    fileCancelEd() {
      this.editorDialog = false
    },
    fileSubmitEd(filelists, filetype) {
      this.editorDialog = false
      this.fileTitle = ''
      const file_len = filelists.length
      if (filelists) {
        for (let i = 0; i < file_len; i++) {
          if (filetype === 'image') {
            this.editor.cmd.do(
              'insertHTML',
              `<img file-ids="${filelists[i]['file_id']}" src="${filelists[i]['file_url']}" style="max-width:50%;"/>`
            )
          } else if (filetype === 'word') {
            this.editor.cmd.do(
              'insertHTML',
              `<a file-ids="${filelists[i]['file_id']}" href="${filelists[i]['file_url']}" download="${filelists[i]['file_url']}" target="_blank">${filelists[i]['file_name']}</el-link>`
            )
          } else {
            this.editor.cmd.do(
              'insertHTML',
              `<video width="50%" height="50%" controls>
                <source file-ids="${filelists[i]['file_id']}" src="${filelists[i]['file_url']}" type="video/mp4">
                <object file-ids="${filelists[i]['file_id']}" data="${filelists[i]['file_url']}" width="50%" height="50%">
                  <embed file-ids="${filelists[i]['file_id']}" src="${filelists[i]['file_url']}" width="50%" height="50%">
                </object>
              </video>`
            )
          }
        }
      }
    },
    uploadDele(index) {
      this.model.imgs.splice(index, 1)
    },
    uploadFileDele(index) {
      this.model.files.splice(index, 1)
    },
    uploadVideoDele(index) {
      this.model.videos.splice(index, 1)
    }
  }
}
</script>
