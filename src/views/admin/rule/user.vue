<template>
  <div class="app-container">
    <!-- 用户查询 -->
    <div class="filter-container">
      <el-input v-model="userQuery.username" class="filter-item" style="width: 150px;" placeholder="账号" clearable />
      <el-input v-model="userQuery.nickname" class="filter-item" style="width: 150px;" placeholder="昵称" clearable />
      <el-input v-model="userQuery.email" class="filter-item" style="width: 250px;" placeholder="邮箱" clearable />
      <el-button class="filter-item" type="primary" @click="userSearch">查询</el-button>
      <el-button class="filter-item" type="primary" style="float:right;margin-left:10px" @click="userAddition">添加</el-button>
      <el-button class="filter-item" type="primary" style="float:right;" @click="userRefresh">刷新</el-button>
    </div>
    <!-- 用户列表 -->
    <el-table v-loading="loading" :data="userData" :height="height" style="width: 100%" border @sort-change="userSort">
      <el-table-column prop="admin_user_id" label="ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="username" label="账号" min-width="120" sortable="custom" />
      <el-table-column prop="nickname" label="昵称" min-width="120" sortable="custom" />
      <el-table-column prop="email" label="邮箱" min-width="200" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="login_num" label="登录次数" min-width="110" sortable="custom" />
      <el-table-column prop="login_ip" label="登录IP" min-width="130" sortable="custom" />
      <el-table-column prop="login_time" label="登录时间" min-width="160" sortable="custom" />
      <el-table-column prop="is_super_admin" label="超管" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_super_admin" active-value="1" inactive-value="0" @change="userIsSuperAdmin(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_prohibit" label="禁用" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_prohibit" active-value="1" inactive-value="0" @change="userIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" sortable="custom" />
      <el-table-column prop="is_prohibit" label="权限" min-width="150" align="center">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userEditRule(row)">分配</el-button>
          <el-button size="mini" type="primary" @click="userEditRuleInfo(row)">明细</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="password" label="密码" width="80" align="center">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userPassword(row)">密码</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" align="right" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="userDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户分页 -->
    <pagination v-show="userCount > 0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="userList" />
    <!-- 用户添加、修改 -->
    <el-dialog :title="userModel.dialog_title" :visible.sync="userDialog" width="65%" top="1vh" :before-close="handleClose">
      <el-form ref="userRef" class="dialog-body" :rules="userRoles" :model="userModel" label-width="100px" :style="{height:height+50+'px'}">
        <el-form-item v-if="userModel.admin_user_id && userModel.avatar" label="头像">
          <el-avatar shape="circle" fit="contain" :size="100" :src="userModel.avatar" />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="userModel.username" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userModel.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id == ''" label="密码" prop="password">
          <el-input v-model="userModel.password" placeholder="请输入密码" clearable show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userModel.email" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userModel.remark" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="userModel.sort" type="number" />
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id" label="登录地区" prop="login_region">
          <el-input v-model="userModel.login_region" disabled />
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id" label="添加时间" prop="create_time">
          <el-input v-model="userModel.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id" label="更新时间" prop="update_time">
          <el-input v-model="userModel.update_time" disabled />
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id" label="退出时间" prop="logout_time">
          <el-input v-model="userModel.logout_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userCancel">取消</el-button>
        <el-button type="primary" @click="userSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 用户权限分配 -->
    <el-dialog :title="'权限分配：'+userModel.username" :visible.sync="userDialogRole" width="65%" top="1vh" :before-close="handleClose">
      <el-form ref="roleRef" :model="userModel" label-width="80px" class="dialog-body" :style="{height:height+50+'px'}">
        <el-form-item label="账号">
          <el-input v-model="userModel.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userModel.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="按角色">
          <el-checkbox-group v-model="userModel.admin_role_ids">
            <el-checkbox v-for="item in roleData" :key="item.admin_role_id" :label="item.admin_role_id">{{ item.role_name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="按菜单">
          <el-tree
            ref="menuRef"
            :data="menuData"
            :default-checked-keys="userModel.admin_menu_id"
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
              <span v-if="userModel.admin_menu_ids.includes(data.admin_menu_id)">
                <i class="el-icon-check" />
              </span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userCancelRule">取消</el-button>
        <el-button type="primary" @click="userSubmitRule">提交</el-button>
      </div>
    </el-dialog>
    <!-- 用户权限明细 -->
    <el-dialog :title="'权限明细：'+userModel.username" :visible.sync="userDialogRoleInfo" width="65%" top="1vh" :before-close="handleClose">
      <el-form ref="roleInfoRef" :model="userModel" label-width="80px" class="dialog-body" :style="{height:height+50+'px'}">
        <el-form-item label="账号">
          <el-input v-model="userModel.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userModel.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="userModel.admin_role_ids">
            <el-checkbox v-for="item in roleData" :key="item.admin_role_id" :label="item.admin_role_id" disabled>{{ item.role_name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree ref="menuRef" :data="menuData" :default-checked-keys="userModel.admin_menu_ids" :props="menuProps" :expand-on-click-node="false" node-key="admin_menu_id" default-expand-all show-checkbox check-strictly highlight-current>
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 用户密码重置 -->
    <el-dialog :title="'密码重置：'+userModel.username" :visible.sync="userDialogPwd" width="65%" top="1vh" :before-close="handleClose">
      <el-form ref="rePwdRef" :rules="rePwdRoles" :model="userModel" label-width="80px" class="dialog-body" :style="{height:height+50+'px'}">
        <el-form-item label="账号">
          <el-input v-model="userModel.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userModel.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="userModel.password" placeholder="请输入新密码" clearable show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userCancelPwd">取消</el-button>
        <el-button type="primary" @click="userSubmitPwd">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import {
  userList,
  userAdd,
  userEdit,
  userDele,
  userInfo,
  userSuperAdmin,
  userProhibit,
  userRule,
  userRuleInfo,
  userPwd,
  roleList,
  menuList
} from '@/api/admin'

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      loadingTime: 0,
      userData: [],
      userCount: 0,
      userQuery: {
        page: 1,
        limit: 13
      },
      userDialog: false,
      userDialogRole: false,
      userDialogPwd: false,
      userModel: {
        dialog_title: '',
        admin_user_id: '',
        admin_role_ids: [],
        username: '',
        nickname: '',
        password: '',
        email: '',
        remark: '',
        sort: '',
        login_region: '',
        is_prohibit: '0',
        is_super_admin: '0'
      },
      userDialogRoleInfo: false,
      roleData: [],
      menuProps: {
        children: 'children',
        label: 'menu_name'
      },
      menuData: [],
      userRoles: {
        username: [{ required: true, message: '必填', trigger: 'blur' }],
        nickname: [{ required: true, message: '必填', trigger: 'blur' }],
        password: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      rePwdRoles: {
        password: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.userList()
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
    handleClose(done) {
      this.userReset()
      done()
    },
    // 用户列表
    userList() {
      this.loadOpen()
      userList(this.userQuery)
        .then(res => {
          this.userData = res.data.list
          this.userCount = res.data.count
          this.loadClose()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    // 用户列表排序
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
    // 用户查询
    userSearch() {
      this.userQuery.page = 1
      this.userList()
    },
    // 用户列表刷新
    userRefresh() {
      this.userQuery = { page: 1, limit: 13 }
      this.userList()
    },
    // 用户添加
    userAddition() {
      this.userDialog = true
      this.userReset()
    },
    // 用户修改
    userModify(row) {
      this.userDialog = true
      userInfo({ admin_user_id: row.admin_user_id }).then(res => {
        this.userReset(res.data)
      })
    },
    // 用户权限分配
    userEditRule(row) {
      this.userDialogRole = true
      this.menuList()
      this.userReset(row)
      this.roleList()
      this.userRuleInfo(row)
    },
    // 用户是否超管
    userIsSuperAdmin(row) {
      this.loadOpen()
      userSuperAdmin(row)
        .then(res => {
          this.message(res.msg)
          this.userList()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    // 用户是否禁用
    userIsProhibit(row) {
      this.loadOpen()
      userProhibit(row)
        .then(res => {
          this.message(res.msg)
          this.userList()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    // 用户权限分配菜单选择
    menuCheck(data, node) {
      this.userModel.admin_menu_id = node.checkedKeys
    },
    // 菜单列表
    menuList() {
      menuList().then(res => {
        this.menuData = res.data.list
      })
    },
    // 用户权限明细
    userEditRuleInfo(row) {
      this.userDialogRoleInfo = true
      this.menuList()
      this.roleList()
      this.userRuleInfo(row)
    },
    // 用户权限信息
    userRuleInfo(row) {
      userRuleInfo({ admin_user_id: row.admin_user_id }).then(res => {
        this.userReset(res.data)
      })
    },
    // 用户密码重置
    userPassword(row) {
      this.userDialogPwd = true
      this.userReset(row)
    },
    // 用户删除
    userDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadOpen()
          userDele({ admin_user_id: row.admin_user_id })
            .then(res => {
              this.message(res.msg)
              this.userReset()
              this.userList()
            })
            .catch(() => {
              this.loadClose()
            })
        })
        .catch(() => {})
    },
    // 角色列表
    roleList() {
      roleList({ page: 1, limit: 9999 }).then(res => {
        this.roleData = res.data.list
      })
    },
    // 用户添加、修改重置
    userReset(row) {
      const data = this.userModel
      data.admin_role_ids = []
      data.admin_menu_ids = []
      data.admin_menu_id = []
      if (row) {
        data.dialog_title = '用户修改：' + row.username
        data.admin_user_id = row.admin_user_id
        data.admin_role_ids = row.admin_role_ids ? row.admin_role_ids : []
        data.admin_menu_ids = row.admin_menu_ids ? row.admin_menu_ids : []
        data.admin_menu_id = row.admin_menu_id ? row.admin_menu_id : []
        data.username = row.username
        data.nickname = row.nickname
        data.password = ''
        data.email = row.email ? row.email : ''
        data.remark = row.remark ? row.remark : ''
        data.sort = row.sort
        data.login_region = row.login_region
        data.create_time = row.create_time ? row.create_time : ''
        data.update_time = row.update_time ? row.update_time : ''
        data.logout_time = row.logout_time ? row.logout_time : ''
        data.avatar = row.avatar ? row.avatar : ''
      } else {
        data.dialog_title = '用户添加'
        data.admin_user_id = ''
        data.admin_role_ids = []
        data.admin_menu_ids = []
        data.admin_menu_id = []
        data.username = ''
        data.nickname = ''
        data.password = ''
        data.email = ''
        data.remark = ''
        data.sort = 200
        data.login_region = ''
      }
    },
    // 用户权限分配取消
    userCancelRule() {
      this.userDialogRole = false
      this.userReset()
    },
    // 用户权限分配提交
    userSubmitRule() {
      this.$refs['roleRef'].validate(valid => {
        if (valid) {
          this.loadOpen()
          userRule(this.userModel)
            .then(res => {
              this.userDialogRole = false
              this.message(res.msg)
              this.userReset()
              this.userList()
            })
            .catch(() => {
              this.loadClose()
            })
        }
      })
    },
    // 用户重置密码取消
    userCancelPwd() {
      this.userDialogPwd = false
      this.userReset()
    },
    // 用户重置密码提交
    userSubmitPwd() {
      this.$refs['rePwdRef'].validate(valid => {
        if (valid) {
          this.loadOpen()
          userPwd(this.userModel)
            .then(res => {
              this.userDialogPwd = false
              this.message(res.msg)
              this.userReset()
              this.userList()
            })
            .catch(() => {
              this.loadClose()
            })
        }
      })
    },
    // 用户添加、修改取消
    userCancel() {
      this.userDialog = false
      this.userReset()
    },
    // 用户添加、修改提交
    userSubmit() {
      this.$refs['userRef'].validate(valid => {
        if (valid) {
          this.loadOpen()
          if (this.userModel.admin_user_id) {
            userEdit(this.userModel)
              .then(res => {
                this.userDialog = false
                this.message(res.msg)
                this.userReset()
                this.userList()
              })
              .catch(() => {
                this.loadClose()
              })
          } else {
            userAdd(this.userModel)
              .then(res => {
                this.userDialog = false
                this.message(res.msg)
                this.userReset()
                this.userList()
              })
              .catch(() => {
                this.loadClose()
              })
          }
        }
      })
    }
  }
}
</script>
