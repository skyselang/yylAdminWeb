<template>
  <div class="app-container">
    <!-- 菜单添加 -->
    <div class="filter-container" style="text-align:right">
      <el-button class="filter-item" @click="menuRefresh()">刷新</el-button>
      <el-button class="filter-item" type="primary" @click="menuAddition()">添加</el-button>
    </div>
    <!-- 菜单列表 -->
    <el-table v-loading="loading" :data="menuData" :height="height+100" style="width: 100%" row-key="admin_menu_id" border>
      <el-table-column prop="menu_name" label="菜单名称" min-width="220" fixed="left" />
      <el-table-column prop="menu_url" label="菜单链接" min-width="260" />
      <el-table-column prop="menu_sort" label="菜单排序" min-width="90" />
      <el-table-column prop="admin_menu_id" label="ID" min-width="90" />
      <el-table-column prop="menu_pid" label="PID" min-width="90" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" />
      <el-table-column prop="is_disable" label="是否禁用" min-width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_disable" active-value="1" inactive-value="0" @change="menuIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_unauth" label="无需权限" min-width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_unauth" active-value="1" inactive-value="0" @change="menuIsUnauth(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="352" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="menuRoleShow(row)">角色</el-button>
          <el-button size="mini" type="primary" @click="menuUserShow(row,'admin_menu_id')">用户</el-button>
          <el-button size="mini" type="primary" @click="menuAddition(row)">添加</el-button>
          <el-button size="mini" type="primary" @click="menuModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="menuDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 菜单添加、修改 -->
    <el-dialog :title="menuDialogTitle" :visible.sync="menuDialog" top="1vh" :before-close="menuCancel">
      <el-form ref="menuRef" :rules="menuRules" :model="menuModel" class="dialog-body" label-width="100px" :style="{height:height+70+'px'}">
        <el-form-item label="菜单父级" prop="menu_pid">
          <el-cascader v-model="menuModel.menu_pid" :options="menuData" :props="menuProps" style="width:100%" clearable filterable placeholder="一级菜单" @change="menuPidChange" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="menuModel.menu_name" clearable placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单链接" prop="menu_url">
          <el-input v-model="menuModel.menu_url" clearable />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menu_sort">
          <el-input v-model="menuModel.menu_sort" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuCancel">取消</el-button>
        <el-button type="primary" @click="menuSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 菜单角色 -->
    <el-dialog :title="roleTitle" :visible.sync="roleDialog" width="65%" top="1vh">
      <el-table ref="roleRef" v-loading="roleLoad" :data="roleData" :height="height+30" style="width: 100%" border @sort-change="menuRoleSort">
        <el-table-column prop="admin_role_id" label="ID" min-width="100" sortable="custom" fixed="left" />
        <el-table-column prop="role_name" label="角色" min-width="120" sortable="custom" />
        <el-table-column prop="role_desc" label="描述" min-width="130" />
        <el-table-column prop="is_disable" label="是否禁用" min-width="110" align="center" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_disable" active-value="1" inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120" align="right" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="menuUserShow(row)">用户</el-button>
            <el-button size="mini" type="danger" @click="menuRoleRemove(row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="roleCount > 0" :total="roleCount" :page.sync="roleQuery.page" :limit.sync="roleQuery.limit" @pagination="menuRoleList" />
    </el-dialog>
    <!-- 菜单用户 -->
    <el-dialog :title="userTitle" :visible.sync="userDialog" width="62%" top="2vh">
      <el-table ref="userRef" v-loading="userLoad" :data="userData" :height="height+10" style="width: 100%" border @sort-change="menuUserSort">
        <el-table-column prop="admin_user_id" label="ID" min-width="100" sortable="custom" fixed="left" />
        <el-table-column prop="username" label="账号" min-width="120" sortable="custom" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" width="100" />
        <el-table-column prop="is_admin" label="是否管理员" min-width="96" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_admin" active-value="1" inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_disable" label="是否禁用" min-width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_disable" active-value="1" inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="right" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{ row }">
            <el-button v-if="userQuery.admin_menu_id" size="mini" type="danger" @click="menuUserRemove(row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="userCount > 0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="menuUserList" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import {
  menuList,
  menuAdd,
  menuInfo,
  menuEdit,
  menuDele,
  menuDisable,
  menuUnauth,
  menuRole,
  menuRoleRemove,
  menuUser,
  menuUserRemove
} from '@/api/admin'

