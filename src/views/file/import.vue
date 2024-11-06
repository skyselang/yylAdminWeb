<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-row>
      <el-col class="mb-2">
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="查询字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="type" label="类型" />
          <el-option value="file_name" label="文件" />
          <el-option value="status" label="状态" />
          <el-option value="remark" label="备注" />
        </el-select>
        <el-select v-model="query.search_exp" class="ya-search-exp">
          <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
        </el-select>
        <el-select v-if="query.search_field === 'type'" v-model="query.search_value" class="ya-search-value" clearable>
          <el-option v-for="(item, index) in types" :key="index" :label="item" :value="index" />
        </el-select>
        <el-select
          v-else-if="query.search_field === 'status'"
          v-model="query.search_value"
          class="ya-search-value"
          clearable
        >
          <el-option v-for="(item, index) in statuss" :key="index" :label="item" :value="index" />
        </el-select>
        <el-input v-else v-model="query.search_value" class="ya-search-value" placeholder="查询内容" clearable />
        <el-select v-model="query.date_field" class="ya-date-field" placeholder="时间类型">
          <el-option value="create_time" label="提交时间" />
          <el-option value="update_time" label="修改时间" />
          <el-option v-if="recycle" value="delete_time" label="删除时间" />
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
        <el-button type="primary" title="查询/刷新" @click="search()">查询</el-button>
        <el-button type="default" title="重置查询条件" @click="refresh()">重置</el-button>
        <el-button
          v-if="checkPermission(['admin/file.Import/recycleList'])"
          :type="recycle ? 'primary' : 'default'"
          @click="recycleShow"
        >
          回收站
        </el-button>
      </el-col>
    </el-row>
    <!-- 操作 -->
    <el-row>
      <el-col>
        <el-button title="删除文件" @click="selectOpen('dele')">删除</el-button>
        <el-button v-if="recycle" @click="selectOpen('reco')">恢复</el-button>
      </el-col>
    </el-row>
    <el-dialog
      v-model="selectDialog"
      :title="selectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
      append-to-body
    >
      <el-form label-width="120px">
        <el-form-item v-if="selectType === 'dele'" label="删除">
          <el-text v-if="recycle" type="danger"> 确定要删除选中的 {{ name }} 吗？删除后不可恢复！ </el-text>
          <el-text v-else>确定要删除选中的 {{ name }} 吗？</el-text>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'reco'" label="恢复">
          <el-text>确定要恢复选中的 {{ name }} 吗？</el-text>
        </el-form-item>
        <el-form-item :label="name + 'ID'">
          <el-input v-model="selectIds" type="textarea" :rows="12" disabled />
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
      <el-table-column :prop="idkey" label="ID" min-width="80" sortable="custom" />
      <el-table-column prop="type_name" label="类型" min-width="95" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="file_name" label="文件" min-width="150" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="file_size" label="大小" min-width="90" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="status_name" label="状态" min-width="90" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="times" label="耗时(s)" min-width="95" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="import_num" label="导入数" min-width="92" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="success_num" label="成功数" min-width="92" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="fail_num" label="失败数" min-width="92" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" min-width="90" show-overflow-tooltip />
      <el-table-column prop="create_name" label="提交人" min-width="95" show-overflow-tooltip />
      <el-table-column prop="create_time" label="提交时间" width="165" sortable="custom" />
      <el-table-column v-if="recycle" prop="delete_time" label="删除时间" width="165" sortable="custom" />
      <el-table-column v-else prop="update_time" label="修改时间" width="165" sortable="custom" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-link type="primary" class="mr-1" :underline="false" @click="downShow(scope.row)"> 下载 </el-link>
          <el-link type="primary" class="mr-1" :underline="false" @click="edit(scope.row)"> 修改 </el-link>
          <el-link type="primary" class="mr-1" :underline="false" @click="selectOpen('dele', [scope.row])">
            删除
          </el-link>
          <el-link v-if="recycle" type="primary" :underline="false" @click="selectOpen('reco', [scope.row])">
            恢复
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
    <!-- 修改 -->
    <el-dialog
      v-model="dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      top="5vh"
      append-to-body
    >
      <el-scrollbar native :height="height - 30">
        <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
          <el-form-item label="类型" prop="type_name">
            <el-input v-model="model.type_name" disabled />
          </el-form-item>
          <el-form-item label="文件" prop="file_name">
            <el-input v-model="model.file_name" clearable disabled />
          </el-form-item>
          <el-form-item label="大小" prop="file_size">
            <el-input v-model="model.file_size" disabled />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="model.remark" placeholder="请输入备注" clearable />
          </el-form-item>
          <el-form-item label="状态" prop="status_name">
            <el-input v-model="model.status_name" disabled />
          </el-form-item>
          <el-form-item label="耗时(s)" prop="times">
            <el-input v-model="model.times" disabled />
          </el-form-item>
          <el-form-item label="导入数" prop="import_num">
            <el-input v-model="model.import_num" disabled />
          </el-form-item>
          <el-form-item label="成功数" prop="success_num">
            <el-input v-model="model.success_num" disabled />
          </el-form-item>
          <el-form-item label="失败数" prop="fail_num">
            <el-input v-model="model.fail_num" disabled />
          </el-form-item>
          <el-form-item label="提交人" prop="create_name">
            <el-input v-model="model.create_name" disabled />
          </el-form-item>
          <el-form-item label="提交时间" prop="create_time">
            <el-input v-model="model.create_time" disabled />
          </el-form-item>
          <el-form-item label="修改时间" prop="update_time">
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
    <!-- 下载 -->
    <el-dialog v-model="downDialog" :title="downTitle" top="30vh" width="35%">
      <el-button v-if="downModel.import_num" @click="downFile(downModel, 'import')">
        下载导入文件({{ downModel.import_num }})
      </el-button>
      <el-button v-if="downModel.success_num" @click="downFile(downModel, 'success')">
        下载成功文件({{ downModel.success_num }})
      </el-button>
      <el-button v-if="downModel.fail_num" @click="downFile(downModel, 'fail')">
        下载失败文件({{ downModel.fail_num }})
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import { arrayColumn, clipboard } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import { list, info, edit, dele, recycleList, recycleReco, recycleDele } from '@/api/file/import'

