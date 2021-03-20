<template>
  <div class="app-container">
    <!-- 管理员查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="22">
          <el-input v-model="userQuery.username" class="filter-item" style="width: 150px;" placeholder="账号" clearable />
          <el-input v-model="userQuery.nickname" class="filter-item" style="width: 150px;" placeholder="昵称" clearable />
          <el-input v-model="userQuery.email" class="filter-item" style="width: 250px;" placeholder="邮箱" clearable />
          <el-button class="filter-item" type="primary" @click="userSearch()">查询</el-button>
          <el-button class="filter-item" @click="userRefresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="2" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="userAddition()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 管理员列表 -->
    <el-table v-loading="loading" :data="userData" :height="height" style="width: 100%" border @sort-change="userSort">
      <el-table-column prop="admin_user_id" label="管理员ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="username" label="账号" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="nickname" label="昵称" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="email" label="邮箱" min-width="250" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="login_ip" label="登录IP" min-width="130" sortable="custom" />
      <el-table-column prop="login_time" label="登录时间" min-width="160" sortable="custom" />
      <el-table-column prop="login_num" label="登录次数" min-width="105" sortable="custom" />
      <el-table-column prop="sort" label="排序" width="80" sortable="custom" />
      <el-table-column prop="is_admin" label="超管" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_admin" :active-value="1" :inactive-value="0" @change="userIsAdmin(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="80" sortable="custom" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="userIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="285" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userEditRule(row)">权限</el-button>
          <el-button size="mini" type="primary" @click="userPassword(row)">密码</el-button>
          <el-button size="mini" type="success" @click="userModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="userDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 管理员分页 -->
    <pagination v-show="userCount > 0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="userList" />
    <!-- 管理员添加、修改 -->
    <el-dialog :title="userDialogTitle" :visible.sync="userDialog" top="1vh" :before-close="userCancel">
      <el-form ref="userRef" :model="userModel" :rules="userRoles" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item v-if="userModel.admin_user_id && userModel.avatar" label="头像" prop="avatar">
          <el-col :span="10">
            <el-avatar shape="circle" fit="contain" :size="100" :src="userModel.avatar" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center" />
          <el-col :span="10">
            <el-upload
              name="avatar_file"
              :show-file-list="false"
              :before-upload="uploadBefore"
              :action="uploadAction"
              :headers="uploadHeaders"
              :data="uploadData"
              :on-success="uploadSuccess"
            >
              <el-button>更换头像</el-button>
            </el-upload>
            <span>jpg、png图片，小于50kb，宽高1:1</span>
          </el-col>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input key="username" v-model="userModel.username" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input key="nickname" v-model="userModel.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id == ''" label="密码" prop="password">
          <el-input key="password" v-model="userModel.password" placeholder="请输入密码" clearable show-password />
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
        <el-form-item v-if="userModel.admin_user_id" label="登录IP" prop="login_ip">
          <el-col :span="10">
            <el-input v-model="userModel.login_ip" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">登录地区</el-col>
          <el-col :span="10">
            <el-input v-model="userModel.login_region" disabled />
          </el-col>
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id" label="登录时间" prop="login_time">
          <el-col :span="10">
            <el-input v-model="userModel.login_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">退出时间</el-col>
          <el-col :span="10">
            <el-input v-model="userModel.logout_time" disabled />
          </el-col>
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id" label="添加时间" prop="create_time">
          <el-col :span="10">
            <el-input v-model="userModel.create_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">更新时间</el-col>
          <el-col :span="10">
            <el-input v-model="userModel.update_time" disabled />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userCancel">取消</el-button>
        <el-button type="primary" @click="userSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 管理员权限分配 -->
    <el-dialog :title="'权限分配：'+userModel.username" :visible.sync="userDialogRole" top="1vh">
      <el-form ref="roleRef" :model="userModel" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
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
            :data="menuTree"
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
                <i v-if="data.is_role" class="el-icon-s-custom" style="margin-left:10px" title="按角色" />
                <i v-if="data.is_menu" class="el-icon-menu" style="margin-left:10px" title="按菜单" />
                <i v-if="data.menu_url" class="el-icon-link" style="margin-left:10px" :title="data.menu_url" />
                <i v-else class="el-icon-link" style="margin-left:10px;color:#fff" />
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
    <!-- 管理员密码重置 -->
    <el-dialog :title="'密码重置：'+userModel.username" :visible.sync="userDialogPwd" top="1vh">
      <el-form ref="pwdRef" :rules="pwdRoles" :model="userModel" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
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
import { getAdminToken, getAdminUserId } from '@/utils/auth'
import {
  userList,
  userAdd,
  userEdit,
  userDele,
  userAdmin,
  userDisable,
  userRule,
  userPwd
} from '@/api/admin'

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
        login_region: ''
      },
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/AdminUser/userAvatar',
      uploadHeaders: {
        AdminToken: getAdminToken(),
        AdminUserId: getAdminUserId()
      },
      uploadData: { admin_user_id: '' },
      roleData: [],
      menuProps: {
        children: 'children',
        label: 'menu_name'
      },
      menuTree: [],
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
    // 管理员列表
    userList() {
      this.loading = true
      userList(this.userQuery).then(res => {
        this.userData = res.data.list
        this.userCount = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 管理员查询
    userSearch() {
      this.userQuery.page = 1
      this.userList()
    },
    // 管理员刷新
    userRefresh() {
      this.userQuery = this.$options.data().userQuery
      this.userList()
    },
    // 管理员排序
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
    // 管理员数据重置
    userReset() {
      this.userModel = this.$options.data().userModel
      if (this.$refs['userRef'] !== undefined) {
        this.$refs['userRef'].resetFields()
      }
    },
    // 管理员添加打开
    userAddition() {
      this.userDialog = true
      this.userDialogTitle = '管理员添加'
      this.userReset()
    },
    // 管理员修改打开
    userModify(row) {
      this.userDialog = true
      this.userDialogTitle = '管理员修改：' + row.username
      this.userReset()
      userEdit({
        admin_user_id: row.admin_user_id
      }).then(res => {
        this.userModel = res.data.admin_user
      })
    },
    // 管理员修改头像
    uploadBefore(file) {
      this.uploadData.admin_user_id = this.userModel.admin_user_id
    },
    uploadSuccess(res, file) {
      if (res.code === 200) {
        this.userModel.avatar = res.data.avatar
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 管理员删除
    userDelete(row) {
      this.$confirm(
        '确定要删除管理员 <span style="color:red">' + row.username + ' </span>吗？',
        '删除：' + row.admin_user_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        userDele({
          admin_user_id: row.admin_user_id
        }).then(res => {
          this.userList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 管理员是否超管
    userIsAdmin(row) {
      this.loading = true
      userAdmin({
        admin_user_id: row.admin_user_id,
        is_admin: row.is_admin
      }).then(res => {
        this.userList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.userList()
      })
    },
    // 管理员是否禁用
    userIsProhibit(row) {
      this.loading = true
      userDisable({
        admin_user_id: row.admin_user_id,
        is_disable: row.is_disable
      }).then(res => {
        this.userList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.userList()
      })
    },
    // 管理员权限分配打开
    userEditRule(row) {
      this.userDialogRole = true
      userRule({
        admin_user_id: row.admin_user_id
      }).then(res => {
        this.roleData = res.data.admin_role
        this.menuTree = res.data.admin_menu
        this.userModel.username = res.data.username
        this.userModel.nickname = res.data.nickname
        this.userModel.admin_user_id = row.admin_user_id
        this.userModel.admin_role_ids = res.data.admin_role_ids
        this.userModel.admin_menu_ids = res.data.admin_menu_ids
        this.userModel.menu_ids = res.data.menu_ids
      })
    },
    // 管理员权限分配取消
    userCancelRule() {
      this.userDialogRole = false
      this.userReset()
    },
    // 管理员权限分配按菜单
    menuCheck(data, node) {
      this.userModel.admin_menu_ids = node.checkedKeys
    },
    // 管理员权限分配提交
    userSubmitRule() {
      this.$refs['roleRef'].validate(valid => {
        if (valid) {
          this.loading = true
          userRule({
            admin_user_id: this.userModel.admin_user_id,
            admin_role_ids: this.userModel.admin_role_ids,
            admin_menu_ids: this.userModel.admin_menu_ids
          }, 'post').then(res => {
            this.userList()
            this.userDialogRole = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 管理员密码重置打开
    userPassword(row) {
      this.userDialogPwd = true
      this.userModel.admin_user_id = row.admin_user_id
      this.userModel.username = row.username
      this.userModel.nickname = row.nickname
      this.userModel.password = ''
    },
    // 管理员密码重置取消
    userCancelPwd() {
      this.userDialogPwd = false
      this.userReset()
    },
    // 管理员密码重置提交
    userSubmitPwd() {
      this.$refs['pwdRef'].validate(valid => {
        if (valid) {
          this.loading = true
          userPwd({
            admin_user_id: this.userModel.admin_user_id,
            password: this.userModel.password
          }).then(res => {
            this.userList()
            this.userDialogPwd = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 管理员添加、修改取消
    userCancel() {
      this.userReset()
      this.userDialog = false
    },
    // 管理员添加、修改提交
    userSubmit() {
      this.$refs['userRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.userModel.admin_user_id) {
            userEdit(this.userModel, 'post').then(res => {
              this.userList()
              this.userDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            userAdd(this.userModel).then(res => {
              this.userList()
              this.userDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
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
