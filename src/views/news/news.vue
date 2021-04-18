<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="22">
          <el-input v-model="query.news_id" class="filter-item" style="width: 110px;" placeholder="ID" clearable />
          <el-input v-model="query.title" class="filter-item" style="width: 200px;" placeholder="标题" clearable />
          <el-select v-model="query.date_type" class="filter-item" style="width:110px;" placeholder="时间类型" clearable>
            <el-option value="time" label="时间" />
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_range"
            type="daterange"
            class="filter-item"
            style="width: 240px;"
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
    <el-table v-loading="loading" :data="data" :height="height+80" style="width: 100%" border @sort-change="sort">
      <el-table-column prop="news_id" label="ID" min-width="80" sortable="custom" />
      <el-table-column prop="image" label="图片" min-width="100" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.img_url"
            style="width: 40px; height: 40px;"
            :src="scope.row.img_url"
            :preview-src-list="[scope.row.img_url]"
            title="点击查看大图"
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
      <el-table-column prop="time" label="时间" min-width="160" sortable="custom" />
      <el-table-column prop="sort" label="排序" min-width="75" sortable="custom" />
      <el-table-column prop="hits" label="点击量" min-width="90" sortable="custom" />
      <el-table-column prop="is_top" label="是否置顶" min-width="105" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_top" :active-value="1" :inactive-value="0" @change="istop(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_hot" label="是否热门" min-width="105" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_hot" :active-value="1" :inactive-value="0" @change="ishot(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_rec" label="是否推荐" min-width="105" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_rec" :active-value="1" :inactive-value="0" @change="isrec(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_hide" label="是否隐藏" min-width="105" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_hide" :active-value="1" :inactive-value="0" @change="ishide(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="150" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="success" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="dele(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="1vh" width="65%" :before-close="cancel" @opened="dialogOpened()" @closed="dialogClosed()" @close-on-click-modal="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item label="图片" prop="img">
          <el-col :span="10">
            <el-image shape="circle" fit="contain" style="height: 100px" :src="model.img_url">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-col>
          <el-col class="line" :span="4" style="text-align:center" />
          <el-col :span="10">
            <el-upload
              name="file"
              :show-file-list="false"
              :action="uploadAction"
              :headers="uploadHeaders"
              :data="uploadData"
              :on-success="uploadSuccess"
              :on-error="uploadError"
            >
              <el-button>上传图片</el-button>
            </el-upload>
            <span>jpg、png、gif图片，小于200KB，宽高1:1</span>
          </el-col>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" clearable placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="model.intro" type="textarea" clearable placeholder="" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="model.author" clearable placeholder="" />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="model.time"
            type="datetime"
            class="filter-item"
            style="width: 240px;"
            range-separator="-"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择发布时间"
          />
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input v-model="model.source" clearable placeholder="" />
        </el-form-item>
        <el-form-item label="来源链接" prop="source_url">
          <el-input v-model="model.source_url" clearable placeholder="" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" clearable placeholder="" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div id="content" />
        </el-form-item>
        <el-form-item v-if="model.news_id" label="添加时间" prop="create_time">
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
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { getAdminUserId, getAdminToken } from '@/utils/auth'
import { list, info, add, edit, dele, istop, ishot, isrec, ishide } from '@/api/news'
import E from 'wangeditor'

export default {
  name: 'News',
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      height: 680,
      loading: false,
      query: {
        page: 1,
        limit: 13
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        news_id: '',
        img: '',
        img_url: '',
        title: '',
        intro: '',
        author: '',
        time: '',
        source: '',
        source_url: '',
        sort: 200,
        content: ''
      },
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/News/upload',
      uploadHeaders: { AdminUserId: getAdminUserId(), AdminToken: getAdminToken() },
      uploadData: { type: 'image' },
      editor: null,
      rules: {
        img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        time: [{ required: true, message: '请选择发布时间', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query).then(res => {
        this.data = res.data.list
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加
    add() {
      this.dialog = true
      this.dialogTitle = '新闻添加'
      this.model = this.$options.data().model
    },
    // 修改
    edit(row) {
      this.loading = true
      this.dialog = true
      this.dialogTitle = '新闻修改：' + row.news_id
      info({
        news_id: row.news_id
      }).then(res => {
        this.reset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    dele(row) {
      this.$confirm(
        '确定要删除新闻 <span style="color:red">' + row.title + ' </span>吗？',
        '删除新闻：' + row.news_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.loading = true
        dele({
          news_id: row.news_id
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 取消
    cancel() {
      this.reset()
      this.dialog = false
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.news_id) {
            edit(this.model).then(res => {
              this.dialog = false
              this.list()
              this.reset()
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.dialog = false
              this.list()
              this.reset()
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
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
      this.query.sort_type = ''
      if (sort.order === 'ascending') {
        this.query.sort_type = 'asc'
        this.list()
      }
      if (sort.order === 'descending') {
        this.query.sort_type = 'desc'
        this.list()
      }
    },
    // 是否置顶
    istop(row) {
      this.loading = true
      istop({
        news_id: row.news_id,
        is_top: row.is_top
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
        this.loading = false
      })
    },
    // 是否热门
    ishot(row) {
      this.loading = true
      ishot({
        news_id: row.news_id,
        is_hot: row.is_hot
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
        this.loading = false
      })
    },
    // 是否推荐
    isrec(row) {
      this.loading = true
      isrec({
        news_id: row.news_id,
        is_rec: row.is_rec
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
        this.loading = false
      })
    },
    // 是否隐藏
    ishide(row) {
      this.loading = true
      ishide({
        news_id: row.news_id,
        is_hide: row.is_hide
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
        this.loading = false
      })
    },
    // 上传图片
    uploadSuccess(res, file) {
      if (res.code === 200) {
        this.model.img_url = res.data.file_url
        this.model.img = res.data.file_path
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    uploadError(res, file) {
      this.$message.error('上传出错')
    },
    // 富文本编辑器
    dialogOpened() {
      const that = this
      // 扩展菜单
      const { BtnMenu } = E
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
      this.editor = new E('#content')
      this.editor.menus.extend('clearKey', clear)
      this.editor.config.menus = this.editor.config.menus.concat('clearKey')
      // 上传图片
      this.editor.config.uploadImgServer = this.uploadAction // 上传接口地址
      this.editor.config.uploadImgMaxLength = 1 // 一次最多上传数量
      this.editor.config.uploadImgParams = { type: 'file' } // 自定义上传参数
      this.editor.config.uploadFileName = 'file' // 自定义 fileName
      this.editor.config.uploadImgHeaders = this.uploadHeaders // 自定义 header
      this.editor.config.uploadImgHooks = {
        customInsert: function(insertImgFn, result) {
          if (result.code === 200) {
            insertImgFn(result.data.file_url)
          } else {
            that.$message.error(result.msg)
          }
        }
      }
      // 上传视频
      this.editor.config.uploadVideoServer = this.uploadAction // 上传接口地址
      this.editor.config.uploadVideoParams = { type: 'file' } // 自定义上传参数
      this.editor.config.uploadVideoName = 'file' // 自定义 fileName
      this.editor.config.uploadVideoHeaders = this.uploadHeaders // 自定义 header
      this.editor.config.uploadVideoHooks = {
        customInsert: function(insertVideoFn, result) {
          if (result.code === 200) {
            insertVideoFn(result.data.file_url)
          } else {
            that.$message.error(result.msg)
          }
        }
      }

      this.editor.config.height = 500
      this.editor.config.focus = false
      this.editor.config.placeholder = ''
      this.editor.config.onchange = (newHtml) => {
        this.model.content = newHtml
      }
      this.editor.create()
      this.editor.txt.html(this.model.content)
    },
    dialogClosed() {
      this.editor.destroy()
      this.editor = null
    }
  }
}
</script>
