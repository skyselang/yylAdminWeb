<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-row>
      <el-col class="mb-2">
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="查询字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="unique" label="标识" />
          <el-option value="name" label="名称" />
          <el-option value="category_ids" label="分类" />
          <el-option value="tag_ids" label="标签" />
          <el-option value="is_top" label="置顶" />
          <el-option value="is_hot" label="热门" />
          <el-option value="is_rec" label="推荐" />
          <el-option value="is_disable" label="禁用" />
          <el-option value="title" label="标题" />
          <el-option value="keywords" label="关键词" />
          <el-option value="description" label="描述" />
          <el-option value="remark" label="备注" />
        </el-select>
        <el-select v-model="query.search_exp" class="ya-search-exp">
          <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
        </el-select>
        <el-cascader
          v-if="query.search_field === 'category_ids'"
          v-model="query.search_value"
          :options="categoryData"
          :props="categoryProps"
          clearable
          filterable
          collapse-tags
        />
        <el-select
          v-else-if="query.search_field === 'tag_ids'"
          v-model="query.search_value"
          class="ya-search-value"
          clearable
          filterable
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in tagData"
            :key="item.tag_id"
            :label="item.tag_name"
            :value="item.tag_id"
          />
        </el-select>
        <el-select
          v-else-if="
            query.search_field === 'is_top' ||
            query.search_field === 'is_hot' ||
            query.search_field === 'is_rec' ||
            query.search_field === 'is_disable'
          "
          v-model="query.search_value"
          class="ya-search-value"
        >
          <el-option :value="1" label="是" />
          <el-option :value="0" label="否" />
        </el-select>
        <el-input
          v-else
          v-model="query.search_value"
          class="ya-search-value"
          placeholder="查询内容"
          clearable
        />
        <el-select v-model="query.date_field" class="ya-date-field" placeholder="时间类型">
          <el-option value="create_time" label="添加时间" />
          <el-option value="update_time" label="修改时间" />
          <el-option value="release_time" label="发布时间" />
        </el-select>
        <el-date-picker
          v-model="query.date_value"
          type="datetimerange"
          class="ya-date-value"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="[new Date(2024, 1, 1, 0, 0, 0), new Date(2024, 1, 1, 23, 59, 59)]"
        />
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button title="重置" @click="refresh()">
          <svg-icon icon-class="refresh" />
        </el-button>
        <el-button type="primary" @click="add()">添加</el-button>
      </el-col>
    </el-row>
    <!-- 操作 -->
    <el-row>
      <el-col>
        <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
        <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
        <el-button title="发布时间" @click="selectOpen('release')">发布时间</el-button>
        <el-button title="修改分类" @click="selectOpen('editcate')">分类</el-button>
        <el-button title="修改标签" @click="selectOpen('edittag')">标签</el-button>
        <el-button title="是否置顶" @click="selectOpen('istop')">置顶</el-button>
        <el-button title="是否热门" @click="selectOpen('ishot')">热门</el-button>
        <el-button title="是否推荐" @click="selectOpen('isrec')">推荐</el-button>
      </el-col>
    </el-row>
    <el-dialog
      v-model="selectDialog"
      :title="selectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
    >
      <el-form ref="selectRef" label-width="120px">
        <el-form-item v-if="selectType === 'editcate'" label="分类">
          <el-cascader
            v-model="category_ids"
            :options="categoryData"
            :props="categoryProps"
            class="w-full"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'edittag'" label="标签">
          <el-select v-model="tag_ids" multiple clearable filterable class="w-full">
            <el-option
              v-for="item in tagData"
              :key="item.tag_id"
              :label="item.tag_name"
              :value="item.tag_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'istop'" label="是否置顶">
          <el-switch v-model="is_top" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'ishot'" label="是否热门">
          <el-switch v-model="is_hot" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'isrec'" label="是否推荐">
          <el-switch v-model="is_rec" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'disable'" label="是否禁用">
          <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'release'" label="发布时间">
          <el-date-picker
            v-model="release_time"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'dele'">
          <span class="c-red">确定要删除选中的{{ name }}吗？</span>
        </el-form-item>
        <el-form-item :label="name + 'ID'">
          <el-input v-model="selectIds" type="textarea" autosize disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="loading" @click="selectCancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
      </template>
    </el-dialog>
    <!-- 列表 -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :height="height"
      @sort-change="sort"
      @selection-change="select"
    >
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
      <el-table-column prop="unique" label="标识" min-width="75" show-overflow-tooltip />
      <el-table-column prop="image_url" label="图片" min-width="62" show-overflow-tooltip>
        <template #default="scope">
          <FileImage :file-url="scope.row.image_url" lazy />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="175" show-overflow-tooltip />
      <el-table-column prop="category_names" label="分类" min-width="105" show-overflow-tooltip />
      <el-table-column prop="tag_names" label="标签" min-width="105" show-overflow-tooltip />
      <el-table-column prop="is_top" label="置顶" min-width="85" sortable="custom">
        <template #default="scope">
          <el-switch
            v-model="scope.row.is_top"
            :active-value="1"
            :inactive-value="0"
            @change="istop([scope.row])"
          />
        </template>
      </el-table-column>
      <el-table-column prop="is_hot" label="热门" min-width="85" sortable="custom">
        <template #default="scope">
          <el-switch
            v-model="scope.row.is_hot"
            :active-value="1"
            :inactive-value="0"
            @change="ishot([scope.row])"
          />
        </template>
      </el-table-column>
      <el-table-column prop="is_rec" label="推荐" min-width="85" sortable="custom">
        <template #default="scope">
          <el-switch
            v-model="scope.row.is_rec"
            :active-value="1"
            :inactive-value="0"
            @change="isrec([scope.row])"
          />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="85" sortable="custom">
        <template #default="scope">
          <el-switch
            v-model="scope.row.is_disable"
            :active-value="1"
            :inactive-value="0"
            @change="disable([scope.row])"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="hits"
        label="点击"
        min-width="85"
        show-overflow-tooltip
        sortable="custom"
      />
      <el-table-column prop="release_time" label="发布时间" width="165" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" width="165" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" width="165" sortable="custom" />
      <el-table-column label="操作" width="95">
        <template #default="scope">
          <el-link type="primary" class="mr-1" :underline="false" @click="edit(scope.row)">
            修改
          </el-link>
          <el-link type="primary" :underline="false" @click="selectOpen('dele', [scope.row])">
            删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="count > 0"
      v-model:total="count"
      v-model:page="query.page"
      v-model:limit="query.limit"
      @pagination="list"
    />
    <!-- 添加修改 -->
    <el-dialog
      v-model="dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      top="5vh"
    >
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
        <el-tabs>
          <el-tab-pane label="信息">
            <el-scrollbar native :height="height - 80">
              <el-form-item label="标识" prop="unique">
                <el-input v-model="model.unique" placeholder="请输入标识（唯一）" clearable />
              </el-form-item>
              <el-form-item label="图片" prop="image_id">
                <FileImage
                  v-model="model.image_id"
                  :file-url="model.image_url"
                  :height="100"
                  upload
                />
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model="model.name" placeholder="请输入名称" clearable />
              </el-form-item>
              <el-form-item label="分类" prop="category_ids">
                <el-cascader
                  v-model="model.category_ids"
                  :options="categoryData"
                  :props="categoryProps"
                  class="w-full"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="标签" prop="tag_ids">
                <el-select v-model="model.tag_ids" class="w-full" multiple clearable filterable>
                  <el-option
                    v-for="item in tagData"
                    :key="item.tag_id"
                    :label="item.tag_name"
                    :value="item.tag_id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="标题" prop="title">
                <el-input v-model="model.title" placeholder="title" clearable />
              </el-form-item>
              <el-form-item label="关键词" prop="keywords">
                <el-input v-model="model.keywords" placeholder="keywords" clearable />
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input
                  v-model="model.description"
                  type="textarea"
                  autosize
                  placeholder="description"
                />
              </el-form-item>
              <el-form-item label="来源" prop="source">
                <el-input v-model="model.source" placeholder="source" clearable />
              </el-form-item>
              <el-form-item label="作者" prop="author">
                <el-input v-model="model.author" placeholder="author" clearable />
              </el-form-item>
              <el-form-item label="链接" prop="url">
                <el-input v-model="model.url" placeholder="url" clearable />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="model.remark" placeholder="remark" clearable />
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input v-model="model.sort" type="number" placeholder="sort" clearable />
              </el-form-item>
              <el-form-item label="初始点击" prop="hits_initial">
                <el-col :span="6">
                  <el-input v-model="model.hits_initial" type="number" placeholder="初始点击量" />
                </el-col>
                <el-col :span="3" class="text-center"> 真实点击 </el-col>
                <el-col :span="6">
                  <el-input v-model="model.hits" type="number" placeholder="真实点击量" disabled />
                </el-col>
                <el-col :span="3" class="text-center"> 展示点击 </el-col>
                <el-col :span="6">
                  <el-input
                    :value="parseFloat(model.hits_initial) + parseFloat(model.hits)"
                    type="number"
                    placeholder="初始点击量"
                    disabled
                  />
                </el-col>
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="发布时间" prop="release_time">
                <el-input v-model="model.release_time" disabled />
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
                <el-input v-model="model.create_time" disabled />
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
                <el-input v-model="model.update_time" disabled />
              </el-form-item>
              <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
                <el-input v-model="model.delete_time" disabled />
              </el-form-item>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="内容">
            <el-scrollbar native :height="height - 80">
              <el-form-item label="内容" prop="content">
                <RichEditor :content="model.content" />
              </el-form-item>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="附件">
            <el-scrollbar native :height="height - 80">
              <el-form-item label="图片列表" prop="images">
                <FileUploads
                  v-model="model.images"
                  upload-btn="上传图片"
                  file-type="image"
                  file-tip="图片文件"
                />
              </el-form-item>
              <el-form-item label="视频列表" prop="videos">
                <FileUploads
                  v-model="model.videos"
                  upload-btn="上传视频"
                  file-type="video"
                  file-tip="视频文件"
                />
              </el-form-item>
              <el-form-item label="音频列表" prop="audios">
                <FileUploads
                  v-model="model.audios"
                  upload-btn="上传音频"
                  file-type="audio"
                  file-tip="音频文件"
                />
              </el-form-item>
              <el-form-item label="文档列表" prop="words">
                <FileUploads
                  v-model="model.words"
                  upload-btn="上传文档"
                  file-type="word"
                  file-tip="文档文件"
                />
              </el-form-item>
              <el-form-item label="其它列表" prop="others">
                <FileUploads
                  v-model="model.others"
                  upload-btn="上传其它"
                  file-type="other"
                  file-tip="其它文件"
                />
              </el-form-item>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import RichEditor from '@/components/RichEditor/index.vue'
