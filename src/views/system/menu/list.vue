<template>
  <div class="app-container">
    <!-- 查询 -->
    <Search :name="name" :idkey="idkey" :basedata="basedata" @search="search" @reset="reset" />
    <!-- 操作 -->
    <Operate :name="name" :ids="ids" :basedata="basedata" :query="query" @list="list" @add="add" @edit="edit" />
    <!-- 列表 -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :height="height"
      :row-key="idkey"
      :tree-props="props"
      default-expand-all
      show-overflow-tooltip
      @sort-change="sort"
      @selection-change="select"
    >
      <el-table-column type="selection" width="42" :title="$t('全选/反选')" />
      <el-table-column prop="menu_name" :label="$t('菜单名称')" min-width="210" sortable="custom" />
      <el-table-column :prop="idkey" label="ID" min-width="60" sortable="custom" />
      <el-table-column prop="meta_icon" :label="$t('图标')" min-width="60">
        <template #default="{ row }">
          <Icons v-if="row.meta_icon" :icon="row.meta_icon" />
        </template>
      </el-table-column>
      <el-table-column prop="menu_url" :label="$t('菜单链接(权限标识)')" min-width="230" sortable="custom" />
      <el-table-column prop="path" :label="$t('路由地址')" min-width="100" />
      <el-table-column prop="name" :label="$t('路由名称')" min-width="150" sortable="custom" />
      <el-table-column prop="component" :label="$t('组件路径')" min-width="150" sortable="custom" />
      <el-table-column prop="menu_type_name" :label="$t('类型')" min-width="55" />
      <el-table-column prop="is_unlogin_name" :label="$t('免登')" min-width="55" />
      <el-table-column prop="is_unauth_name" :label="$t('免权')" min-width="55" />
      <el-table-column prop="is_unrate_name" :label="$t('免限')" min-width="55" />
      <el-table-column prop="hidden_name" :label="$t('隐藏')" min-width="55" />
      <el-table-column prop="is_disable_name" :label="$t('禁用')" min-width="55" />
      <el-table-column prop="sort" :label="$t('排序')" min-width="55" />
      <el-table-column :label="$t('操作')" width="180">
        <template #default="{ row }">
          <ElLinkOperate v-if="hasPerm([permAdd])" :text="$t('添加')" @click="add(row)" />
          <ElLinkOperate v-if="hasPerm([permEdit])" :text="$t('修改')" @click="edit(row)" />
          <ElLinkOperate v-else-if="hasPerm([permInfo])" :text="$t('信息')" @click="edit(row)" />
          <ElLinkOperate v-if="hasPerm([permDele])" :text="$t('删除')" @click="dele(row)" />
          <ElLinkOperate v-if="hasPerm([permRole])" :text="$t('角色')" @click="role(row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-row class="mt-5">
      <el-col class="pl-3">
        <el-checkbox v-model="addEditDialog" :title="$t('添加修改时是弹窗还是新标签页')">
          <el-text size="default">{{ $t('弹窗') }}</el-text>
        </el-checkbox>
        <el-checkbox v-model="expandAlled" :title="$t('收起/展开')" @change="expandAll">
          <el-text size="default">{{ $t('收起') }}</el-text>
        </el-checkbox>
        <el-checkbox :title="$t('关联时选择父节点子节点也会被选择')" @change="checkStrictly">
          <el-text size="default">{{ $t('关联') }}</el-text>
        </el-checkbox>
        <el-checkbox v-model="islist" true-value="1" false-value="0" :title="$t('以列表或树形展示')" @change="list">
          <el-text size="default">{{ $t('列表') }}</el-text>
        </el-checkbox>
        <el-text size="default" tag="label">{{ $t('共') }} {{ count }} {{ $t('条') }}</el-text>
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
      <AddEdit :id="id" :pid="pid" :type="type" dialog @close="close" />
    </el-dialog>
    <!-- 角色 -->
    <Role
      :id="menu_id"
      :id-pk="idkey"
      :names="name"
      :title="menu_name"
      :title-pk="'menu_name'"
      :list-api="roleListApi"
      :lift-api="roleLiftApi"
      @close="role"
    />
  </div>
</template>

<script>
import Search from './component/Search.vue'
import Operate from './component/Operate.vue'
import AddEdit from './component/AddEdit.vue'
import { hasPerm, screenHeight, arrayColumn, getAddEditDialog } from '@/utils/index'
import { listApi, deleApi, roleListApi, roleLiftApi } from '@/api/system/menu'
import Role from '@/views/system/role/component/Role.vue'

export default {
  name: 'SystemMenuList',
  components: { Search, Operate, AddEdit, Role },
  data() {
    return {
      name: '',
      height: 700,
      loading: false,
      idkey: 'menu_id',
      query: {},
      data: [],
      count: '',
      ids: [],
      islist: 0,
      addEditDialog: getAddEditDialog(true),
      id: '',
      pid: '',
      type: 'edit',
      dialog: false,
      dialogTitle: '',
      basedata: {
        exps: [],
        trees: [],
        props: { value: 'menu_id', label: 'menu_name', checkStrictly: true, emitPath: false },
        menu_types: [],
        log_types: []
      },
      permInfo: 'admin/system.Menu/info',
      permAdd: 'admin/system.Menu/add',
      permEdit: 'admin/system.Menu/edit',
      permDele: 'admin/system.Menu/dele',
      permRole: 'admin/system.Menu/roleList',
      routeInfo: 'SystemMenuInfo',
      routeAdd: 'SystemMenuAdd',
      routeEdit: 'SystemMenuEdit',
      expandAlled: false,
      props: { checkStrictly: true },
      menu_id: 0,
      menu_name: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    roleListApi,
    roleLiftApi,
    init() {
      this.name = this.$t('菜单')
      this.height = screenHeight()
      this.type = hasPerm([this.permEdit]) ? 'edit' : 'info'
      this.basedata.exps = [{ exp: 'like', name: this.$t('包含') }]
    },
    // 列表
    list() {
      this.loading = true
      this.query.islist = this.islist
      listApi(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.loading = false
          this.expandAlled = false
          this.basedata.exps = res.data.basedata.exps
          this.basedata.trees = res.data.basedata.trees
          this.basedata.menu_types = res.data.basedata.menu_types
          this.basedata.log_types = res.data.basedata.log_types
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
    add(row) {
      this.id = ''
      if (row) {
        this.pid = row[this.idkey]
      }
      if (this.addEditDialog) {
        this.dialog = true
        this.dialogTitle = this.name + this.$t('添加')
      } else {
        this.$router.push({ name: this.routeAdd, params: { pid: this.pid } })
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
      this.pid = ''
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
          deleApi({ ids: [row[this.idkey]] })
            .then(() => {
              this.list()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    // 收起
    expandAll(expand) {
      this.expandFor(this.data, !expand)
    },
    expandFor(data, expand) {
      data.forEach((i) => {
        this.$refs.table.toggleRowExpansion(i, expand)
        if (i.children) {
          this.expandFor(i.children, expand)
        }
      })
    },
    // 关联
    checkStrictly(value) {
      this.props.checkStrictly = !value
    },
    // 角色
    role(row) {
      this.menu_id = row[this.idkey]
      this.menu_name = row.menu_name
    }
  }
}
</script>
