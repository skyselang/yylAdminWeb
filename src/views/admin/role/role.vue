<template>
  <div class="app-container">
    <!-- 查询、选中操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="role_name" label="名称" />
            <el-option value="role_desc" label="描述" />
            <el-option value="is_disable" label="是否禁用" />
            <el-option value="admin_role_id" label="ID" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
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
          <el-button @click="selectOpen('disable')">禁用</el-button>
          <el-button @click="dele(selection)">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog title="选中操作" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item v-if="selectType==='disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectCancel">取消</el-button>
          <el-button type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="datas" :height="height" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="admin_role_id" label="ID" min-width="100" sortable="custom" />
      <el-table-column prop="role_name" label="名称" min-width="160" />
      <el-table-column prop="role_desc" label="描述" min-width="130" />
      <el-table-column prop="role_sort" label="排序" min-width="100" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" sortable="custom" />
      <el-table-column prop="is_disable" label="是否禁用" min-width="110" align="center" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="130" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="userShow(row)">用户</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
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
          <el-tree
            ref="menuRef"
            :data="menuData"
            :default-checked-keys="model.admin_menu_ids"
            :props="{children: 'children',label: 'menu_name'}"
            :expand-on-click-node="false"
            node-key="admin_menu_id"
            default-expand-all
            show-checkbox
            check-strictly
            highlight-current
            @check="menuCheck"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <el-button v-if="data.children[0]" type="text" size="mini" @click="() => menuChildrenAllCheck(data)">全选</el-button>
                <el-button v-if="data.children[0]" type="text" size="mini" @click="() => menuChildrenAllCheck(data, true)">反选</el-button>
                <i v-if="data.menu_url" class="el-icon-link" style="margin-left:10px;" :title="data.menu_url" />
                <i v-else class="el-icon-link" style="margin-left:10px;color:#fff" />
                <i v-if="data.is_unauth" class="el-icon-unlock" style="margin-left:10px;" title="无需权限" />
                <i v-else class="el-icon-unlock" style="margin-left:10px;color:#fff" />
                <i v-if="data.is_unlogin" class="el-icon-user" style="margin-left:10px;" title="无需登录" />
                <i v-else class="el-icon-user" style="margin-left:10px;color:#fff" />
              </span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
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
import { menu, list, info, add, edit, dele, disable, user, userRemove } from '@/api/admin/role'

export default {
  name: 'AdminRole',
  components: { Pagination },
  data() {
    return {
      name: '角色',
      height: 680,
      loading: false,
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
      model: {
        admin_role_id: '',
        admin_menu_ids: [],
        role_name: '',
        role_desc: '',
        role_sort: 250
      },
      menuData: [],
      selection: [],
      selectDialog: false,
      selectType: '',
      is_disable: 0,
      rules: {
        role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
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
    this.menu()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query).then(res => {
        this.datas = res.data.list
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 菜单
    menu() {
      menu().then(res => {
        this.menuData = res.data.list
      }).catch(() => {
      })
    },
    // 添加修改
    add() {
      this.dialog = true
      this.dialogTitle = '角色添加'
      menu().then(res => {
        this.menuData = res.data.list
      })
      this.reset()
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = '角色修改：' + row.admin_role_id
      info({
        admin_role_id: row.admin_role_id
      }).then(res => {
        this.reset(res.data)
      })
    },
    cancel() {
      this.dialog = false
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.admin_role_id) {
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
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].admin_role_id
          message = '确定要删除' + this.name + ' <span style="color:red">' + row[0].role_name + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          dele({
            ids: arrayColumn(row, 'admin_role_id')
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
    },
    // 重置
    reset(row) {
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
    },
    selectAlert(message = '') {
      this.$alert(message || '请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => {} })
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
        if (type === 'disable') {
          this.disable(this.selection, true)
        }
        this.selectDialog = false
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
          ids: arrayColumn(row, 'admin_role_id'),
          is_disable: is_disable
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 菜单选择
    menuCheck(data, node) {
      this.model.admin_menu_ids = node.checkedKeys
    },
    // 菜单全选反选
    menuChildrenAllCheck(data, back = false) {
      const admin_menu_ids = this.model.admin_menu_ids
      const admin_menu_ids_child = []
      admin_menu_ids_child.push(data.admin_menu_id)
      for (let i = 0; i < data.children.length; i++) {
        admin_menu_ids_child.push(data.children[i].admin_menu_id)
      }
      if (back) {
        for (let i = 0; i < admin_menu_ids.length; i++) {
          for (let j = 0; j < admin_menu_ids_child.length; j++) {
            if (admin_menu_ids[i] === admin_menu_ids_child[j]) {
              admin_menu_ids.splice(i, 1)
            }
          }
        }
        this.model.admin_menu_ids = admin_menu_ids
        this.$refs.menuRef.setCheckedKeys(admin_menu_ids)
      } else {
        const admin_menu_ids_temp = []
        const admin_menu_ids_all = admin_menu_ids.concat(admin_menu_ids_child)
        for (let i = 0; i < admin_menu_ids_all.length; i++) {
          if (admin_menu_ids_temp.indexOf(admin_menu_ids_all[i]) === -1) {
            admin_menu_ids_temp.push(admin_menu_ids_all[i])
          }
        }
        this.model.admin_menu_ids = admin_menu_ids_temp
        this.$refs.menuRef.setCheckedKeys(admin_menu_ids_temp)
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