import { arrayColumn } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import {
  list,
  info,
  add,
  edit,
  dele,
  editcate,
  edittag,
  istop,
  ishot,
  isrec,
  disable,
  release
} from '@/api/content/content'

export default {
  name: 'ContentContent',
  components: { Pagination, RichEditor },

  data() {
    return {
      name: '内容',
      height: 680,
      loading: false,
      idkey: 'content_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'name',
        search_exp: 'like',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        content_id: '',
        unique: '',
        category_ids: [],
        tag_ids: [],
        image_id: 0,
        image_url: '',
        name: '',
        title: '',
        keywords: '',
        description: '',
        content: '',
        source: '',
        author: '',
        url: '',
        remark: '',
        sort: 250,
        hits: 0,
        hits_initial: 0,
        images: [],
        videos: [],
        audios: [],
        words: [],
        others: []
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      tagData: [],
      categoryData: [],
      categoryProps: {
        checkStrictly: true,
        value: 'category_id',
        label: 'category_name',
        multiple: true,
        emitPath: false
      },
      selection: [],
      selectIds: '',
      selectTitle: '操作',
      selectDialog: false,
      selectType: '',
      category_ids: [],
      tag_ids: [],
      is_top: 0,
      is_hot: 0,
      is_rec: 0,
      is_disable: 0,
      release_time: ''
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
      list(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.categoryData = res.data.category
          this.tagData = res.data.tag
          this.exps = res.data.exps
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 添加修改
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id)
        .then((res) => {
          this.reset(res.data)
        })
        .catch(() => {})
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          if (this.model[this.idkey]) {
            edit(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {})
          } else {
            add(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {})
          }
        } else {
          ElMessage.error('请完善必填项（带红色星号*）')
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
        try {
          this.$refs['ref'].resetFields()
          this.$refs['ref'].clearValidate()
        } catch (error) {}
      }
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 刷新
    refresh() {
      const limit = this.query.limit
      this.query = this.$options.data().query
      this.$refs['table'].clearSort()
      this.query.limit = limit
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
    // 操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds(selection).toString()
    },
    selectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    selectAlert() {
      ElMessageBox.alert('请选择需要操作的' + this.name, '提示', {
        type: 'warning',
        callback: () => {}
      })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['table'].clearSelection()
        const selectRowLen = selectRow.length
        for (let i = 0; i < selectRowLen; i++) {
          this.$refs['table'].toggleRowSelection(selectRow[i], true)
        }
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '操作'
        if (selectType === 'editcate') {
          this.selectTitle = this.name + '修改分类'
        } else if (selectType === 'edittag') {
          this.selectTitle = this.name + '修改标签'
        } else if (selectType === 'istop') {
          this.selectTitle = this.name + '是否置顶'
        } else if (selectType === 'ishot') {
          this.selectTitle = this.name + '是否热门'
        } else if (selectType === 'isrec') {
          this.selectTitle = this.name + '是否推荐'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '是否禁用'
        } else if (selectType === 'release') {
          this.selectTitle = this.name + '发布时间'
        } else if (selectType === 'dele') {
          this.selectTitle = this.name + '删除'
        }
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
        const selectType = this.selectType
        if (selectType === 'editcate') {
          this.editcate(this.selection)
        } else if (selectType === 'edittag') {
          this.edittag(this.selection)
        } else if (selectType === 'istop') {
          this.istop(this.selection, true)
        } else if (selectType === 'ishot') {
          this.ishot(this.selection, true)
        } else if (selectType === 'isrec') {
          this.isrec(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'release') {
          this.release(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 修改分类
    editcate(row) {
      editcate({
        ids: this.selectGetIds(row),
        category_ids: this.category_ids
      })
        .then((res) => {
          this.list()
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 修改标签
    edittag(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        edittag({
          ids: this.selectGetIds(row),
          tag_ids: this.tag_ids
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
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
          ids: this.selectGetIds(row),
          is_top: is_top
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
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
          ids: this.selectGetIds(row),
          is_hot: is_hot
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
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
          ids: this.selectGetIds(row),
          is_rec: is_rec
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
      }
    },
    // 是否禁用
    disable(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_disable = row[0].is_disable
        if (select) {
          is_disable = this.is_disable
        }
        disable({
          ids: this.selectGetIds(row),
          is_disable: is_disable
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
      }
    },
    // 发布时间
    release(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        release({
          ids: this.selectGetIds(row),
          release_time: this.release_time
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
      }
    },
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        dele({
          ids: this.selectGetIds(row)
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
