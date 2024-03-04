<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-row>
      <el-col class="mb-2">
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="查询字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="category_unique" label="标识" />
          <el-option value="category_name" label="名称" />
          <el-option value="category_pid" label="上级" />
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
          v-if="query.search_field === 'category_pid'"
          v-model="query.search_value"
          :options="trees"
          :props="props"
          class="ya-search-value"
          clearable
          filterable
        />
        <el-select
          v-else-if="query.search_field === 'is_disable'"
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
        <el-checkbox
          border
          v-model="isExpandAll"
          class="!mr-[10px] top-[3px]"
          title="收起/展开"
          @change="expandAll"
        >
          收起
        </el-checkbox>
        <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
        <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
        <el-button title="修改上级" @click="selectOpen('editpid')">上级</el-button>
        <el-button title="解除内容" @click="selectOpen('removec')">解除内容</el-button>
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
        <el-form-item v-if="selectType === 'removec'">
          <span style="">确定要解除选中的{{ name }}的内容吗？</span>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'editpid'" label="上级">
          <el-cascader
            v-model="category_pid"
            :options="trees"
            :props="props"
            class="w-full"
            placeholder="一级分类"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item v-if="selectType === 'disable'" label="是否禁用">
          <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
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
      :row-key="idkey"
      default-expand-all
      @selection-change="select"
    >
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="category_name" label="名称" min-width="250" show-overflow-tooltip />
      <el-table-column prop="image_url" label="图片" min-width="62">
        <template #default="scope">
          <FileImage :file-url="scope.row.image_url" lazy />
        </template>
      </el-table-column>
      <el-table-column prop="category_unique" label="标识" min-width="100" show-overflow-tooltip />
      <el-table-column :prop="idkey" label="ID" min-width="80" />
      <el-table-column prop="is_disable" label="禁用" min-width="85">
        <template #default="scope">
          <el-switch
            v-model="scope.row.is_disable"
            :active-value="1"
            :inactive-value="0"
            @change="disable([scope.row])"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="85" />
      <el-table-column prop="create_time" label="添加时间" width="165" />
      <el-table-column prop="update_time" label="修改时间" width="165" />
      <el-table-column label="操作" width="170">
        <template #default="scope">
          <el-link type="primary" class="mr-1" :underline="false" @click="contentShow(scope.row)">
            内容
          </el-link>
          <el-link
            type="primary"
            class="mr-1"
            :underline="false"
            title="添加下级"
            @click="add(scope.row)"
          >
            添加
          </el-link>
          <el-link type="primary" class="mr-1" :underline="false" @click="edit(scope.row)">
            修改
          </el-link>
          <el-link type="primary" :underline="false" @click="selectOpen('dele', [scope.row])">
            删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-descriptions title="" :column="12" :colon="false">
        <el-descriptions-item>共 {{ count }} 条</el-descriptions-item>
      </el-descriptions>
    </el-row>
    <!-- 添加修改 -->
    <el-dialog
      v-model="dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      top="5vh"
      destroy-on-close
    >
      <el-scrollbar native :height="height - 50">
        <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
          <el-form-item label="标识" prop="category_unique">
            <el-input
              v-model="model.category_unique"
              placeholder="请输入分类标识（唯一）"
              clearable
            />
          </el-form-item>
          <el-form-item label="上级" prop="category_pid">
            <el-cascader
              v-model="model.category_pid"
              :options="trees"
              :props="props"
              class="w-full"
              placeholder="一级分类"
              clearable
              filterable
            />
          </el-form-item>
          <el-form-item label="名称" prop="category_name">
            <el-input v-model="model.category_name" placeholder="请输入分类名称" clearable />
          </el-form-item>
          <el-form-item label="图片" prop="image_id">
            <FileImage v-model="model.image_id" :file-url="model.image_url" :height="100" upload />
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
          <el-form-item label="备注" prop="remark">
            <el-input v-model="model.remark" placeholder="remark" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="model.sort" placeholder="250" clearable />
          </el-form-item>
          <el-form-item label="图片列表" prop="images">
            <FileUploads
              v-model="model.images"
              upload-btn="上传图片"
              file-type="image"
              file-tip="图片文件"
            />
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
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </template>
    </el-dialog>
    <!-- 分类内容 -->
    <el-dialog
      v-model="contentDialog"
      :title="contentDialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="5vh"
      width="70%"
    >
      <!-- 分类内容操作 -->
      <el-row>
        <el-col>
          <el-button type="primary" title="解除" @click="contentSelectOpen('contentRemove')">
            解除
          </el-button>
          <el-input
            v-model="contentQuery.search_value"
            class="ya-search-value"
            placeholder="名称"
            clearable
          />
          <el-button type="primary" @click="content()">查询</el-button>
        </el-col>
      </el-row>
      <!-- 分类内容列表 -->
      <el-table
        ref="contentRef"
        v-loading="contentLoad"
        :data="contentData"
        :height="height - 60"
        @sort-change="contentSort"
        @selection-change="contentSelect"
      >
        <el-table-column type="selection" width="42" title="全选/反选" />
        <el-table-column :prop="contentPk" label="内容ID" min-width="100" sortable="custom" />
        <el-table-column prop="image_url" label="图片" min-width="62">
          <template #default="scope">
            <FileImage :file-url="scope.row.image_url" lazy />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="230" show-overflow-tooltip />
        <el-table-column prop="unique" label="标识" min-width="80" show-overflow-tooltip />
        <el-table-column prop="category_names" label="分类" min-width="120" show-overflow-tooltip />
        <el-table-column prop="tag_names" label="标签" min-width="120" show-overflow-tooltip />
        <el-table-column prop="is_top" label="置顶" min-width="85" sortable="custom">
          <template #default="scope">
            <el-switch v-model="scope.row.is_top" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_hot" label="热门" min-width="85" sortable="custom">
          <template #default="scope">
            <el-switch v-model="scope.row.is_hot" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_rec" label="推荐" min-width="85" sortable="custom">
          <template #default="scope">
            <el-switch v-model="scope.row.is_rec" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_disable" label="禁用" min-width="85" sortable="custom">
          <template #default="scope">
            <el-switch
              v-model="scope.row.is_disable"
              :active-value="1"
              :inactive-value="0"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="70">
          <template #default="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="contentSelectOpen('contentRemove', scope.row)"
            >
              解除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分类内容分页 -->
      <pagination
        v-show="contentCount > 0"
        v-model:total="contentCount"
        v-model:page="contentQuery.page"
        v-model:limit="contentQuery.limit"
        @pagination="content"
      />
    </el-dialog>
    <el-dialog
      v-model="contentSelectDialog"
      :title="contentSelectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
    >
      <el-form ref="contentSelectRef" label-width="120px">
        <el-form-item v-if="contentSelectType === 'contentRemove'" label="分类ID">
          <span>{{ contentQuery[idkey] }}</span>
        </el-form-item>
        <el-form-item :label="contentName + 'ID'">
          <el-input v-model="contentSelectIds" type="textarea" autosize disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="contentSelectCancel">取消</el-button>
        <el-button type="primary" @click="contentSelectSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import { arrayColumn } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import {
  list,
  info,
  add,
  edit,
  dele,
  editpid,
  disable,
  content,
  contentRemove
} from '@/api/content/category'

