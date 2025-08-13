<template>
  <el-dialog
    v-model="dialog"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="73%"
    draggable
    align-center
    center
    @close="close"
  >
    <!-- 查询 -->
    <el-row>
      <el-col :span="2">
        <el-button v-if="hasPerm(['admin/system.Menu/roleLift'])" type="primary" @click="lift()">
          {{ $t('解除') }}
        </el-button>
      </el-col>
      <el-col :span="22">
        <Search :name="name" :idkey="idkey" :basedata="basedata" @search="search" @reset="reset" />
      </el-col>
    </el-row>
    <!-- 解除 -->
    <el-dialog
      v-model="selectDialog"
      :title="names + name + '：' + $t('解除')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      draggable
      align-center
      center
    >
      <el-scrollbar :height="height - 200">
        <el-form label-width="120px">
          <el-form-item label="ID">
            <el-col>
              <el-text size="default">{{ ids.toString() }}</el-text>
            </el-col>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button :loading="loading" @click="cancel">{{ $t('取消') }}</el-button>
        <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
      </template>
    </el-dialog>
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
      <el-table-column prop="role_unique" :label="$t('编号')" min-width="120" sortable="custom" />
      <el-table-column prop="role_name" :label="$t('名称')" min-width="130" sortable="custom" />
      <el-table-column prop="desc" :label="$t('描述')" min-width="150" />
      <el-table-column prop="remark" :label="$t('备注')" min-width="130" />
      <el-table-column prop="sort" :label="$t('排序')" min-width="80" sortable="custom" />
      <el-table-column
        prop="is_disable_name"
        :label="$t('禁用')"
        min-width="80"
        sortable="custom"
        column-key="is_disable"
      />
      <el-table-column :label="$t('操作')" min-width="80">
        <template #default="{ row }">
          <ElLinkOperate v-if="hasPerm(['admin/system.Menu/roleLift'])" :text="$t('解除')" @click="lift(row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:total="count" v-model:page="query.page" v-model:limit="query.limit" @pagination="list" />
  </el-dialog>
</template>

<script>
import Search from './Search.vue'
import { hasPerm, screenHeight, arrayColumn, getPageLimit } from '@/utils/index'

export default {
  components: { Search },
  props: {
    names: {
      type: String,
      default: ''
    },
    idPk: {
      type: String,
      default: ''
    },
    id: {
      type: [Number, String],
      default: 0
    },
    titlePk: {
      type: String,
      default: ''
    },
    title: {
      type: [Number, String],
      default: ''
    },
    listApi: {
      type: Function,
      default() {
        return {}
      }
    },
    liftApi: {
      type: Function,
      default() {
        return {}
      }
    }
  },
  emits: ['close'],
  data() {
    return {
      name: '',
      idkey: 'role_id',
      height: 680,
      loading: false,
      dialog: false,
      dialogTitle: '',
      data: [],
      count: 0,
      query: { page: 1, limit: getPageLimit(), search: [{ field: 'role_name', exp: 'like', value: '' }] },
      ids: [],
      selectDialog: false,
      basedata: {
        exps: [],
        menus: [],
        menu_ids: []
      }
    }
  },
  watch: {
    id() {
      this.init()
    }
  },
  created() {
    this.name = this.$t('角色')
    this.height = screenHeight(350)
    this.basedata.exps = [{ exp: 'like', name: this.$t('包含') }]
  },
  methods: {
    hasPerm,
    init() {
      if (this.id) {
        this.dialog = true
        this.dialogTitle = this.names + this.name + '：' + '[' + this.id + '] ' + this.title
        this.reset()
      } else {
        this.dialog = false
      }
      this.ids = []
    },
    // 列表
    list() {
      this.loading = true
      this.query[this.idPk] = this.id
      this.listApi(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.loading = false
          this.basedata.exps = res.data.basedata.exps
          this.basedata.menus = res.data.basedata.menus
          this.basedata.menu_ids = res.data.basedata.menu_ids
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 查询
    search(query) {
      if (query) {
        this.query = query
      } else {
        this.query.page = 1
      }
      this.list()
    },
    // 重置
    reset(query) {
      if (query) {
        this.query = query
      } else {
        const limit = this.query.limit
        this.query = this.$options.data().query
        this.query.limit = limit
      }
      try {
        this.$refs['table'].clearSort()
      } catch (error) {}
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
    // 解除
    lift(row = '') {
      if (row) {
        this.ids = [row[this.idkey]]
        try {
          this.$refs['table'].clearSelection()
          this.$refs['table'].toggleRowSelection(row, true)
        } catch (error) {}
      }
      if (this.ids.length <= 0) {
        ElMessageBox.alert(this.$t('请选择需要操作的', { name: this.name }), this.$t('提示'), {
          type: 'warning',
          center: true,
          callback: () => {}
        })
      } else {
        this.selectDialog = true
      }
    },
    cancel() {
      this.selectDialog = false
    },
    submit() {
      this.liftApi({
        [this.idPk]: this.id,
        user_ids: this.ids
      })
        .then((res) => {
          this.selectDialog = false
          ElMessage.success(res.msg)
          this.list()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 关闭
    close() {
      this.$emit('close', { [this.idPk]: '', [this.titlePk]: '' })
    }
  }
}
</script>