export default {
  name: 'Menu',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      menuData: [],
      menuDialog: false,
      menuDialogTitle: '',
      menuProps: {
        checkStrictly: true,
        value: 'admin_menu_id',
        label: 'menu_name'
      },
      menuModel: {
        admin_menu_id: '',
        menu_pid: 0,
        menu_name: '',
        menu_url: '',
        menu_sort: 200
      },
      menuRules: {
        menu_name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
      },
      roleDialog: false,
      roleTitle: '',
      roleLoad: false,
      roleData: [],
      roleCount: 0,
      roleQuery: {
        page: 1,
        limit: 13
      },
      userDialog: false,
      userTitle: '',
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
    this.menuList()
  },
  methods: {
    // 菜单列表
    menuList() {
      this.loading = true
      menuList().then(res => {
        this.menuData = res.data.list
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 菜单刷新
    menuRefresh() {
      this.menuList()
    },
    // 菜单是否禁用
    menuIsProhibit(row) {
      this.loading = true
      menuDisable({
        admin_menu_id: row.admin_menu_id,
        is_disable: row.is_disable
      }).then(res => {
        this.menuList()
        this.$message({ message: res.msg, type: 'success' })
      }).catch(() => {
        this.loading = false
      })
    },
    // 菜单无需权限
    menuIsUnauth(row) {
      this.loading = true
      menuUnauth({
        admin_menu_id: row.admin_menu_id,
        is_unauth: row.is_unauth
      }).then(res => {
        this.menuList()
        this.$message({ message: res.msg, type: 'success' })
      }).catch(() => {
        this.loading = false
      })
    },
    // 菜单添加打开
    menuAddition(row) {
      this.menuDialog = true
      this.menuDialogTitle = '菜单添加'
      this.menuModel = this.$options.data().menuModel
      if (row) {
        this.menuModel.menu_pid = row.admin_menu_id
      }
    },
    // 菜单修改打开
    menuModify(row) {
      this.menuDialog = true
      this.menuDialogTitle = '菜单修改：' + row.menu_name
      menuInfo({
        admin_menu_id: row.admin_menu_id
      }).then(res => {
        this.menuModel = res.data
      })
    },
    // 菜单删除
    menuDelete(row) {
      this.$confirm(
        '确定要删除菜单 <span style="color:red">' + row.menu_name + ' </span>吗？',
        '菜单删除确认',
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        menuDele({
          admin_menu_id: row.admin_menu_id
        }).then(res => {
          this.menuList()
          this.menuReset()
          this.$message({ message: res.msg, type: 'success' })
        }).catch(() => {
          this.loading = false
        })
      })
    },
    // 菜单父级选择
    menuPidChange(value) {
      if (value) {
        this.menuModel.menu_pid = value[value.length - 1]
      }
    },
    // 菜单添加、修改数据重置
    menuReset(row) {
      if (row) {
        this.menuModel = row
      } else {
        this.menuModel = this.$options.data().menuModel
      }
      if (this.$refs['menuRef'] !== undefined) {
        this.$refs['menuRef'].resetFields()
      }
    },
    // 菜单添加、修改取消
    menuCancel() {
      this.menuReset()
      this.menuDialog = false
    },
    // 菜单添加、修改提交
    menuSubmit() {
      this.$refs['menuRef'].validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            admin_menu_id: this.menuModel.admin_menu_id,
            menu_pid: this.menuModel.menu_pid,
            menu_name: this.menuModel.menu_name,
            menu_url: this.menuModel.menu_url,
            menu_sort: this.menuModel.menu_sort
          }
          if (params.admin_menu_id) {
            menuEdit(params).then(res => {
              this.menuReset()
              this.menuList()
              this.menuDialog = false
              this.$message({ message: res.msg, type: 'success' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            menuAdd(params).then(res => {
              this.menuReset()
              this.menuList()
              this.menuDialog = false
              this.$message({ message: res.msg, type: 'success' })
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 菜单角色显示
    menuRoleShow(row) {
      this.roleDialog = true
      this.roleTitle = '菜单角色：' + row.menu_name
      this.roleQuery.admin_menu_id = row.admin_menu_id
      this.menuRoleList()
    },
    // 菜单角色列表
    menuRoleList() {
      this.roleLoad = true
      menuRole(this.roleQuery).then(res => {
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
    // 菜单角色排序
    menuRoleSort(sort) {
      this.roleQuery.sort_field = sort.prop
      this.roleQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.roleQuery.sort_type = 'asc'
        this.menuRoleList()
      }
      if (sort.order === 'descending') {
        this.roleQuery.sort_type = 'desc'
        this.menuRoleList()
      }
    },
    // 菜单角色解除
    menuRoleRemove(row) {
      this.$confirm(
        '确定要解除菜单与角色 <span style="color:red">' + row.role_name + ' </span>的关联吗？',
        '解除确认',
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.roleLoad = true
        menuRoleRemove({
          admin_menu_id: this.roleQuery.admin_menu_id,
          admin_role_id: row.admin_role_id
        }).then(res => {
          this.menuRoleList()
          this.$message({ message: res.msg, type: 'success' })
        }).catch(() => {
          this.roleLoad = false
        })
      })
    },
    // 菜单用户显示
    menuUserShow(row, type = 'admin_role_id') {
      this.userDialog = true
      if (type === 'admin_menu_id') {
        this.userTitle = '菜单用户（按菜单）：' + row.menu_name
        this.userQuery.admin_menu_id = row.admin_menu_id
        this.userQuery.admin_role_id = ''
      } else {
        this.userTitle = '菜单用户（按角色）：' + row.role_name
        this.userQuery.admin_menu_id = ''
        this.userQuery.admin_role_id = row.admin_role_id
      }
      this.menuUserList()
    },
    // 菜单用户列表
    menuUserList() {
      this.userLoad = true
      menuUser(this.userQuery).then(res => {
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
    // 菜单用户排序
    menuUserSort(sort) {
      this.userQuery.sort_field = sort.prop
      this.userQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.userQuery.sort_type = 'asc'
        this.menuUserList()
      }
      if (sort.order === 'descending') {
        this.userQuery.sort_type = 'desc'
        this.menuUserList()
      }
    },
    // 菜单用户解除
    menuUserRemove(row) {
      this.$confirm(
        '确定要解除菜单与用户 <span style="color:red">' + row.username + ' </span>的关联吗？',
        '解除确认',
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.userLoad = true
        menuUserRemove({
          admin_menu_id: this.userQuery.admin_menu_id,
          admin_user_id: row.admin_user_id
        }).then(res => {
          this.menuUserList()
          this.$message({ message: res.msg, type: 'success' })
        }).catch(() => {
          this.userLoad = false
        })
      })
    }
  }
}
</script>
