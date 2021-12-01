<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="20">
          <el-select v-model="query.search_field" class="filter-item" style="width:110px;" placeholder="">
            <el-option value="content_id" label="内容ID" />
            <el-option value="name" label="名称" />
            <el-option value="is_top" label="是否置顶" />
            <el-option value="is_hot" label="是否热门" />
            <el-option value="is_rec" label="是否推荐" />
            <el-option value="is_hide" label="是否隐藏" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item" style="width:20%;min-width:150px;" placeholder="搜索内容" clearable />
          <el-cascader
            v-model="query.category_id"
            class="filter-item"
            :options="categoryData"
            :props="{checkStrictly: true, value: 'category_id', label: 'category_name'}"
            style="width:150px"
            clearable
            filterable
            placeholder="分类"
            @change="categoryChangeQuery"
          />
          <el-select v-model="query.date_field" class="filter-item" style="width:110px;" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
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
    <el-table ref="table" v-loading="loading" :data="data" :height="height-50" style="width: 100%" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="40" title="全选/反选" />
      <el-table-column prop="content_id" label="内容ID" min-width="100" sortable="custom" />
      <el-table-column prop="img_url" label="图片" min-width="70" align="center">
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
      <el-table-column label="操作" min-width="85" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 全选操作 -->
    <div style="margin-top: 20px">
      <el-checkbox v-model="selectButton" style="padding-right:10px" title="全选/反选" @change="selectAll()" />
      <el-button size="mini" type="text" @click="selectOpen('cate')">分类</el-button>
      <el-button size="mini" type="text" @click="selectOpen('top')">置顶</el-button>
      <el-button size="mini" type="text" @click="selectOpen('hot')">热门</el-button>
      <el-button size="mini" type="text" @click="selectOpen('rec')">推荐</el-button>
      <el-button size="mini" type="text" @click="selectOpen('hide')">隐藏</el-button>
      <el-button size="mini" type="text" @click="dele(selection)">删除</el-button>
    </div>
    <el-dialog title="全选操作" :visible.sync="selectDialog">
      <el-form ref="selectRef" label-width="100px">
        <el-form-item v-if="selectType==='cate'" label="分类" prop="">
          <el-cascader
            v-model="category_id"
            class="filter-item"
            :options="categoryData"
            :props="{checkStrictly: true, value: 'category_id', label: 'category_name'}"
            style="width:150px"
            clearable
            filterable
            placeholder="分类"
            @change="selectCategoryChange"
          />
        </el-form-item>
        <el-form-item v-if="selectType==='top'" label="是否置顶" prop="">
          <el-switch v-model="is_top" style="margin-left: 10px;" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-if="selectType==='hot'" label="是否热门" prop="">
          <el-switch v-model="is_hot" style="margin-left: 10px;" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-if="selectType==='rec'" label="是否推荐" prop="">
          <el-switch v-model="is_rec" style="margin-left: 10px;" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-if="selectType==='hide'" label="是否隐藏" prop="">
          <el-switch v-model="is_hide" style="margin-left: 10px;" :active-value="1" :inactive-value="0" />
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
    <el-dialog :title="dialogTitle" :visible.sync="dialog" width="65%" top="1vh" :before-close="cancel" @opened="dialogOpened()" @closed="dialogClosed()" @close-on-click-modal="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="分类" prop="category_id" clearable placeholder="请选择">
          <el-cascader
            v-model="model.category_id"
            :options="categoryData"
            :props="{checkStrictly: true, value: 'category_id', label: 'category_name'}"
            style="width:100%"
            clearable
            filterable
            placeholder="请选择分类"
            @change="categoryChange"
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
        <el-form-item label="链接" prop="url">
          <el-input v-model="model.url" clearable placeholder="url" />
        </el-form-item>
        <el-form-item label="图片" prop="imgs">
          <el-row :gutter="0">
            <el-col :span="8">
              <el-button size="mini" @click="fileUpload('image', '上传图片')">上传图片</el-button>
            </el-col>
            <el-col :span="16">
              <div>每张图片大小不超过 500 KB，jpg、png格式。</div>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col v-for="(item, index) in model.imgs" :key="index" :span="6" style="border:1px solid #DCDFE6">
              <el-image style="width:100%;height:100px;" :src="item.file_url" :preview-src-list="[item.file_url]" fit="contain" title="点击查看大图" />
              <br style="line-height: 0">
              <el-link :href="item.file_url" :underline="false" :download="item.file_url" target="_blank" style="margin:0 1px">
                下载<span style="font-size:10px">({{ item.file_size }})</span>
              </el-link>
              <el-button size="mini" @click="uploadDele(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="附件" prop="files">
          <el-row :gutter="0">
            <el-col :span="8">
              <el-button size="mini" @click="fileUpload('word', '上传附件')">上传附件</el-button>
            </el-col>
            <el-col :span="16">
              <div>每个附件大小不超过 10 MB。</div>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in model.files" :key="index" :gutter="0">
            <el-col :span="16"><el-input v-model="item.file_name" placeholder="名称" clearable /></el-col>
            <el-col :span="4"><el-input v-model="item.file_size" placeholder="大小" clearable /></el-col>
            <el-col :span="4">
              <el-link :href="item.file_url" :underline="false" :download="item.file_url" target="_blank" style="margin:0 10px">下载</el-link>
              <el-button size="mini" @click="uploadFileDele(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="视频" prop="videos">
          <el-row :gutter="0">
            <el-col :span="8">
              <el-button size="mini" @click="fileUpload('video', '上传视频')">上传视频</el-button>
            </el-col>
            <el-col :span="16">
              <div>每个视频大小不超过 50 MB。</div>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in model.videos" :key="index" :gutter="0">
            <el-col :span="8"><el-input v-model="item.file_name" placeholder="名称" clearable /></el-col>
            <el-col :span="8"><el-input v-model="item.file_path" placeholder="网址" clearable /></el-col>
            <el-col :span="4"><el-input v-model="item.file_size" placeholder="大小" clearable /></el-col>
            <el-col :span="4">
              <el-link :href="item.file_url" :underline="false" :download="item.file_url" target="_blank" style="margin:0 10px">下载</el-link>
              <el-button size="mini" @click="uploadVideoDele(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div id="content" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" clearable placeholder="" />
        </el-form-item>
        <el-form-item v-if="model.content_id" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.update_time" label="修改时间" prop="update_time">
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
      <!-- 回收站查询 -->
      <div class="filter-container">
        <el-row :gutter="0">
          <el-col :xs="24" :sm="24">
            <el-select v-model="recoverQuery.search_field" class="filter-item" style="width:110px;" placeholder="">
              <el-option value="content_id" label="内容ID" />
              <el-option value="name" label="名称" />
              <el-option value="is_top" label="是否置顶" />
              <el-option value="is_hot" label="是否热门" />
              <el-option value="is_rec" label="是否推荐" />
              <el-option value="is_hide" label="是否隐藏" />
            </el-select>
            <el-input v-model="recoverQuery.search_value" class="filter-item" style="width:200px;" placeholder="搜索内容" clearable />
            <el-cascader
              v-model="recoverQuery.category_id"
              class="filter-item"
              :options="categoryData"
              :props="{checkStrictly: true, value: 'category_id', label: 'category_name'}"
              style="width:200px"
              clearable
              filterable
              placeholder="分类"
              @change="recoverCategoryChangeQuery"
            />
            <el-select v-model="recoverQuery.date_field" class="filter-item" style="width:110px;" placeholder="时间类型">
              <el-option value="delete_time" label="删除时间" />
              <el-option value="create_time" label="添加时间" />
            </el-select>
            <el-date-picker
              v-model="recoverQuery.date_value"
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
      <!-- 回收站列表 -->
      <el-table ref="recoverRef" v-loading="recoverLoad" :data="recoverData" :height="height-60" style="width: 100%" @sort-change="recoverSort" @selection-change="recoverSelect">
        <el-table-column type="selection" width="40" title="全选/反选" />
        <el-table-column prop="content_id" label="ID" min-width="80" sortable="custom" />
        <el-table-column prop="img_url" label="图片" min-width="70" align="center">
          <template slot-scope="scope">
            <el-image v-if="scope.row.img_url" style="height:40px;" :src="scope.row.img_url" :preview-src-list="[scope.row.img_url]" title="点击查看大图" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="230" show-overflow-tooltip />
        <el-table-column prop="category_name" label="分类" min-width="100" show-overflow-tooltip />
        <el-table-column prop="hits" label="点击量" min-width="90" />
        <el-table-column prop="is_top" label="置顶" min-width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_top" size="medium">是</el-tag><el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_hot" label="热门" min-width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_hot" size="medium">是</el-tag><el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_rec" label="推荐" min-width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_rec" size="medium">是</el-tag><el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_hide" label="隐藏" min-width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_hide" size="medium">是</el-tag><el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" min-width="80" sortable="custom" />
        <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
        <el-table-column prop="delete_time" label="删除时间" min-width="155" sortable="custom" />
        <el-table-column label="操作" min-width="85" align="right" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="text" @click="recoverReco([row])">恢复</el-button>
            <el-button size="mini" type="text" @click="recoverDele([row])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 回收站全选 -->
      <div style="margin-top: 20px">
        <el-checkbox v-model="recoverSelectButton" style="padding-right:10px" title="全选/反选" @change="recoverSelectAll()" />
        <el-button size="mini" type="text" @click="recoverReco(recoverSelection)">恢复</el-button>
        <el-button size="mini" type="text" @click="recoverDele(recoverSelection)">删除</el-button>
      </div>
      <!-- 回收站分页 -->
      <pagination v-show="recoverCount > 0" :total="recoverCount" :page.sync="recoverQuery.page" :limit.sync="recoverQuery.limit" @pagination="recoverList" />
    </el-dialog>
    <!-- 文件管理 -->
    <el-dialog :title="fileTitle" :visible.sync="fileDialog" width="80%" top="1vh">
      <file-manage :file-type="fileType" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
    <!-- 文件管理(编辑器) -->
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
import { list, category, info, add, edit, dele, cate, istop, ishot, isrec, ishide, recover, recoverReco, recoverDele } from '@/api/cms/content'