export default {
  name: 'FileImport',
  components: { Pagination },
  data() {
    return {
      name: '导入文件',
      recycle: 0, // 是否回收站
      height: 680,
      loading: false,
      idkey: 'import_id',
      exps: [],
      types: [],
      ways: [],
      statuss: [],
      date_start: '',
      date_end: '',
      query: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'remark',
        search_exp: 'like',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        import_id: '',
        type: 0,
        file_name: '',
        file_path: '',
        file_size: '',
        file_url: '',
        status: 0,
        times: 0,
        import_num: 0,
        success_num: 0,
        fail_num: 0,
        remark: ''
      },
      rules: {
        file_name: [{ required: true, message: '请输入文件', trigger: 'blur' }]
      },
      selection: [],
      selectIds: '',
      selectTitle: '操作',
      selectDialog: false,
      selectType: '',
      downDialog: false,
      downTitle: '',
      downModel: {}
    }
  },
  created() {
    this.height = screenHeight()
    this.list()
  },
  methods: {
    checkPermission,
    clipboard,
    // 列表
    list() {
      this.loading = true
      if (this.recycle) {
        recycleList(this.query)
          .then((res) => {
            this.listData(res.data)
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        list(this.query)
          .then((res) => {
            this.listData(res.data)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    listData(data) {
      this.data = data.list
      this.count = data.count
      this.exps = data.exps
      this.types = data.types
      this.ways = data.ways
      this.statuss = data.statuss
      this.loading = false
    },
    // 修改
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      info({
        [this.idkey]: row[this.idkey]
      })
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
          edit(this.model)
            .then((res) => {
              this.list()
              this.reset()
              this.dialog = false
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 重置查询
    refresh() {
      const limit = this.query.limit
      this.query = this.$options.data().query
      this.query.limit = limit
      this.reset()
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
    // 重置
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      this.selection = []
      this.selectIds = ''
      this.$refs['table'].clearSelection()
      this.$refs['table'].clearSort()
      if (this.$refs['ref'] !== undefined) {
        try {
          this.$refs['ref'].resetFields()
        } catch (error) {}
      }
    },
    // 回收站
    recycleShow() {
      this.recycle = !this.recycle
      this.list()
    },
    // 选择操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds().toString()
    },
    selectGetIds() {
      return arrayColumn(this.selection, this.idkey)
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
        if (selectType === 'dele') {
          this.selectTitle = this.name + '删除'
        } else if (selectType === 'reco') {
          this.selectTitle = this.name + '恢复'
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
        if (selectType === 'dele') {
          this.dele()
        } else if (selectType === 'reco') {
          this.reco()
        }
        this.selectDialog = false
      }
    },
    // 删除
    dele() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        if (this.recycle) {
          recycleDele({
            ids: this.selectGetIds()
          })
            .then((res) => {
              this.list()
              this.reset()
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          dele({
            ids: this.selectGetIds()
          })
            .then((res) => {
              this.list()
              this.reset()
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      }
    },
    // 恢复
    reco() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        recycleReco({
          ids: this.selectGetIds()
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
    // 下载
    downShow(row) {
      this.downDialog = true
      this.downTitle = this.name + '下载' + '：' + row[this.idkey]
      this.downModel = row
    },
    downFile(file, file_type = 'import') {
      let file_name = file.file_name
      if (file_type === 'success') {
        file_name = file_name.substring(0, file_name.length - 5) + '-成功.xlsx'
      } else if (file_type === 'fail') {
        file_name = file_name.substring(0, file_name.length - 5) + '-失败.xlsx'
      }
      info(
        {
          [this.idkey]: file[this.idkey],
          is_down: 1,
          file_type: file_type,
          file_name: file_name
        },
        true
      )
    }
  }
}
</script>
