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
      <el-table-column prop="login_ip" label="登录IP" min-width="130" sortable="custom" />
      <el-table-column prop="login_time" label="登录时间" min-width="160" sortable="custom" />
      <el-table-column prop="login_num" label="登录次数" min-width="105" sortable="custom" />
      <el-table-column prop="sort" label="排序" width="80" sortable="custom" />
      <el-table-column prop="is_admin" label="管理员" min-width="88" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_admin" active-value="1" inactive-value="0" @change="userIsSuperAdmin(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="80" sortable="custom" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" active-value="1" inactive-value="0" @change="userIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="250" align="right" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userEditRule(row)">权限</el-button>
          <el-button size="mini" type="primary" @click="userPassword(row)">密码</el-button>
          <el-button size="mini" type="primary" @click="userModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="userDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户分页 -->
    <pagination v-show="userCount > 0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="userList" />
    <!-- 用户添加、修改 -->
    <el-dialog :title="userDialogTitle" :visible.sync="userDialog" width="65%" top="1vh" :before-close="userCancel">
      <el-form ref="userRef" :model="userModel" :rules="userRoles" class="dialog-body" label-width="100px" :style="{height:height+50+'px'}">
        <el-form-item v-if="userModel.admin_user_id && userModel.avatar" label="头像" prop="avatar">
          <el-avatar shape="circle" fit="contain" :size="100" :src="userModel.avatar" />
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id" label="" prop="avatar_file">
          <el-upload name="avatar_file" :show-file-list="false" :before-upload="uploadBefore" :action="uploadAction" :headers="uploadHeaders" :data="uploadData" :on-success="uploadSuccess">
            <el-button title="jpg、png图片，小于50kb，宽高1:1">更换头像</el-button>
          </el-upload>
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
    <el-dialog :title="'权限分配：'+userModel.username" :visible.sync="userDialogRole" width="65%" top="1vh">
      <el-form ref="roleRef" :model="userModel" label-width="80px" class="dialog-body" :style="{height:height+60+'px'}">
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
            :default-checked-keys="userModel.admin_menu_ids"
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
              <span>{{ node.label }}<i v-if="data.is_check" class="el-icon-check" title="已分配" /></span>
              <span>
                <i v-if="data.is_role" class="el-icon-s-custom" title="按角色" />
                <i v-if="data.is_menu" class="el-icon-menu" title="按菜单" />
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
    <!-- 用户密码重置 -->
    <el-dialog :title="'密码重置：'+userModel.username" :visible.sync="userDialogPwd" width="65%" top="1vh">
      <el-form ref="rePwdRef" :rules="pwdRoles" :model="userModel" label-width="80px" class="dialog-body" :style="{height:height+50+'px'}">
        <el-form-item label="账号">
          <el-input v-model="userModel.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userModel.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="密码" prop="password">
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
  userInfo,
  userAdd,
  userEdit,
  userDele,
  userAdmin,
  userDisable,
  userRule,
  userPwd
} from '@/api/admin'
import { getAdminUserId, getToken } from '@/utils/auth'

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      userData: [],
      userCount: 0,
      userQuery: {
        page: 1,
        limit: 13
      },
      userDialog: false,
      userDialogTitle: '',
      userDialogRole: false,
      userDialogPwd: false,
      userModel: {
        admin_user_id: '',
        admin_role_ids: [],
        admin_menu_ids: [],
        menu_ids: [],
        username: '',
        nickname: '',
        password: '',
        email: '',
        remark: '',
        sort: 200,
        login_region: '',
        is_disable: '0',
        is_admin: '0'
      },
      uploadAction:
        process.env.VUE_APP_BASE_API + '/admin/AdminUser/userAvatar',
      uploadHeaders: {
        AdminToken: getToken(),
        AdminUserId: getAdminUserId()
      },
      uploadData: { admin_user_id: '' },
      roleData: [],
      menuProps: {
        children: 'children',
        label: 'menu_name'
      },
      menuData: [],
      userRoles: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      pwdRoles: {
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.userList()
  },
  methods: {
    // 用户重置
    userReset() {
      this.userModel = this.$options.data().userModel
      if (this.$refs['userRef'] !== undefined) {
        this.$refs['userRef'].resetFields()
      }
    },
    // 用户列表
    userList() {
      this.loading = true
      userList(this.userQuery)
        .then(res => {
          this.userData = res.data.list
          this.userCount = res.data.count
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 用户查询
    userSearch() {
      this.userQuery.page = 1
      this.userList()
    },
    // 用户刷新
    userRefresh() {
      this.userQuery = { page: 1, limit: 13 }
      this.userList()
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
    // 用户添加打开
    userAddition() {
      this.userDialog = true
      this.userDialogTitle = '用户添加'
      this.userReset()
    },
    // 用户修改打开
    userModify(row) {
      this.userDialog = true
      this.userDialogTitle = '用户修改：' + row.username
      this.userReset()
      userInfo({ admin_user_id: row.admin_user_id })
        .then(res => {
          this.userModel = res.data
        })
    },
    // 用户修改头像
    uploadBefore(file) {
      this.uploadData.admin_user_id = this.userModel.admin_user_id
    },
    uploadSuccess(res, file) {
      if (res.code === 200) {
        this.userModel.avatar = res.data.avatar_url
        this.$message({ message: res.msg, type: 'success' })
      } else {
        this.$message({ message: res.msg, type: 'error' })
      }
    },
    // 用户删除
    userDelete(row) {
      this.$confirm(
        '确定要删除用户 <span style="color:red">' + row.username + ' </span>吗？',
        '用户删除确认',
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        })
        .then(() => {
          this.loading = true
          userDele({ admin_user_id: row.admin_user_id })
            .then(res => {
              this.$message({ message: res.msg, type: 'success' })
              this.userList()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },
    // 用户是否管理员
    userIsSuperAdmin(row) {
      this.loading = true
      userAdmin({ admin_user_id: row.admin_user_id, is_admin: row.is_admin })
        .then(res => {
          this.$message({ message: res.msg, type: 'success' })
          this.userList()
        })
        .catch(() => {
          this.userList()
        })
    },
    // 用户是否禁用
    userIsProhibit(row) {
      this.loading = true
      userDisable(row)
        .then(res => {
          this.$message({ message: res.msg, type: 'success' })
          this.userList()
        })
        .catch(() => {
          this.userList()
        })
    },
    // 用户权限分配打开
    userEditRule(row) {
      this.userDialogRole = true
      userRule({ admin_user_id: row.admin_user_id })
        .then(res => {
          this.roleData = res.data.role_data
          this.menuData = res.data.menu_data
          this.userModel.username = res.data.username
          this.userModel.nickname = res.data.nickname
          this.userModel.admin_user_id = row.admin_user_id
          this.userModel.admin_role_ids = res.data.admin_role_ids
          this.userModel.admin_menu_ids = res.data.admin_menu_ids
          this.userModel.menu_ids = res.data.menu_ids
        })
    },
    // 用户权限分配取消
    userCancelRule() {
      this.userDialogRole = false
      this.userReset()
    },
    // 用户权限分配按菜单
    menuCheck(data, node) {
      this.userModel.admin_menu_ids = node.checkedKeys
    },
    // 用户权限分配提交
    userSubmitRule() {
      this.$refs['roleRef'].validate(valid => {
        if (valid) {
          this.loading = true
          userRule({
            admin_user_id: this.userModel.admin_user_id,
            admin_role_ids: this.userModel.admin_role_ids,
            admin_menu_ids: this.userModel.admin_menu_ids
          }, 'post')
            .then(res => {
              this.userDialogRole = false
              this.$message({ message: res.msg, type: 'success' })
              this.userList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 用户密码重置打开
    userPassword(row) {
      this.userDialogPwd = true
      this.userModel.admin_user_id = row.admin_user_id
      this.userModel.username = row.username
      this.userModel.nickname = row.nickname
      this.userModel.password = ''
    },
    // 用户密码重置取消
    userCancelPwd() {
      this.userDialogPwd = false
      this.userReset()
    },
    // 用户密码重置提交
    userSubmitPwd() {
      this.$refs['rePwdRef'].validate(valid => {
        if (valid) {
          this.loading = true
          userPwd({
            admin_user_id: this.userModel.admin_user_id,
            password: this.userModel.password
          })
            .then(res => {
              this.userDialogPwd = false
              this.$message({ message: res.msg, type: 'success' })
              this.userList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 用户添加、修改取消
    userCancel() {
      this.userReset()
      this.userDialog = false
    },
    // 用户添加、修改提交
    userSubmit() {
      this.$refs['userRef'].validate(valid => {
        if (valid) {
          this.loading = true
          var params = {
            admin_user_id: this.userModel.admin_user_id,
            username: this.userModel.username,
            nickname: this.userModel.nickname,
            password: this.userModel.password,
            email: this.userModel.email,
            remark: this.userModel.remark,
            sort: this.userModel.sort
          }
          if (params.admin_user_id) {
            userEdit(params)
              .then(res => {
                this.userDialog = false
                this.$message({ message: res.msg, type: 'success' })
                this.userList()
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            userAdd(params)
              .then(res => {
                this.userDialog = false
                this.$message({ message: res.msg, type: 'success' })
                this.userList()
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
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
