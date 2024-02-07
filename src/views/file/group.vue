<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-row>
      <el-col class="mb-2">
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="查询字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="group_name" label="名称" />
          <el-option value="group_desc" label="描述" />
          <el-option value="remark" label="备注" />
          <el-option value="is_disable" label="禁用" />
        </el-select>
        <el-select v-model="query.search_exp" class="ya-search-exp">
          <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
        </el-select>
        <el-select
          v-if="query.search_field === 'is_disable'"
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
          placeholder="搜索文件"
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
        <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
        <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
        <el-button title="解除文件" @click="selectOpen('removef')">解除文件</el-button>
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
        <el-form-item v-if="selectType === 'removef'">
          <span style="">确定要解除选中的{{ name }}的文件吗？</span>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'disable'" label="是否禁用">
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
        <el-button @click="selectCancel">取消</el-button>
        <el-button type="primary" @click="selectSubmit">提交</el-button>
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
      <el-table-column prop="group_name" label="名称" min-width="130" show-overflow-tooltip />
      <el-table-column prop="group_desc" label="描述" min-width="160" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
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
      <el-table-column prop="sort" label="排序" min-width="85" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" width="165" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" width="165" sortable="custom" />
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <el-link type="primary" class="mr-1" :underline="false" @click="fileShow(scope.row)"
            >文件</el-link
          >
          <el-link type="primary" class="mr-1" :underline="false" @click="edit(scope.row)"
            >修改</el-link
          >
          <el-link type="primary" :underline="false" @click="selectOpen('dele', [scope.row])"
            >删除</el-link
          >
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
      <el-scrollbar native :height="height - 30">
        <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
          <el-form-item label="名称" prop="group_name">
            <el-input v-model="model.group_name" placeholder="请输入名称" clearable />
          </el-form-item>
          <el-form-item label="描述" prop="group_desc">
            <el-input
              v-model="model.group_desc"
              type="textarea"
              autosize
              placeholder="请输入描述"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="model.remark" placeholder="请输入备注" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="model.sort" type="number" />
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
    <!-- 分组文件 -->
    <el-dialog
      v-model="fileDialog"
      :title="fileDialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="5vh"
      width="70%"
    >
      <!-- 分组文件操作 -->
      <el-row>
        <el-col>
          <el-button type="primary" title="解除" @click="fileSelectOpen('fileRemove')">
            解除
          </el-button>
          <el-input
            v-model="fileQuery.search_value"
            class="ya-search-value"
            placeholder="名称"
            clearable
          />
          <el-button type="primary" @click="file()">查询</el-button>
        </el-col>
      </el-row>
      <!-- 分组文件列表 -->
      <el-table
        ref="fileRef"
        v-loading="fileLoad"
        :data="fileData"
        :height="height - 50"
        @sort-change="fileSort"
        @selection-change="fileSelect"
      >
        <el-table-column type="selection" width="42" title="全选/反选" />
        <el-table-column :prop="filePk" label="ID" width="80" sortable="custom" />
        <el-table-column prop="file_url" label="文件" min-width="90">
          <template #default="scope">
            <FilePreview :file="scope.row" lazy />
          </template>
        </el-table-column>
        <el-table-column prop="file_type_name" label="类型" min-width="85" sortable="custom" />
        <el-table-column
          prop="file_name"
          label="名称"
          min-width="120"
          sortable="custom"
          show-overflow-tooltip
        />
        <el-table-column prop="file_ext" label="后缀" min-width="85" sortable="custom" />
        <el-table-column
          prop="file_size"
          label="大小"
          min-width="85"
          sortable="custom"
          show-overflow-tooltip
        />
        <el-table-column prop="group_name" label="分组" min-width="120" show-overflow-tooltip />
        <el-table-column prop="tag_names" label="标签" min-width="130" show-overflow-tooltip />
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
        <el-table-column prop="sort" label="排序" min-width="85" sortable="custom" />
        <el-table-column label="操作" min-width="70">
          <template #default="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="fileSelectOpen('fileRemove', scope.row)"
            >
              解除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分组文件分页 -->
      <pagination
        v-show="fileCount > 0"
        v-model:total="fileCount"
        v-model:page="fileQuery.page"
        v-model:limit="fileQuery.limit"
        @pagination="file"
      />
    </el-dialog>
    <!-- 分组文件操作 -->
    <el-dialog
      v-model="fileSelectDialog"
      :title="fileSelectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
      append-to-body
    >
      <el-form ref="fileSelectRef" label-width="120px">
        <el-form-item v-if="fileSelectType === 'fileRemove'" label="分组ID">
          <span>{{ fileQuery[idkey] }}</span>
        </el-form-item>
        <el-form-item :label="fileName + 'ID'">
          <el-input v-model="fileSelectIds" type="textarea" autosize disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="fileSelectCancel">取消</el-button>
        <el-button type="primary" @click="fileSelectSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import { arrayColumn } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import { list, info, add, edit, dele, disable, file, fileRemove } from '@/api/file/group'

