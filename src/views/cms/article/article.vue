<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="20">
          <el-input v-model="query.article_id" class="filter-item" style="width: 110px;" placeholder="ID" clearable />
          <el-input v-model="query.name" class="filter-item" style="width: 200px;" placeholder="名称" clearable />
          <el-cascader
            v-model="query.article_category_id"
            class="filter-item"
            :options="articleCategory"
            :props="{checkStrictly: true, value: 'article_category_id', label: 'category_name'}"
            style="width:150px"
            clearable
            filterable
            placeholder="分类"
            @change="pidChangeQuery"
          />
          <el-select v-model="query.date_type" class="filter-item" style="width:110px;" placeholder="时间类型" clearable>
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
        <el-col :xs="24" :sm="4" style="text-align:right;">
          <el-button class="filter-item" @click="recover()">回收站</el-button>
          <el-button class="filter-item" type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="data" :height="height-50" style="width: 100%" border @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="article_id" label="ID" min-width="80" sortable="custom" />
      <el-table-column prop="image" label="图片" min-width="70" align="center">
        <template slot-scope="scope">
          <el-image v-if="scope.row.img_url" style="width:40px;height:40px;" :src="scope.row.img_url" :preview-src-list="[scope.row.img_url]" title="点击查看大图" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="230" show-overflow-tooltip />
      <el-table-column prop="category_name" label="分类" min-width="100" show-overflow-tooltip />
      <el-table-column prop="hits" label="点击量" min-width="90" sortable="custom" />
      <el-table-column prop="sort" label="排序" min-width="80" sortable="custom" />
      <el-table-column prop="is_top" label="置顶" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_top" :active-value="1" :inactive-value="0" @change="istop([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_hot" label="热门" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_hot" :active-value="1" :inactive-value="0" @change="ishot([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_rec" label="推荐" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_rec" :active-value="1" :inactive-value="0" @change="isrec([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_hide" label="隐藏" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_hide" :active-value="1" :inactive-value="0" @change="ishide([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" min-width="145" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="success" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-switch v-model="is_top" style="margin-left: 10px;" :active-value="1" :inactive-value="0" />
      <el-button size="mini" @click="istop(selection,true)">置顶</el-button>
      <el-switch v-model="is_hot" style="margin-left: 10px;" :active-value="1" :inactive-value="0" />
      <el-button size="mini" @click="ishot(selection,true)">热门</el-button>
      <el-switch v-model="is_rec" style="margin-left: 10px;" :active-value="1" :inactive-value="0" />
      <el-button size="mini" @click="isrec(selection,true)">推荐</el-button>
      <el-switch v-model="is_hide" style="margin-left: 10px;" :active-value="1" :inactive-value="0" />
      <el-button size="mini" @click="ishide(selection,true)">隐藏</el-button>
      <el-button size="mini" type="danger" @click="dele(selection)">删除</el-button>
    </div>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" width="65%" top="1vh" :before-close="cancel" @opened="dialogOpened()" @closed="dialogClosed()" @close-on-click-modal="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="分类" prop="article_category_id" clearable placeholder="请选择">
          <el-cascader
            v-model="model.article_category_id"
            :options="articleCategory"
            :props="{checkStrictly: true, value: 'article_category_id', label: 'category_name'}"
            style="width:100%"
            clearable
            filterable
            placeholder="请选择分类"
            @change="pidChange"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="model.name" clearable placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" clearable placeholder="title" />
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="model.keywords" clearable placeholder="keywords" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="model.description" type="textarea" clearable placeholder="description" />
        </el-form-item>
        <el-form-item label="图片" prop="imgs">
          <el-row :gutter="0">
            <el-col :span="8">
              <el-upload
                name="file"
                :file-list="model.imgs"
                :show-file-list="false"
                :action="uploadAction"
                :headers="uploadHeaders"
                :data="uploadData"
                :on-success="uploadSuccess"
                :on-error="uploadError"
              >
                <el-button size="mini">上传图片</el-button>
              </el-upload>
            </el-col>
            <el-col :span="16">
              <div>jpg、png格式，每张图片大小不超过 500 KB。</div>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col v-for="(item, index) in model.imgs" :key="index" :span="6" style="border:1px solid #DCDFE6">
              <el-image style="width:100%;height:100px;" :src="item.url" :preview-src-list="[item.url]" fit="contain" title="点击查看大图" />
              <br style="line-height: 0">
              <el-link :href="item.url" :underline="false" :download="item.url" target="_blank" style="margin:0 1px">
                下载<span style="font-size:10px">({{ item.size }})</span>
              </el-link>
              <el-button size="mini" @click="uploadDele(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div id="content" />
        </el-form-item>
        <el-form-item label="附件" prop="files">
          <el-row :gutter="0">
            <el-col :span="8">
              <el-upload
                name="file"
                :file-list="model.files"
                :show-file-list="false"
                :action="uploadAction"
                :headers="uploadHeaders"
                :data="uploadFileData"
                :on-success="uploadFileSuccess"
                :on-error="uploadError"
              >
                <el-button size="mini">上传附件</el-button>
              </el-upload>
            </el-col>
            <el-col :span="16">
              <div>每个附件大小不超过 10 MB。</div>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in model.files" :key="index" :gutter="0">
            <el-col :span="16"><el-input v-model="item.name" placeholder="名称" clearable /></el-col>
            <el-col :span="4"><el-input v-model="item.size" placeholder="大小" clearable /></el-col>
            <el-col :span="4">
              <el-link :href="item.url" :underline="false" :download="item.url" target="_blank" style="margin:0 10px">下载</el-link>
              <el-button size="mini" @click="uploadFileDele(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" clearable placeholder="" />
        </el-form-item>
        <el-form-item v-if="model.article_id" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.article_id" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
          <el-input v-model="model.delete_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 回收站 -->
    <el-dialog :title="recoverDialogTitle" :visible.sync="recoverDialog" width="80%" top="1vh">
      <div class="filter-container">
        <el-row :gutter="0">
          <el-col :xs="24" :sm="24">
            <el-input v-model="recoverQuery.article_id" class="filter-item" style="width: 110px;" placeholder="ID" clearable />
            <el-input v-model="recoverQuery.name" class="filter-item" style="width: 200px;" placeholder="名称" clearable />
            <el-cascader
              v-model="recoverQuery.article_category_id"
              class="filter-item"
              :options="articleCategory"
              :props="{checkStrictly: true, value: 'article_category_id', label: 'category_name'}"
              style="width:150px"
              clearable
              filterable
              placeholder="分类"
              @change="recoverPidChangeQuery"
            />
            <el-select v-model="recoverQuery.date_type" class="filter-item" style="width:110px;" placeholder="时间类型" clearable>
              <el-option value="create_time" label="添加时间" />
              <el-option value="update_time" label="修改时间" />
              <el-option value="delete_time" label="删除时间" />
            </el-select>
            <el-date-picker
              v-model="recoverQuery.date_range"
              type="daterange"
              class="filter-item"
              style="width: 240px;"
              range-separator="-"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-button class="filter-item" type="primary" @click="recoverSearch()">查询</el-button>
            <el-button class="filter-item" @click="recoverRefresh()">刷新</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table ref="recoverRef" v-loading="recoverLoad" :data="recoverData" :height="height-60" style="width: 100%" border @sort-change="recoverSort" @selection-change="recoverSelect">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="article_id" label="ID" min-width="80" sortable="custom" />
        <el-table-column prop="image" label="图片" min-width="70" align="center">
          <template slot-scope="scope">
            <el-image v-if="scope.row.img_url" style="height:40px;" :src="scope.row.img_url" :preview-src-list="[scope.row.img_url]" title="点击查看大图" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="230" show-overflow-tooltip />
        <el-table-column prop="category_name" label="分类" min-width="100" show-overflow-tooltip />
        <el-table-column prop="hits" label="点击量" min-width="90" sortable="custom" />
        <el-table-column prop="sort" label="排序" min-width="80" sortable="custom" />
        <el-table-column prop="is_top" label="置顶" min-width="80" sortable="custom" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_top" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_hot" label="热门" min-width="80" sortable="custom" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_hot" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_rec" label="推荐" min-width="80" sortable="custom" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_rec" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_hide" label="隐藏" min-width="80" sortable="custom" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_hide" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
        <el-table-column prop="delete_time" label="删除时间" min-width="155" sortable="custom" />
        <el-table-column label="操作" min-width="145" align="right" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="success" @click="recoverReco([row])">恢复</el-button>
            <el-button size="mini" type="danger" @click="recoverDele([row])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button size="mini" type="success" @click="recoverReco(recoverSelection)">恢复</el-button>
        <el-button size="mini" type="danger" @click="recoverDele(recoverSelection)">删除</el-button>
      </div>
      <pagination v-show="recoverCount > 0" :total="recoverCount" :page.sync="recoverQuery.page" :limit.sync="recoverQuery.limit" @pagination="recoverList" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { getAdminToken } from '@/utils/auth'
import { list, category, info, add, edit, dele, istop, ishot, isrec, ishide, recover, recoverReco, recoverDele } from '@/api/article'
import E from 'wangeditor'

export default {
  name: 'Article',
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      name: '文章',
      height: 680,
      loading: false,
      query: {
        page: 1,
        limit: 12
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        article_id: '',
        article_category_id: '',
        name: '',
        title: '',
        keywords: '',
        description: '',
        imgs: [],
        content: '',
        files: [],
        sort: 200
      },
      is_top: 0,
      is_hot: 0,
      is_rec: 0,
      is_hide: 0,
      selection: [],
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/Article/upload',
      uploadHeaders: { AdminToken: getAdminToken() },
      uploadData: { type: 'image' },
      uploadFileData: { type: 'file' },
      editor: null,
      rules: {
        article_category_id: [{ required: true, message: '请输入分类', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      articleCategory: [],
      recoverDialog: false,
      recoverDialogTitle: '',
      recoverLoad: false,
      recoverData: [],
      recoverCount: 0,
      recoverQuery: {
        page: 1,
        limit: 10
      },
      recoverSelection: []
    }
  },
  created() {
    this.height = screenHeight()
    this.list()
    this.category()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 选择
    select(selection) {
      this.selection = selection
    },
    selectAlert(message = '') {
      this.$alert(message || '请选择需要操作的' + this.name, '提示', { confirmButtonText: '确定', callback: action => {} })
    },
    // 添加
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.model = this.$options.data().model
      this.category()
    },
    // 修改
    edit(row) {
      this.loading = true
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row.article_id
      info({
        article_id: row.article_id
      }).then(res => {
        this.reset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      this.category()
    },
    // 删除
    dele(row) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].article_id
          message = '确定要删除' + this.name + ' <span style="color:red">' + row[0].name + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          dele({
            article: row
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
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
          if (this.model.article_id) {
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
        if (this.model.article_category_id === 0) {
          this.model.article_category_id = ''
        }
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
        this.$refs['ref'].clearValidate()
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
      this.category()
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
    istop(row, select = false) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_top = row[0].is_top
        if (select) {
          is_top = this.is_top
        }
        istop({
          article: row,
          is_top: is_top
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 是否热门
    ishot(row, select = false) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_hot = row[0].is_hot
        if (select) {
          is_hot = this.is_hot
        }
        ishot({
          article: row,
          is_hot: is_hot
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 是否推荐
    isrec(row, select = false) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_rec = row[0].is_rec
        if (select) {
          is_rec = this.is_rec
        }
        isrec({
          article: row,
          is_rec: is_rec
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 是否隐藏
    ishide(row, select = false) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_hide = row[0].is_hide
        if (select) {
          is_hide = this.is_hide
        }
        ishide({
          article: row,
          is_hide: is_hide
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 分类
    category() {
      category().then(res => {
        this.articleCategory = res.data.list
      }).catch(() => {})
    },
    // 父级选择
    pidChange(value) {
      if (value) {
        this.model.article_category_id = value[value.length - 1]
      }
    },
    // 父级选择（查询）
    pidChangeQuery(value) {
      if (value) {
        this.query.article_category_id = value[value.length - 1]
      }
    },
    // 上传图片
    uploadSuccess(res, file, fileList) {
      if (res.code === 200) {
        this.model.imgs.push(res.data)
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    uploadError(res, file, fileList) {
      this.$message.error(res.msg || '上传出错')
    },
    uploadDele(index) {
      this.model.imgs.splice(index, 1)
    },
    // 上传附件
    uploadFileSuccess(res, file, fileList) {
      if (res.code === 200) {
        this.model.files.push(res.data)
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    uploadFileDele(index) {
      this.model.files.splice(index, 1)
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
      this.editor.config.uploadImgParams = { type: 'image' } // 自定义上传参数
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
      this.editor.config.uploadVideoParams = { type: 'video' } // 自定义上传参数
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
    },
    // 回收站
    recover() {
      this.recoverDialog = true
      this.recoverDialogTitle = this.name + '回收站'
      this.recoverList()
    },
    // 回收站查询
    recoverSearch() {
      this.recoverQuery.page = 1
      this.recoverList()
    },
    // 回收站刷新
    recoverRefresh() {
      this.recoverQuery = this.$options.data().recoverQuery
      this.recoverList()
    },
    // 回收站列表
    recoverList() {
      this.recoverLoad = true
      recover(this.recoverQuery).then(res => {
        this.recoverData = res.data.list
        this.recoverCount = res.data.count
        this.recoverLoad = false
        this.$nextTick(() => {
          this.$refs['recoverRef'].doLayout()
        })
      }).catch(() => {
        this.recoverLoad = false
      })
    },
    // 回收站排序
    recoverSort(sort) {
      this.recoverQuery.sort_field = sort.prop
      this.recoverQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.recoverQuery.sort_type = 'asc'
        this.recoverList()
      }
      if (sort.order === 'descending') {
        this.recoverQuery.sort_type = 'desc'
        this.recoverList()
      }
    },
    // 回收站恢复
    recoverReco(row) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        var title = '恢复' + this.name
        var message = '确定要恢复选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].article_id
          message = '确定要恢复' + this.name + ' <span style="color:red">' + row[0].name + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.recoverLoad = true
          recoverReco({
            article: row
          }).then(res => {
            this.list()
            this.recoverList()
            this.$message.success(res.msg)
          }).catch(() => {
            this.recoverLoad = false
          })
        }).catch(() => {})
      }
    },
    // 回收站删除
    recoverDele(row) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要彻底删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].article_id
          message = '确定要彻底删除' + this.name + ' <span style="color:red">' + row[0].name + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.recoverLoad = true
          recoverDele({
            article: row
          }).then(res => {
            this.recoverList()
            this.$message.success(res.msg)
          }).catch(() => {
            this.recoverLoad = false
          })
        }).catch(() => {})
      }
    },
    // 回收站选择
    recoverSelect(selection) {
      this.recoverSelection = selection
    },
    // 回收站父级选择（查询）
    recoverPidChangeQuery(value) {
      if (value) {
        this.recoverQuery.article_category_id = value[value.length - 1]
      }
    }
  }
}
</script>
