<template>
  <el-dialog
    v-model="dialog"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="72%"
    top="9vh"
    @close="close"
  >
    <!-- 查询 -->
    <el-row>
      <el-col :span="2">
        <el-button
          v-if="hasPerm(['admin/system.Role/userLift', 'admin/system.Dept/userLift', 'admin/system.Post/userLift'])"
          type="primary"
          @click="lift()"
        >
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
      center
      top="20vh"
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
      <el-table-column prop="avatar_id" :label="$t('头像')" min-width="62">
        <template #default="{ row }">
          <FileImage :file-url="row.avatar_url" avatar lazy />
        </template>
      </el-table-column>
      <el-table-column prop="unique" :label="$t('编号')" min-width="100" sortable="custom" />
      <el-table-column prop="nickname" :label="$t('昵称')" min-width="100" sortable="custom" />
      <el-table-column prop="username" :label="$t('账号')" min-width="100" sortable="custom" />
      <el-table-column prop="dept_names" :label="$t('部门')" min-width="120" />
      <el-table-column prop="post_names" :label="$t('职位')" min-width="120" />
      <el-table-column prop="role_names" :label="$t('角色')" min-width="120" />
      <el-table-column
        prop="is_super_name"
        :label="$t('超管')"
        min-width="80"
        sortable="custom"
        column-key="is_super"
      />
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
          <ElLinkOperate
            v-if="hasPerm(['admin/system.Role/userLift', 'admin/system.Dept/userLift', 'admin/system.Post/userLift'])"
            :text="$t('解除')"
            @click="lift(row)"
          />
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
      idkey: 'user_id',
      height: 680,
      loading: false,
      dialog: false,
      dialogTitle: '',
      data: [],
      count: 0,
      query: { page: 1, limit: getPageLimit(), search: [{ field: 'nickname', exp: 'like', value: '' }] },
      ids: [],
      selectDialog: false,
      basedata: {
        exps: [],
        depts: [],
        posts: [],
        roles: [],
        deptProps: {
          value: 'dept_id',
          label: 'dept_name',
          checkStrictly: true,
          emitPath: false,
          multiple: true
        },
        postProps: {
          value: 'post_id',
          label: 'post_name',
          checkStrictly: true,
          emitPath: false,
          multiple: true
        }
      }
    }
  },
  watch: {
    id() {
      this.init()
    }
  },
  created() {
    this.name = this.$t('用户')
    this.height = screenHeight(350)
    this.basedata.exps = [{ exp: 'like', name: this.$t('包含') }]
  },
  methods: {
    hasPerm,
    init() {
      if (this.id) {
        this.dialog = true
        this.dialogTitle = this.names + this.name + '：' + this.title + ' [' + this.id + ']'
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
          this.basedata.depts = res.data.basedata.depts
          this.basedata.posts = res.data.basedata.posts
          this.basedata.roles = res.data.basedata.roles
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