export default {
  name: 'FileGroup',
  components: { Pagination },
  data() {
    return {
      name: '文件分组',
      height: 680,
      loading: false,
      idkey: 'group_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'group_name',
        search_exp: 'like',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        group_id: '',
        group_name: '',
        group_desc: '',
        remark: '',
        sort: 250
      },
      rules: {
        group_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      selection: [],
      selectIds: '',
      selectTitle: '操作',
      selectDialog: false,
      selectType: '',
      is_disable: 0,
      filePk: 'file_id',
      fileName: '文件',
      fileDialog: false,
      fileDialogTitle: '',
      fileLoad: false,
      fileData: [],
      fileCount: 0,
      fileQuery: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'file_name',
        search_exp: 'like',
        search_value: ''
      },
      fileSelection: [],
      fileSelectIds: '',
      fileSelectTitle: '操作',
      fileSelectDialog: false,
      fileSelectType: ''
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
        if (selectType === 'removef') {
          this.selectTitle = this.name + '解除文件'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '禁用'
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
        if (selectType === 'removef') {
          this.removef(this.selection)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection, true)
        }
        this.selectDialog = false
      }
    },
    // 解除文件
    removef(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        fileRemove({
          group_id: this.selectGetIds(row),
          file_ids: []
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
    },
    // 分组文件显示
    fileShow(row) {
      this.fileDialog = true
      this.fileDialogTitle = this.name + '文件：' + row.group_name
      this.fileQuery.group_id = row.group_id
      this.fileQuery.search_value = ''
      this.file()
    },
    // 分组文件列表
    file() {
      this.fileLoad = true
      file(this.fileQuery)
        .then((res) => {
          this.fileData = res.data.list
          this.fileCount = res.data.count
          this.fileLoad = false
        })
        .catch(() => {
          this.fileLoad = false
        })
    },
    // 分组文件排序
    fileSort(sort) {
      this.fileQuery.sort_field = sort.prop
      this.fileQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.fileQuery.sort_value = 'asc'
        this.file()
      }
      if (sort.order === 'descending') {
        this.fileQuery.sort_value = 'desc'
        this.file()
      }
    },
    // 分组文件操作
    fileSelect(selection) {
      this.fileSelection = selection
      this.fileSelectIds = this.fileSelectGetIds(selection).toString()
    },
    fileSelectGetIds(selection) {
      return arrayColumn(selection, this.filePk)
    },
    fileSelectAlert() {
      ElMessageBox.alert('请选择需要操作的' + this.fileName, '提示', {
        type: 'warning',
        callback: () => {}
      })
    },
    fileSelectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['fileRef'].clearSelection()
        this.$refs['fileRef'].toggleRowSelection(selectRow)
      }
      if (!this.fileSelection.length) {
        this.fileSelectAlert()
      } else {
        this.fileSelectTitle = '操作'
        if (selectType === 'fileRemove') {
          this.fileSelectTitle = '解除分组'
        }
        this.fileSelectDialog = true
        this.fileSelectType = selectType
      }
    },
    fileSelectCancel() {
      this.fileSelectDialog = false
    },
    fileSelectSubmit() {
      if (!this.fileSelection.length) {
        this.fileSelectAlert()
      } else {
        const selectType = this.fileSelectType
        if (selectType === 'fileRemove') {
          this.fileRemove(this.fileSelection)
        }
        this.fileSelectDialog = false
      }
    },
    // 分组文件解除
    fileRemove(row) {
      if (!row.length) {
        this.fileSelectAlert()
      } else {
        this.fileLoad = true
        fileRemove({
          group_id: this.fileQuery.group_id,
          file_ids: this.fileSelectGetIds(row)
        })
          .then((res) => {
            this.file()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.fileLoad = false
          })
      }
    }
  }
}
</script>
