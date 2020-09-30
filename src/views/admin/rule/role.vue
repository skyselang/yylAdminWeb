<template>
  <div class="app-container">
    <!-- 角色查询 -->
    <div class="filter-container">
      <el-input v-model="roleQuery.role_name" class="filter-item" style="width: 200px;" placeholder="角色" clearable />
      <el-input v-model="roleQuery.role_desc" class="filter-item" style="width: 200px;" placeholder="描述" clearable />
      <el-button class="filter-item" type="primary" @click="roleSearch">查询</el-button>
      <el-button class="filter-item" type="primary" style="float:right;margin-left:10px" @click="roleAddition">添加</el-button>
      <el-button class="filter-item" type="primary" style="float:right;" @click="roleRefresh">刷新</el-button>
    </div>
    <!-- 角色列表 -->
    <el-table v-loading="loading" :data="roleData" :height="height" style="width: 100%" border @sort-change="roleSort">
      <el-table-column prop="admin_role_id" label="ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="role_name" label="角色" min-width="120" />
      <el-table-column prop="role_desc" label="描述" min-width="130" />
      <el-table-column prop="role_sort" label="排序" min-width="100" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" sortable="custom" />
      <el-table-column prop="is_prohibit" label="是否禁用" min-width="110" align="center" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_prohibit" active-value="1" inactive-value="0" @change="roleIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="220" align="right" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userListShow(row)">用户</el-button>
          <el-button size="mini" type="primary" @click="roleModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="roleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色分页 -->
    <pagination v-show="roleCount > 0" :total="roleCount" :page.sync="roleQuery.page" :limit.sync="roleQuery.limit" @pagination="roleList" />
    <!-- 角色添加、修改 -->
    <el-dialog :title="roleModel.dialog_title" :visible.sync="roleDialog" top="1vh">
      <el-form ref="roleRef" :rules="roleRules" :model="roleModel" label-width="100px" class="dialog-body" :style="{height:height+80+'px'}">
        <el-form-item label="角色" prop="role_name">
          <el-input v-model="roleModel.role_name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="role_desc">
          <el-input v-model="roleModel.role_desc" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="role_sort">
          <el-input v-model="roleModel.role_sort" type="number" />
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="menuRef"
            :data="menuData"
            :default-checked-keys="roleModel.admin_menu_ids"
            :props="menuProps"
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
              <span v-if="data.children[0]">
                <el-button type="text" size="mini" @click="() => menuChildrenAllCheck(data)">全选</el-button>
                <el-button type="text" size="mini" @click="() => menuChildrenAllCheck(data, true)">反选</el-button>
              </span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleCancel">取消</el-button>
        <el-button type="primary" @click="roleSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 用户列表 -->
    <el-dialog :title="userTitle" :visible.sync="userDialog" width="65%" top="1vh">
      <el-table v-loading="userLoad" :data="userData" :height="height+20" style="width: 100%" border @sort-change="userSort">
        <el-table-column prop="admin_user_id" label="ID" min-width="100" sortable="custom" fixed="left" />
        <el-table-column prop="username" label="账号" min-width="120" sortable="custom" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" width="100" />
        <el-table-column prop="is_super_admin" label="是否超管" min-width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_super_admin" active-value="1" inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_prohibit" label="是否禁用" min-width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_prohibit" active-value="1" inactive-value="0" disabled />
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
import {
  menuList,
  roleList,
  roleProhibit,
  roleAdd,
  roleEdit,
  roleDele,
  userList
} from '@/api/admin'

