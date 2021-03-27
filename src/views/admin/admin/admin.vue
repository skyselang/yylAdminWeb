<template>
  <div class="app-container">
    <!-- 管理员查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="22">
          <el-input v-model="adminQuery.username" class="filter-item" style="width: 150px;" placeholder="账号" clearable />
          <el-input v-model="adminQuery.nickname" class="filter-item" style="width: 150px;" placeholder="昵称" clearable />
          <el-input v-model="adminQuery.email" class="filter-item" style="width: 250px;" placeholder="邮箱" clearable />
          <el-button class="filter-item" type="primary" @click="adminSearch()">查询</el-button>
          <el-button class="filter-item" @click="adminRefresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="2" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="adminAddition()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 管理员列表 -->
    <el-table v-loading="loading" :data="adminData" :height="height" style="width: 100%" border @sort-change="adminSort">
      <el-table-column prop="admin_admin_id" label="管理员ID" min-width="105" sortable="custom" fixed="left" />
      <el-table-column prop="username" label="账号" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="nickname" label="昵称" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="email" label="邮箱" min-width="250" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="phone" label="手机" min-width="110" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="login_ip" label="登录IP" min-width="130" sortable="custom" />
      <el-table-column prop="login_time" label="登录时间" min-width="160" sortable="custom" />
      <el-table-column prop="login_num" label="登录次数" min-width="105" sortable="custom" />
      <el-table-column prop="sort" label="排序" width="75" sortable="custom" />
      <el-table-column prop="is_admin" label="超管" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_admin" :active-value="1" :inactive-value="0" @change="adminIsAdmin(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="80" sortable="custom" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="adminIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="280" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="adminEditRule(row)">权限</el-button>
          <el-button size="mini" type="primary" @click="adminPassword(row)">密码</el-button>
          <el-button size="mini" type="success" @click="adminModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="adminDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 管理员分页 -->
    <pagination v-show="adminCount > 0" :total="adminCount" :page.sync="adminQuery.page" :limit.sync="adminQuery.limit" @pagination="adminList" />
    <!-- 管理员添加、修改 -->
    <el-dialog :title="adminDialogTitle" :visible.sync="adminDialog" top="1vh" :before-close="adminCancel">
      <el-form ref="adminRef" :model="adminModel" :rules="adminRoles" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item v-if="adminModel.admin_admin_id && adminModel.avatar" label="头像" prop="avatar">
          <el-col :span="10">
            <el-avatar shape="circle" fit="contain" :size="100" :src="adminModel.avatar" />
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
          <el-input key="username" v-model="adminModel.username" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input key="nickname" v-model="adminModel.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="adminModel.admin_admin_id == ''" label="密码" prop="password">
          <el-input key="password" v-model="adminModel.password" placeholder="请输入密码" clearable show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="adminModel.email" clearable />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="adminModel.phone" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="adminModel.remark" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="adminModel.sort" type="number" />
        </el-form-item>
        <el-form-item v-if="adminModel.admin_admin_id" label="登录IP" prop="login_ip">
          <el-col :span="10">
            <el-input v-model="adminModel.login_ip" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">登录地区</el-col>
          <el-col :span="10">
            <el-input v-model="adminModel.login_region" disabled />
          </el-col>
        </el-form-item>
        <el-form-item v-if="adminModel.admin_admin_id" label="登录时间" prop="login_time">
          <el-col :span="10">
            <el-input v-model="adminModel.login_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">退出时间</el-col>
          <el-col :span="10">
            <el-input v-model="adminModel.logout_time" disabled />
          </el-col>
        </el-form-item>
        <el-form-item v-if="adminModel.admin_admin_id" label="添加时间" prop="create_time">
          <el-col :span="10">
            <el-input v-model="adminModel.create_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">更新时间</el-col>
          <el-col :span="10">
            <el-input v-model="adminModel.update_time" disabled />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adminCancel">取消</el-button>
        <el-button type="primary" @click="adminSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 管理员权限分配 -->
    <el-dialog :title="'管理员权限分配：'+adminModel.username" :visible.sync="adminDialogRole" top="1vh">
      <el-form ref="roleRef" :model="adminModel" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item label="账号">
          <el-input v-model="adminModel.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="adminModel.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="按角色">
          <el-checkbox-group v-model="adminModel.admin_role_ids">
            <el-checkbox v-for="item in roleData" :key="item.admin_role_id" :label="item.admin_role_id">{{ item.role_name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="按菜单">
          <el-tree
            ref="menuRef"
            :data="menuTree"
            :default-checked-keys="adminModel.admin_menu_ids"
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
        <el-button @click="adminCancelRule">取消</el-button>
        <el-button type="primary" @click="adminSubmitRule">提交</el-button>
      </div>
    </el-dialog>
    <!-- 管理员密码重置 -->
    <el-dialog :title="'管理员密码重置：'+adminModel.username" :visible.sync="adminDialogPwd" top="1vh">
      <el-form ref="pwdRef" :rules="adminPwdRules" :model="adminModel" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item label="账号">
          <el-input v-model="adminModel.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="adminModel.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adminModel.password" placeholder="请输入新密码" clearable show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adminCancelPwd">取消</el-button>
        <el-button type="primary" @click="adminSubmitPwd">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { getAdminToken, getAdminAdminId } from '@/utils/auth'
import {
  adminList,
  adminAdd,
  adminEdit,
  adminDele,
  adminAdmin,
  adminDisable,
  adminRule,
  adminPwd
} from '@/api/admin'

export default {
  name: 'Admin',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      adminData: [],
      adminCount: 0,
      adminQuery: {
        page: 1,
        limit: 13
      },
      adminDialog: false,
      adminDialogTitle: '',
      adminDialogRole: false,
      adminDialogPwd: false,
      adminModel: {
        admin_admin_id: '',
        admin_role_ids: [],
        admin_menu_ids: [],
        menu_ids: [],
        username: '',
        nickname: '',
        password: '',
        email: '',
        phone: '',
        remark: '',
        sort: 200,
        login_region: ''
      },
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/AdminAdmin/adminAvatar',
      uploadHeaders: {
        AdminToken: getAdminToken(),
        AdminAdminId: getAdminAdminId()
      },
      uploadData: { admin_admin_id: '' },
      roleData: [],
      menuProps: {
        children: 'children',
        label: 'menu_name'
      },
      menuTree: [],
      adminRoles: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      adminPwdRules: {
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.adminList()
  },
  methods: {
    // 管理员列表
    adminList() {
      this.loading = true
      adminList(this.adminQuery).then(res => {
        this.adminData = res.data.list
        this.adminCount = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 管理员查询
    adminSearch() {
      this.adminQuery.page = 1
      this.adminList()
    },
    // 管理员刷新
    adminRefresh() {
      this.adminQuery = this.$options.data().adminQuery
      this.adminList()
    },
    // 管理员排序
    adminSort(sort) {
      this.adminQuery.sort_field = sort.prop
      this.adminQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.adminQuery.sort_type = 'asc'
        this.adminList()
      }
      if (sort.order === 'descending') {
        this.adminQuery.sort_type = 'desc'
        this.adminList()
      }
    },
    // 管理员数据重置
    adminReset() {
      this.adminModel = this.$options.data().adminModel
      if (this.$refs['adminRef'] !== undefined) {
        this.$refs['adminRef'].resetFields()
      }
    },
    // 管理员添加打开
    adminAddition() {
      this.adminDialog = true
      this.adminDialogTitle = '管理员添加'
      this.adminReset()
    },
    // 管理员修改打开
    adminModify(row) {
      this.adminDialog = true
      this.adminDialogTitle = '管理员修改：' + row.username
      this.adminReset()
      adminEdit({
        admin_admin_id: row.admin_admin_id
      }).then(res => {
        this.adminModel = res.data.admin_admin
      })
    },
    // 管理员修改头像
    uploadBefore(file) {
      this.uploadData.admin_admin_id = this.adminModel.admin_admin_id
    },
    uploadSuccess(res, file) {
      if (res.code === 200) {
        this.adminModel.avatar = res.data.avatar
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 管理员删除
    adminDelete(row) {
      this.$confirm(
        '确定要删除管理员 <span style="color:red">' + row.username + ' </span>吗？',
        '删除：' + row.admin_admin_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        adminDele({
          admin_admin_id: row.admin_admin_id
        }).then(res => {
          this.adminList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 管理员是否超管
    adminIsAdmin(row) {
      this.loading = true
      adminAdmin({
        admin_admin_id: row.admin_admin_id,
        is_admin: row.is_admin
      }).then(res => {
        this.adminList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.adminList()
      })
    },
    // 管理员是否禁用
    adminIsProhibit(row) {
      this.loading = true
      adminDisable({
        admin_admin_id: row.admin_admin_id,
        is_disable: row.is_disable
      }).then(res => {
        this.adminList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.adminList()
      })
    },
    // 管理员权限分配打开
    adminEditRule(row) {
      this.adminDialogRole = true
      adminRule({
        admin_admin_id: row.admin_admin_id
      }).then(res => {
        this.roleData = res.data.admin_role
        this.menuTree = res.data.admin_menu
        this.adminModel.username = res.data.username
        this.adminModel.nickname = res.data.nickname
        this.adminModel.admin_admin_id = row.admin_admin_id
        this.adminModel.admin_role_ids = res.data.admin_role_ids
        this.adminModel.admin_menu_ids = res.data.admin_menu_ids
        this.adminModel.menu_ids = res.data.menu_ids
      })
    },
    // 管理员权限分配取消
    adminCancelRule() {
      this.adminDialogRole = false
      this.adminReset()
    },
    // 管理员权限分配按菜单
    menuCheck(data, node) {
      this.adminModel.admin_menu_ids = node.checkedKeys
    },
    // 管理员权限分配提交
    adminSubmitRule() {
      this.$refs['roleRef'].validate(valid => {
        if (valid) {
          this.loading = true
          adminRule({
            admin_admin_id: this.adminModel.admin_admin_id,
            admin_role_ids: this.adminModel.admin_role_ids,
            admin_menu_ids: this.adminModel.admin_menu_ids
          }, 'post').then(res => {
            this.adminList()
            this.adminDialogRole = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 管理员密码重置打开
    adminPassword(row) {
      this.adminDialogPwd = true
      this.adminModel.admin_admin_id = row.admin_admin_id
      this.adminModel.username = row.username
      this.adminModel.nickname = row.nickname
      this.adminModel.password = ''
    },
    // 管理员密码重置取消
    adminCancelPwd() {
      this.adminDialogPwd = false
      this.adminReset()
    },
    // 管理员密码重置提交
    adminSubmitPwd() {
      this.$refs['pwdRef'].validate(valid => {
        if (valid) {
          this.loading = true
          adminPwd({
            admin_admin_id: this.adminModel.admin_admin_id,
            password: this.adminModel.password
          }).then(res => {
            this.adminList()
            this.adminDialogPwd = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 管理员添加、修改取消
    adminCancel() {
      this.adminReset()
      this.adminDialog = false
    },
    // 管理员添加、修改提交
    adminSubmit() {
      this.$refs['adminRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.adminModel.admin_admin_id) {
            adminEdit(this.adminModel, 'post').then(res => {
              this.adminList()
              this.adminDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            adminAdd(this.adminModel).then(res => {
              this.adminList()
              this.adminDialog = false
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
