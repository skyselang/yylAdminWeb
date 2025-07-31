<template>
  <div class="app-container">
    <!-- 查询 -->
    <Search :name="name" :idkey="idkey" :basedata="basedata" @search="search" @reset="reset" />
    <!-- 操作 -->
    <Operate
      :name="name"
      :idkey="idkey"
      :ids="ids"
      :basedata="basedata"
      :query="query"
      @list="list"
      @add="add"
      @edit="edit"
    />
    <!-- 列表 -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :height="height"
      show-overflow-tooltip
      @sort-change="sort"
      @selection-change="select"
    >
      <el-table-column type="selection" width="42" :title="$t('全选/反选')" />
      <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
      <el-table-column prop="type_name" :label="$t('类型')" min-width="95" sortable="custom" column-key="type" />
      <el-table-column prop="file_name" :label="$t('文件')" min-width="150" sortable="custom" />
      <el-table-column
        prop="file_size_name"
        :label="$t('大小')"
        min-width="90"
        sortable="custom"
        column-key="file_size"
      />
      <el-table-column prop="status_name" :label="$t('状态')" min-width="90" sortable="custom" column-key="status" />
      <el-table-column prop="time" :label="$t('耗时(秒)')" min-width="100" sortable="custom" />
      <el-table-column prop="import_num" :label="$t('导入数')" min-width="92" sortable="custom" />
      <el-table-column prop="success_num" :label="$t('成功数')" min-width="92" sortable="custom" />
      <el-table-column prop="fail_num" :label="$t('失败数')" min-width="92" sortable="custom" />
      <el-table-column prop="remark" :label="$t('备注')" min-width="90" />
      <el-table-column prop="create_time" :label="$t('添加时间')" width="165" sortable="custom" />
      <el-table-column v-if="query.recycle" prop="delete_time" :label="$t('删除时间')" width="165" sortable="custom" />
      <el-table-column v-else prop="update_time" :label="$t('修改时间')" width="165" sortable="custom" />
      <el-table-column :label="$t('操作')" width="180">
        <template #default="{ row }">
          <ElLinkOperate v-if="hasPerm([permEdit])" :text="$t('修改')" @click="edit(row)" />
          <ElLinkOperate v-else-if="hasPerm([permInfo])" :text="$t('信息')" @click="edit(row)" />
          <ElLinkOperate v-if="hasPerm([permDele])" :text="$t('删除')" @click="dele(row)" />
          <ElLinkOperate v-if="hasPerm([permInfo])" :text="$t('下载')" @click="down(row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="mt-5 ml-3">
      <el-col :span="3">
        <el-checkbox v-model="addEditDialog" class="pr-6" :title="$t('添加修改时是弹窗还是新标签页')">
          <el-text size="default">{{ $t('弹窗') }}</el-text>
        </el-checkbox>
      </el-col>
      <el-col :span="21">
        <Pagination v-model:total="count" v-model:page="query.page" v-model:limit="query.limit" @pagination="list" />
      </el-col>
    </el-row>
    <!-- 添加修改 -->
    <el-dialog
      v-model="dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      destroy-on-close
      append-to-body
      draggable
      align-center
      center
    >
      <AddEdit :id="id" dialog @close="close" />
    </el-dialog>
    <!-- 下载 -->
    <el-dialog v-model="downDialog" :title="downTitle" top="20vh" width="35%" center>
      <el-form :model="downModel" label-width="120px">
        <el-form-item :label="$t('类型')" prop="type_name">
          <el-input v-model="downModel.type_name" disabled />
        </el-form-item>
        <el-form-item :label="$t('文件')" prop="file_name">
          <el-input v-model="downModel.file_name" disabled />
        </el-form-item>
        <el-form-item :label="$t('导入')" prop="import_num">
          <el-button v-if="downModel.import_num" @click="downFile('import')">
            {{ $t('下载导入文件') }}({{ downModel.import_num }})
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('成功')" prop="success_num">
          <el-button v-if="downModel.success_num" @click="downFile('success')">
            {{ $t('下载成功文件') }}({{ downModel.success_num }})
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('失败')" prop="fail_num">
          <el-button v-if="downModel.fail_num" @click="downFile('fail')">
            {{ $t('下载失败文件') }}({{ downModel.fail_num }})
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="downDialog = false">{{ $t('关闭') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Search from './component/Search.vue'
import Operate from './component/Operate.vue'
import AddEdit from './component/AddEdit.vue'
import { hasPerm, screenHeight, arrayColumn, getAddEditDialog } from '@/utils/index'
import { listApi, infoApi, deleApi, recycleListApi, recycleDeleApi } from '@/api/file/import'

export default {
  name: 'FileImportList',
  components: { Search, Operate, AddEdit },
  data() {
    return {
      name: '',
      height: 700,
      loading: false,
      idkey: 'import_id',
      query: { recycle: false },
      data: [],
      count: 0,
      ids: [],
      addEditDialog: getAddEditDialog(),
      id: '',
      type: 'edit',
      dialog: false,
      dialogTitle: '',
      basedata: { exps: [], types: [], statuss: [] },
      permInfo: 'admin/file.Import/info',
      permEdit: 'admin/file.Import/edit',
      permDele: 'admin/file.Import/dele',
      routeInfo: 'FileImportInfo',
      routeAdd: 'FileImportAdd',
      routeEdit: 'FileImportEdit',
      downDialog: false,
      downTitle: '',
      downModel: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('导入文件')
      this.height = screenHeight()
      this.type = hasPerm([this.permEdit]) ? 'edit' : 'info'
      this.basedata.exps = [{ exp: 'like', name: this.$t('包含') }]
    },
    // 列表
    list() {
      this.loading = true
      let api = listApi
      if (this.query.recycle) {
        api = recycleListApi
      }
      api(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.loading = false
          this.basedata.exps = res.data.basedata.exps
          this.basedata.types = res.data.basedata.types
          this.basedata.statuss = res.data.basedata.statuss
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 查询
    search(query) {
      this.query = query
      this.list()
    },
    // 重置
    reset(query) {
      try {
        this.$refs['table'].clearSort()
      } catch (error) {}
      this.query = query
      this.list()
    },
    // 排序
    sort(sort) {
      this.query.sort_field = sort.column?.columnKey ?? sort.prop
      this.query.sort_value = ''
      if (sort.order === 'ascending') {
        this.query.sort_value = 'asc'
      } else if (sort.order === 'descending') {
        this.query.sort_value = 'desc'
      }
      this.list()
    },
    // 选择
    select(rows) {
      this.ids = arrayColumn(rows, this.idkey)
    },
    // 添加
    add() {
      this.id = ''
      if (this.addEditDialog) {
        this.dialog = true
        this.dialogTitle = this.name + this.$t('添加')
      } else {
        this.$router.push({ name: this.routeAdd })
      }
    },
    // 修改
    async edit(row) {
      const route = this.type === 'edit' ? this.routeEdit : this.routeInfo
      const title = this.type === 'edit' ? this.$t('修改：') : this.$t('信息：')
      if (row) {
        this.id = row[this.idkey]
        if (this.addEditDialog) {
          this.dialog = true
          this.dialogTitle = this.name + title + this.id
        } else {
          this.$router.push({ name: route, params: { id: this.id } })
        }
      } else {
        const length = this.ids.length
        if (length) {
          if (this.addEditDialog) {
            this.id = this.ids[length - 1]
            this.dialog = true
            this.dialogTitle = this.name + title + this.id
          } else {
            for (let index = 0; index < length; index++) {
              await this.$router.push({ name: route, params: { id: this.ids[index] } })
            }
          }
        } else {
          ElMessageBox.alert(this.$t('请选择需要操作的', { name: this.name }), this.$t('提示'), {
            type: 'warning',
            center: true,
            callback: () => {}
          })
        }
      }
    },
    cancel() {
      this.dialog = false
      this.dialogTitle = ''
      this.id = ''
    },
    close() {
      this.cancel()
      this.list()
    },
    // 删除
    dele(row) {
      ElMessageBox.confirm(this.$t('确定要删除吗'), this.name + '：' + row[this.idkey], {
        type: 'warning',
        center: true
      })
        .then(() => {
          let api = deleApi
          if (this.query.recycle) {
            api = recycleDeleApi
          }
          api({ ids: [row[this.idkey]] })
            .then(() => {
              this.list()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    // 下载
    down(row) {
      this.downDialog = true
      this.downTitle = this.name + this.$t('下载') + '：' + row[this.idkey]
      this.downModel = row
    },
    downFile(file_type = 'import') {
      let file = this.downModel
      let file_name = file.file_name
      if (file_type === 'success') {
        file_name = file_name.substring(0, file_name.length - 5) + '-' + this.$t('成功') + '.xlsx'
      } else if (file_type === 'fail') {
        file_name = file_name.substring(0, file_name.length - 5) + '-' + this.$t('失败') + '.xlsx'
      }
      infoApi({ [this.idkey]: file[this.idkey], file_type: file_type, file_name: file_name }, true)
    },
    // 回收站恢复
    recycleReco(row) {
      ElMessageBox.confirm(this.$t('确定要恢复吗？'), this.name + '：' + row[this.idkey], {
        type: 'warning'
      })
        .then(() => {
          recycleRecoApi({
            ids: [row[this.idkey]]
          })
            .then((res) => {
              this.list()
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    }
  }
}
</script>