export default {
  name: 'Role',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      loadingTime: 0,
      menuData: [],
      menuProps: {
        children: 'children',
        label: 'menu_name'
      },
      roleDialog: false,
      roleData: [],
      roleCount: 0,
      roleQuery: {
        page: 1,
        limit: 13
      },
      roleModel: {
        dialog_title: '',
        admin_role_id: '',
        admin_menu_ids: [],
        role_name: '',
        role_desc: '',
        role_sort: '',
        is_prohibit: '0'
      },
      roleRules: {
        role_name: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      userDialog: false,
      userLoad: false,
      userData: [],
      userCount: 0,
      userQuery: {},
      userTitle: ''
    }
  },
  created() {
    this.height = screenHeight()
    this.roleList()
  },
  methods: {
    loadOpen() {
      this.loading = true
    },
    loadClose() {
      const that = this
      setTimeout(function() {
        that.loading = false
      }, that.loadingTime)
    },
    message(msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    },
    // 菜单列表
    menuList() {
      menuList().then(res => {
        this.menuData = res.data.list
      })
    },
    // 菜单选择
    menuCheck(data, node) {
      this.roleModel.admin_menu_ids = node.checkedKeys
    },
    // 菜单子菜单全选反选
    menuChildrenAllCheck(data, back = false) {
      const admin_menu_ids = this.roleModel.admin_menu_ids
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
        this.roleModel.admin_menu_ids = admin_menu_ids
        this.$refs.menuRef.setCheckedKeys(admin_menu_ids)
      } else {
        const admin_menu_ids_temp = []
        const admin_menu_ids_all = admin_menu_ids.concat(admin_menu_ids_child)
        for (let i = 0; i < admin_menu_ids_all.length; i++) {
          if (admin_menu_ids_temp.indexOf(admin_menu_ids_all[i]) === -1) {
            admin_menu_ids_temp.push(admin_menu_ids_all[i])
          }
        }
        this.roleModel.admin_menu_ids = admin_menu_ids_temp
        this.$refs.menuRef.setCheckedKeys(admin_menu_ids_temp)
      }
    },
    // 角色列表
    roleList() {
      this.loadOpen()
      roleList(this.roleQuery)
        .then(res => {
          this.roleData = res.data.list
          this.roleCount = res.data.count
          this.loadClose()
        })
        .catch(() => {
          this.loadClose()
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
    // 角色查询
    roleSearch() {
      this.roleQuery.page = 1
      this.roleList()
    },
    // 角色刷新
    roleRefresh() {
      this.roleQuery = { page: 1, limit: 13 }
      this.roleList()
    },
    // 角色添加
    roleAddition() {
      this.roleDialog = true
      this.menuList()
      this.roleReset()
    },
    // 角色修改
    roleModify(row) {
      this.roleDialog = true
      this.menuList()
      this.roleReset(row)
    },
    // 角色删除
    roleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadOpen()
          roleDele({ admin_role_id: row.admin_role_id })
            .then(res => {
              this.message(res.msg)
              this.roleReset()
              this.roleList()
            })
            .catch(() => {
              this.loadClose()
            })
        })
        .catch(() => {})
    },
    // 角色是否禁用
    roleIsProhibit(row) {
      this.loadOpen()
      roleProhibit(row)
        .then(res => {
          this.message(res.msg)
          this.roleList()
        })
        .catch(() => {
          this.loadOpen()
        })
    },
    // 角色添加、修改重置
    roleReset(row) {
      if (row) {
        this.roleModel.dialog_title = '角色修改：' + row.role_name
        this.roleModel.admin_role_id = row.admin_role_id
        this.roleModel.admin_menu_ids = row.admin_menu_ids
        this.roleModel.role_name = row.role_name
        this.roleModel.role_desc = row.role_desc
        this.roleModel.role_sort = row.role_sort
      } else {
        this.roleModel.dialog_title = '角色添加'
        this.roleModel.admin_role_id = ''
        this.roleModel.admin_menu_ids = []
        this.roleModel.role_name = ''
        this.roleModel.role_desc = ''
        this.roleModel.role_sort = 200
      }
    },
    // 角色添加、修改取消
    roleCancel() {
      this.roleDialog = false
      this.roleReset()
    },
    // 角色添加、修改提交
    roleSubmit() {
      this.$refs['roleRef'].validate(valid => {
        if (valid) {
          this.loadOpen()
          if (this.roleModel.admin_role_id) {
            roleEdit(this.roleModel)
              .then(res => {
                this.roleDialog = false
                this.message(res.msg)
                this.roleReset()
                this.roleList()
              })
              .catch(() => {
                this.loadClose()
              })
          } else {
            roleAdd(this.roleModel)
              .then(res => {
                this.roleDialog = false
                this.message(res.msg)
                this.roleReset()
                this.roleList()
              })
              .catch(() => {
                this.loadClose()
              })
          }
        }
      })
    },
    // 用户列表显示
    userListShow(row) {
      this.userDialog = true
      this.userTitle = row.role_name
      this.userQuery.admin_role_id = row.admin_role_id
      this.userList()
    },
    // 用户列表
    userList() {
      this.userLoad = true
      userList(this.userQuery)
        .then(res => {
          this.userData = res.data.list
          this.userCount = res.data.count
          this.userLoad = false
        })
        .catch(() => {
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
