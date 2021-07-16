<template>
  <div class="app-container">
    <!-- 添加 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="24" style="text-align:right;">
          <el-checkbox v-model="isExpandAll" class="filter-item" border @change="expandAll">收起</el-checkbox>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
          <el-button class="filter-item" type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height+50" style="width: 100%" row-key="admin_menu_id" default-expand-all border>
      <el-table-column prop="menu_name" label="菜单名称" min-width="220" show-overflow-tooltip fixed="left" />
      <el-table-column prop="menu_url" label="菜单链接(roles)" min-width="225" show-overflow-tooltip />
      <el-table-column prop="menu_sort" label="排序" min-width="60" />
      <el-table-column prop="admin_menu_id" label="菜单ID" min-width="65" />
      <el-table-column prop="menu_pid" label="PID" min-width="60" />
      <el-table-column prop="create_time" label="添加时间" min-width="155" />
      <el-table-column prop="update_time" label="修改时间" min-width="155" />
      <el-table-column prop="is_disable" label="是否禁用" min-width="95" align="center">
        <template slot="header">
          <span>是否禁用 </span>
          <el-tooltip placement="top">
            <div slot="content">
              开启后无法访问<br>
            </div>
            <i class="el-icon-info" title="" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_unauth" label="无需权限" min-width="95" align="center">
        <template slot="header">
          <span>无需权限 </span>
          <el-tooltip placement="top">
            <div slot="content">
              开启后不用分配权限也可以访问<br>
            </div>
            <i class="el-icon-info" title="" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_unauth" :active-value="1" :inactive-value="0" @change="unauth(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_unlogin" label="无需登录" min-width="95" align="center">
        <template slot="header">
          <span>无需登录 </span>
          <el-tooltip placement="top">
            <div slot="content">
              开启后不用登录就可以访问，如验证码登录等<br>
            </div>
            <i class="el-icon-info" title="" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_unlogin" :active-value="1" :inactive-value="0" @change="unlogin(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="345" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="roleShow(row)">角色</el-button>
          <el-button size="mini" type="primary" @click="userShow(row,'admin_menu_id')">用户</el-button>
          <el-button size="mini" type="primary" @click="add(row)">添加</el-button>
          <el-button size="mini" type="success" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="dele(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="1vh" width="50%" :before-close="cancel">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="菜单父级" prop="menu_pid">
          <el-cascader
            v-model="model.menu_pid"
            :options="data"
            :props="props"
            style="width:100%"
            clearable
            filterable
            placeholder="一级菜单"
            @change="pidChange"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="model.menu_name" clearable placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单链接" prop="menu_url">
          <el-input v-model="model.menu_url" clearable placeholder="应用/控制器/操作，区分大小写" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menu_sort">
          <el-input v-model="model.menu_sort" type="number" placeholder="200" />
        </el-form-item>
        <el-form-item label="快速添加" prop="">
          <el-checkbox v-model="model.add_list">列表</el-checkbox>
          <el-checkbox v-model="model.add_info">信息</el-checkbox>
          <el-checkbox v-model="model.add_add">添加</el-checkbox>
          <el-checkbox v-model="model.add_edit">修改</el-checkbox>
          <el-checkbox v-model="model.add_dele">删除</el-checkbox>
        </el-form-item>
        <el-form-item v-if="model.admin_menu_id" label="快速修改" prop="">
          <el-checkbox v-model="model.edit_list">列表</el-checkbox>
          <el-checkbox v-model="model.edit_info">信息</el-checkbox>
          <el-checkbox v-model="model.edit_add">添加</el-checkbox>
          <el-checkbox v-model="model.edit_edit">修改</el-checkbox>
          <el-checkbox v-model="model.edit_dele">删除</el-checkbox>
        </el-form-item>
        <el-form-item label="" prop="">
          <span>快速添加<span v-if="model.admin_menu_id">、修改</span>，需要输入菜单链接：应用/控制器，不含操作</span>
        </el-form-item>
        <el-form-item v-if="model.admin_menu_id" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.admin_menu_id" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 角色 -->
    <el-dialog :title="roleDialogTitle" :visible.sync="roleDialog" width="65%" top="1vh">
      <el-table ref="roleRef" v-loading="roleLoad" :data="roleData" :height="height+30" style="width: 100%" border @sort-change="roleSort">
        <el-table-column prop="admin_role_id" label="角色ID" min-width="100" sortable="custom" fixed="left" />
        <el-table-column prop="role_name" label="角色" min-width="120" sortable="custom" />
        <el-table-column prop="role_desc" label="描述" min-width="130" />
        <el-table-column prop="is_disable" label="禁用" min-width="80" align="center" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="145" align="right" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="userShow(row)">用户</el-button>
            <el-button size="mini" type="danger" @click="roleRemove(row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="roleCount > 0" :total="roleCount" :page.sync="roleQuery.page" :limit.sync="roleQuery.limit" @pagination="roleList" />
    </el-dialog>
    <!-- 用户 -->
    <el-dialog :title="userDialogTitle" :visible.sync="userDialog" width="65%" top="1vh">
      <el-table ref="userRef" v-loading="userLoad" :data="userData" :height="height+30" style="width: 100%" border @sort-change="userSort">
        <el-table-column prop="admin_user_id" label="用户ID" min-width="100" sortable="custom" fixed="left" />
        <el-table-column prop="username" label="账号" min-width="120" sortable="custom" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="remark" label="备注" min-width="100" />
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
            <el-button v-if="userQuery.admin_menu_id" size="mini" type="danger" @click="userRemove(row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="userCount > 0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="userList" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { list, info, add, edit, dele, disable, unauth, unlogin, role, roleRemove, user, userRemove } from '@/api/admin/menu'

export default {
  name: 'AdminMenu',
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      height: 680,
      loading: false,
      data: [],
      props: {
        checkStrictly: true,
        value: 'admin_menu_id',
        label: 'menu_name'
      },
      dialog: false,
      dialogTitle: '',
      model: {
        admin_menu_id: '',
        menu_pid: 0,
        menu_name: '',
        menu_url: '',
        menu_sort: 200,
        add_list: false,
        add_info: false,
        add_add: false,
        add_edit: false,
        add_dele: false,
        edit_list: false,
        edit_info: false,
        edit_add: false,
        edit_edit: false,
        edit_dele: false
      },
      isExpandAll: false,
      rules: {
        menu_name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
      },
      roleDialog: false,
      roleDialogTitle: '',
      roleLoad: false,
      roleData: [],
      roleCount: 0,
      roleQuery: {
        page: 1,
        limit: 10
      },
      userDialog: false,
      userDialogTitle: '',
      userLoad: false,
      userData: [],
      userCount: 0,
      userQuery: {
        page: 1,
        limit: 10
      }
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
      list().then(res => {
        this.data = res.data.list
        this.isExpandAll = false
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 收起
    expandAll(e) {
      this.expandFor(this.data, !e)
    },
    expandFor(data, isExpand) {
      data.forEach(i => {
        this.$refs.table.toggleRowExpansion(i, isExpand)
        if (i.children) {
          this.expandFor(i.children, isExpand)
        }
      })
    },
    // 添加
    add(row) {
      this.dialog = true
      this.dialogTitle = '菜单添加'
      this.model = this.$options.data().model
      if (row) {
        this.model.menu_pid = row.admin_menu_id
      }
    },
    // 修改
    edit(row) {
      this.loading = true
      this.dialog = true
      this.dialogTitle = '菜单修改：' + row.admin_menu_id
      info({
        admin_menu_id: row.admin_menu_id
      }).then(res => {
        this.reset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    dele(row) {
      this.$confirm(
        '确定要删除菜单 <span style="color:red">' + row.menu_name + ' </span>吗？',
        '删除菜单：' + row.admin_menu_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.loading = true
        dele({
          admin_menu_id: row.admin_menu_id
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 取消
    cancel() {
      this.reset()
      this.dialog = false
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.admin_menu_id) {
            edit(this.model).then(res => {
              this.dialog = false
              this.list()
              this.reset()
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.dialog = false
              this.list()
              this.reset()
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
      if (row) {
        this.model = row
        this.model.add_list = false
        this.model.add_info = false
        this.model.add_add = false
        this.model.add_edit = false
        this.model.add_dele = false
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
      }
    },
    // 刷新
    refresh() {
      this.list()
    },
    // 是否禁用
    disable(row) {
      this.loading = true
      disable({
        admin_menu_id: row.admin_menu_id,
        is_disable: row.is_disable
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
        this.loading = false
      })
    },
    // 无需权限
    unauth(row) {
      this.loading = true
      unauth({
        admin_menu_id: row.admin_menu_id,
        is_unauth: row.is_unauth
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
        this.loading = false
      })
    },
    // 无需登录
    unlogin(row) {
      if (row.is_unlogin === 1) {
        this.$confirm(
          '确定要设置菜单 <span style="color:red">' + row.menu_name + ' </span>为无需登录吗？<br>开启后不用登录就可以访问！请根据需求设置！',
          '无需登录：' + row.admin_menu_id,
          { type: 'warning', dangerouslyUseHTMLString: true }
        ).then(() => {
          this.loading = true
          unlogin({
            admin_menu_id: row.admin_menu_id,
            is_unlogin: row.is_unlogin
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.list()
            this.loading = false
          })
        }).catch(() => {
          this.list()
        })
      } else {
        this.loading = true
        unlogin({
          admin_menu_id: row.admin_menu_id,
          is_unlogin: row.is_unlogin
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 父级选择
    pidChange(value) {
      if (value) {
        this.model.menu_pid = value[value.length - 1]
      }
    },
    // 角色显示
    roleShow(row) {
      this.roleDialog = true
      this.roleDialogTitle = '菜单角色：' + row.menu_name
      this.roleQuery.admin_menu_id = row.admin_menu_id
      this.roleList()
    },
    // 角色列表
    roleList() {
      this.roleLoad = true
      role(this.roleQuery).then(res => {
        this.roleData = res.data.list
        this.roleCount = res.data.count
        this.roleLoad = false
        this.$nextTick(() => {
          this.$refs['roleRef'].doLayout()
        })
      }).catch(() => {
        this.roleLoad = false
      })
    },
    // 角色排序
    roleSort(sort) {
      this.roleQuery.sort_field = sort.prop
      this.roleQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.roleQuery.sort_type = 'asc'
        this.roleList()
      }
      if (sort.order === 'descending') {
        this.roleQuery.sort_type = 'desc'
        this.roleList()
      }
    },
    // 角色解除
    roleRemove(row) {
      this.$confirm(
        '确定要解除菜单与角色 <span style="color:red">' + row.role_name + ' </span>的关联吗？',
        '解除角色：' + row.admin_role_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.roleLoad = true
        roleRemove({
          admin_menu_id: this.roleQuery.admin_menu_id,
          admin_role_id: row.admin_role_id
        }).then(res => {
          this.roleList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.roleLoad = false
        })
      }).catch(() => {})
    },
    // 用户显示
    userShow(row, type = 'admin_role_id') {
      this.userDialog = true
      if (type === 'admin_menu_id') {
        this.userDialogTitle = '菜单用户（按菜单）：' + row.menu_name
        this.userQuery.admin_menu_id = row.admin_menu_id
        this.userQuery.admin_role_id = ''
      } else {
        this.userDialogTitle = '菜单用户（按角色）：' + row.role_name
        this.userQuery.admin_menu_id = ''
        this.userQuery.admin_role_id = row.admin_role_id
      }
      this.userList()
    },
    // 用户列表
    userList() {
      this.userLoad = true
      user(this.userQuery).then(res => {
        this.userData = res.data.list
        this.userCount = res.data.count
        this.userLoad = false
        this.$nextTick(() => {
          this.$refs['userRef'].doLayout()
        })
      }).catch(() => {
        this.userLoad = false
      })
    },
    // 用户排序
    userSort(sort) {
      this.userQuery.sort_field = sort.prop
      this.userQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.userQuery.sort_type = 'asc'
        this.userList()
      }
      if (sort.order === 'descending') {
        this.userQuery.sort_type = 'desc'
        this.userList()
      }
    },
    // 用户解除
    userRemove(row) {
      this.$confirm(
        '确定要解除菜单与用户 <span style="color:red">' + row.username + ' </span>的关联吗？',
        '解除用户：' + row.admin_user_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.userLoad = true
        userRemove({
          admin_menu_id: this.userQuery.admin_menu_id,
          admin_user_id: row.admin_user_id
        }).then(res => {
          this.userList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.userLoad = false
        })
      }).catch(() => {})
    }
  }
}
</script>