export default {
  name: 'ContentCategory',
  components: { Pagination },
  data() {
    return {
      name: '内容分类',
      height: 680,
      loading: false,
      idkey: 'category_id',
      query: { search_field: 'category_name', search_exp: 'like', date_field: 'create_time' },
      exps: [{ exp: 'like', name: '包含' }],
      data: [],
      count: '',
      dialog: false,
      dialogTitle: '',
      model: {
        category_id: '',
        category_unique: '',
        category_pid: 0,
        category_name: '',
        image_id: 0,
        image_url: '',
        title: '',
        keywords: '',
        description: '',
        remark: '',
        sort: 250,
        images: []
      },
      rules: {
        category_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      trees: [],
      props: { checkStrictly: true, value: 'category_id', label: 'category_name', emitPath: false },
      isExpandAll: false,
      selection: [],
      selectIds: '',
      selectTitle: '操作',
      selectDialog: false,
      selectType: '',
      category_pid: '',
      is_disable: 0,
      contentPk: 'content_id',
      contentName: '内容',
      contentDialog: false,
      contentDialogTitle: '',
      contentLoad: false,
      contentData: [],
      contentCount: 0,
      contentQuery: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'name',
        search_exp: 'like',
        search_value: ''
      },
      contentSelection: [],
      contentSelectIds: '',
      contentSelectTitle: '操作',
      contentSelectDialog: false,
      contentSelectType: ''
    }
  },
  created() {
    this.height = screenHeight(290)
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query)
        .then((res) => {
          this.data = res.data.list
          this.trees = res.data.tree
          this.exps = res.data.exps
          this.count = res.data.count
          this.isExpandAll = false
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 添加修改
    add(row) {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
      if (row) {
        this.model.category_pid = row[this.idkey]
      }
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
          this.loading = true
          if (this.model[this.idkey]) {
            edit(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            add(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
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
        try {
          this.$refs['ref'].resetFields()
          this.$refs['ref'].clearValidate()
        } catch (error) {}
      }
    },
    search() {
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
    // 收起/展开
    expandAll(e) {
      this.expandFor(this.data, !e)
    },
    expandFor(data, isExpand) {
      data.forEach((i) => {
        this.$refs.table.toggleRowExpansion(i, isExpand)
        if (i.children) {
          this.expandFor(i.children, isExpand)
        }
      })
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
        if (selectType === 'removec') {
          this.selectTitle = this.name + '解除内容'
        } else if (selectType === 'editpid') {
          this.selectTitle = this.name + '修改上级'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '是否禁用'
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
        if (selectType === 'removec') {
          this.removec(this.selection)
        } else if (selectType === 'editpid') {
          this.editpid(this.selection)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 解除内容
    removec(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        contentRemove({
          category_id: this.selectGetIds(row),
          content_ids: []
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
    // 修改上级
    editpid(row) {
      editpid({
        ids: this.selectGetIds(row),
        category_pid: this.category_pid
      })
        .then((res) => {
          this.list()
          this.selectDialog = false
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 是否禁用
    disable(row, select = false) {
      if (row.length === 0) {
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
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
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
    },
    // 分类内容显示
    contentShow(row) {
      this.contentDialog = true
      this.contentDialogTitle = this.name + '内容：' + row.category_name
      this.contentQuery.category_id = row.category_id
      this.contentQuery.search_value = ''
      this.content()
    },
    // 分类内容列表
    content() {
      this.contentLoad = true
      content(this.contentQuery)
        .then((res) => {
          this.contentData = res.data.list
          this.contentCount = res.data.count
          this.contentLoad = false
        })
        .catch(() => {
          this.contentLoad = false
        })
    },
    // 分类内容排序
    contentSort(sort) {
      this.contentQuery.sort_field = sort.prop
      this.contentQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.contentQuery.sort_value = 'asc'
        this.content()
      }
      if (sort.order === 'descending') {
        this.contentQuery.sort_value = 'desc'
        this.content()
      }
    },
    // 分类内容操作
    contentSelect(selection) {
      this.contentSelection = selection
      this.contentSelectIds = this.contentSelectGetIds(selection).toString()
    },
    contentSelectGetIds(selection) {
      return arrayColumn(selection, this.contentPk)
    },
    contentSelectAlert() {
      ElMessageBox.alert('请选择需要操作的' + this.contentName, '提示', {
        type: 'warning',
        callback: () => {}
      })
    },
    contentSelectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['contentRef'].clearSelection()
        this.$refs['contentRef'].toggleRowSelection(selectRow)
      }
      if (!this.contentSelection.length) {
        this.contentSelectAlert()
      } else {
        this.contentSelectTitle = '操作'
        if (selectType === 'contentRemove') {
          this.contentSelectTitle = this.name + '解除' + this.contentName
        }
        this.contentSelectDialog = true
        this.contentSelectType = selectType
      }
    },
    contentSelectCancel() {
      this.contentSelectDialog = false
    },
    contentSelectSubmit() {
      if (!this.contentSelection.length) {
        this.contentSelectAlert()
      } else {
        const selectType = this.contentSelectType
        if (selectType === 'contentRemove') {
          this.contentRemove(this.contentSelection)
        }
        this.contentSelectDialog = false
      }
    },
    // 分类内容解除内容
    contentRemove(row) {
      if (!row.length) {
        this.contentSelectAlert()
      } else {
        this.contentLoad = true
        contentRemove({
          category_id: this.contentQuery.category_id,
          content_ids: this.contentSelectGetIds(row)
        })
          .then((res) => {
            this.content()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.contentLoad = false
          })
      }
    }
  }
}
</script>