export default {
  name: 'CmsContent',
  components: { Pagination, FileManage },
  directives: { },
  data() {
    return {
      name: '内容',
      height: 680,
      loading: false,
      query: {
        page: 1,
        limit: 12,
        search_field: 'content_id',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        content_id: '',
        category_id: '',
        name: '',
        title: '',
        keywords: '',
        description: '',
        url: '',
        imgs: [],
        files: [],
        videos: [],
        content: '',
        sort: 200
      },
      categoryData: [],
      selection: [],
      selectButton: false,
      selectDialog: false,
      selectType: '',
      is_top: 0,
      is_hot: 0,
      is_rec: 0,
      is_hide: 0,
      category_id: 0,
      fileDialog: false,
      fileType: 'image',
      fileTitle: '文件管理',
      editor: null,
      editorDialog: false,
      editorFileType: 'image',
      rules: {
        category_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      recoverDialog: false,
      recoverDialogTitle: '',
      recoverLoad: false,
      recoverData: [],
      recoverCount: 0,
      recoverQuery: {
        page: 1,
        limit: 10,
        search_field: 'content_id',
        date_field: 'delete_time'
      },
      recoverSelection: [],
      recoverSelectButton: false
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
        this.selectButton = false
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.model = this.$options.data().model
    },
    // 修改
    edit(row) {
      this.loading = true
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row.content_id
      info({
        content_id: row.content_id
      }).then(res => {
        this.reset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].content_id
          message = '确定要删除' + this.name + ' <span style="color:red">' + row[0].name + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          dele({
            content: row
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
          if (this.model.content_id) {
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
        if (this.model.category_id === 0) {
          this.model.category_id = ''
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
    // 全选操作
    select(selection) {
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
        if (type === 'cate') {
          this.setcate(this.selection)
        } else if (type === 'top') {
          this.istop(this.selection, true)
        } else if (type === 'hot') {
          this.ishot(this.selection, true)
        } else if (type === 'rec') {
          this.isrec(this.selection, true)
        } else if (type === 'hide') {
          this.ishide(this.selection, true)
        }
        this.selectDialog = false
      }
    },
    selectCategoryChange(value) {
      this.category_id = value[value.length - 1]
    },
    // 设置分类
    setcate(row) {
      cate({
        content: row,
        category_id: this.category_id
      }).then(res => {
        this.list()
        this.selectDialog = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
      })
    },
    // 是否置顶
    istop(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_top = row[0].is_top
        if (select) {
          is_top = this.is_top
        }
        istop({
          content: row,
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
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_hot = row[0].is_hot
        if (select) {
          is_hot = this.is_hot
        }
        ishot({
          content: row,
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
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_rec = row[0].is_rec
        if (select) {
          is_rec = this.is_rec
        }
        isrec({
          content: row,
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
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_hide = row[0].is_hide
        if (select) {
          is_hide = this.is_hide
        }
        ishide({
          content: row,
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
    // 分类获取
    category() {
      category().then(res => {
        this.categoryData = res.data.list
      }).catch(() => {})
    },
    // 分类选择
    categoryChange(value) {
      if (value) {
        this.model.category_id = value[value.length - 1]
      }
    },
    // 分类选择（查询）
    categoryChangeQuery(value) {
      if (value) {
        this.query.category_id = value[value.length - 1]
      }
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
        this.recoverSelectButton = false
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
      this.recoverQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.recoverQuery.sort_value = 'asc'
        this.recoverList()
      }
      if (sort.order === 'descending') {
        this.recoverQuery.sort_value = 'desc'
        this.recoverList()
      }
    },
    // 回收站恢复
    recoverReco(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        var title = '恢复' + this.name
        var message = '确定要恢复选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].content_id
          message = '确定要恢复' + this.name + ' <span style="color:red">' + row[0].name + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.recoverLoad = true
          recoverReco({
            content: row
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
      if (!row.length) {
        this.selectAlert()
      } else {
        var title = '彻底删除' + this.name
        var message = '确定要彻底删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].content_id
          message = '确定要彻底删除' + this.name + ' <span style="color:red">' + row[0].name + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.recoverLoad = true
          recoverDele({
            content: row
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
    recoverSelectAll() {
      if (this.recoverSelectButton) {
        this.$refs.recoverRef.toggleAllSelection()
      } else {
        this.$refs.recoverRef.clearSelection()
      }
    },
    // 回收站分类选择（查询）
    recoverCategoryChangeQuery(value) {
      if (value) {
        this.recoverQuery.category_id = value[value.length - 1]
      }
    }
  }
}
</script>
