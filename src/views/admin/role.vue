<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="role_name" label="名称" />
            <el-option value="role_desc" label="描述" />
            <el-option value="is_disable" label="禁用" />
            <el-option :value="idkey" label="ID" />
          </el-select>
          <el-select v-if="query.search_field==='is_disable'" v-model="query.search_value" class="filter-item ya-search-value" placeholder="请选择">
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
          <el-input v-else v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="filter-item ya-date-value"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button title="禁用" @click="selectOpen('disable')">禁用</el-button>
          <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 2, maxRows: 12}" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='disable'" label="禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='dele'" label="" prop="">
            <span style="color:red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectCancel">取消</el-button>
          <el-button type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="datas" :height="height" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" min-width="100" sortable="custom" />
      <el-table-column prop="role_name" label="名称" min-width="160" />
      <el-table-column prop="role_desc" label="描述" min-width="130" />
      <el-table-column prop="role_sort" label="排序" min-width="100" sortable="custom" />
      <el-table-column prop="is_disable" label="禁用" min-width="110" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="130" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="userShow(row)">用户</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
      <el-form ref="ref" v-loading="dialogLoad" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="名称" prop="role_name">
          <el-input v-model="model.role_name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="role_desc">
          <el-input v-model="model.role_desc" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="role_sort" placeholder="250">
          <el-input v-model="model.role_sort" type="number" />
        </el-form-item>
        <el-form-item label="菜单">
          <span>
            <el-checkbox v-model="menuCheckAll" title="全选/反选" @change="menuCheckAllChange">全选</el-checkbox>
            <el-checkbox v-model="menuExpandAll" title="收起/展开" @change="menuExpandAllChange">收起</el-checkbox>
          </span>
          <el-tree
            ref="menuRef"
            :data="menuData"
            :props="menuProps"
            :default-checked-keys="model.admin_menu_ids"
            :default-expand-all="false"
            node-key="admin_menu_id"
            show-checkbox
            check-strictly
            @check="menuCheck"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <i v-if="data.menu_url" class="el-icon-link" style="margin-left:10px" :title="data.menu_url" />
                <i v-else class="el-icon-link" style="margin-left:10px;color:#fff" />
                <i v-if="data.is_unlogin" class="el-icon-user" style="margin-left:10px" title="免登" />
                <i v-else class="el-icon-user" style="margin-left:10px;color:#fff" />
                <i v-if="data.is_unauth" class="el-icon-unlock" style="margin-left:10px" title="免权" />
                <i v-else class="el-icon-unlock" style="margin-left:10px;color:#fff" />
              </span>
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 用户列表 -->
    <el-dialog :title="userDialogTitle" :visible.sync="userDialog" width="65%" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table ref="userRef" v-loading="userLoad" :data="userData" :height="height" @sort-change="userSort">
        <el-table-column prop="admin_user_id" label="用户ID" min-width="100" sortable="custom" />
        <el-table-column prop="username" label="账号" min-width="120" sortable="custom" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="remark" label="备注" width="100" />
        <el-table-column prop="is_admin" label="超管" min-width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_admin" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_disable" label="禁用" min-width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" align="right" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="text" @click="userRemove(row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="userCount > 0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="user" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, disable, user, userRemove } from '@/api/admin/role'

export default {
  name: 'AdminRole',
  components: { Pagination },
  data() {
    return {
      name: '角色',
      height: 680,
      loading: false,
      idkey: 'admin_role_id',
      datas: [],
      count: 0,
      query: {
        page: 1,
        limit: 15,
        search_field: 'role_name',
        date_field: 'create_time'
      },
      dialog: false,
      dialogTitle: '',
      dialogLoad: false,
      model: {
        admin_role_id: '',
        admin_menu_ids: [],
        admin_menu_pids: [],
        role_name: '',
        role_desc: '',
        role_sort: 250
      },
      rules: {
        role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      menuData: [],
      menuProps: { children: 'children', label: 'menu_name' },
      menuCheckAll: false,
      menuExpandAll: true,
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      is_disable: 0,
      userDialog: false,
      userDialogTitle: '',
      userLoad: false,
      userData: [],
      userCount: 0,
      userQuery: {}
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
      list(this.query).then(res => {
        this.datas = res.data.list
        this.count = res.data.count
        this.menuData = res.data.menu
        this.menuExpandAll = true
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加修改
    add() {
      this.dialog = true
      this.dialogLoad = true
      this.dialogTitle = this.name + '添加'
      this.dialogLoad = false
    },
    edit(row) {
      this.dialog = true
      this.dialogLoad = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
        this.reset(res.data)
        this.dialogLoad = false
      }).catch(() => {
        this.dialogLoad = false
      })
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model[this.idkey]) {
            edit(this.model).then(res => {
              this.list()
              this.reset()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.list()
              this.reset()
              this.dialog = false
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
      this.menuCheckAll = false
      this.menuExpandAll = true
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
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
    // 选中操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds(selection).toString()
    },
    selectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    selectAlert() {
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => {} })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['table'].clearSelection()
        this.$refs['table'].toggleRowSelection(selectRow)
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '选中操作'
        if (selectType === 'disable') {
          this.selectTitle = '禁用'
        } else if (selectType === 'dele') {
          this.selectTitle = '删除' + this.name
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
        if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 禁用
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
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
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
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 菜单选择
    menuCheck() {
      this.menuCheckSetKeys()
    },
    menuCheckAllChange() {
      if (this.menuCheckAll) {
        this.$refs.menuRef.setCheckedNodes(this.menuData)
      } else {
        this.$refs.menuRef.setCheckedKeys([])
      }
      this.menuCheckSetKeys()
    },
    menuCheckSetKeys() {
      this.model.admin_menu_ids = this.$refs.menuRef.getCheckedKeys()
      this.model.admin_menu_pids = this.$refs.menuRef.getHalfCheckedKeys()
    },
    menuExpandAllChange() {
      const expanded = !this.menuExpandAll
      const length = this.$refs.menuRef.store._getAllNodes().length
      for (let i = 0; i < length; i++) {
        this.$refs.menuRef.store._getAllNodes()[i].expanded = expanded
      }
    },
    // 用户显示
    userShow(row) {
      this.userDialog = true
      this.userDialogTitle = '角色用户：' + row.role_name
      this.userQuery.admin_role_id = row.admin_role_id
      this.user()
    },
    // 用户列表
    user() {
      this.userLoad = true
      user(this.userQuery).then(res => {
        this.userData = res.data.list
        this.userCount = res.data.count
        this.userLoad = false
      }).catch(() => {
        this.userLoad = false
      })
    },
    // 用户排序
    userSort(sort) {
      this.userQuery.sort_field = sort.prop
      this.userQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.userQuery.sort_value = 'asc'
        this.user()
      }
      if (sort.order === 'descending') {
        this.userQuery.sort_value = 'desc'
        this.user()
      }
    },
    // 用户解除
    userRemove(row) {
      this.$confirm(
        '确定要解除该角色与用户 <span style="color:red">' + row.username + ' </span>的关联吗？',
        '解除用户：' + row.admin_user_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.userLoad = true
        userRemove({
          admin_role_id: this.userQuery.admin_role_id,
          admin_user_id: row.admin_user_id
        }).then(res => {
          this.user()
          this.$message.success(res.msg)
        }).catch(() => {
          this.userLoad = false
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
