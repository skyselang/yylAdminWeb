<template>
  <div class="app-container">
    <!-- 用户查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="23">
          <el-input v-model="userQuery.user_id" class="filter-item" style="width: 150px;" placeholder="用户ID" clearable />
          <el-input v-model="userQuery.username" class="filter-item" style="width: 150px;" placeholder="账号" clearable />
          <el-input v-model="userQuery.phone" class="filter-item" style="width: 150px;" placeholder="手机" clearable />
          <el-input v-model="userQuery.email" class="filter-item" style="width: 250px;" placeholder="邮箱" clearable />
          <el-select v-model="userQuery.date_type" class="filter-item" style="width:110px;" placeholder="日期类型" clearable>
            <el-option value="create_time" label="注册时间" />
            <el-option value="login_time" label="登录时间" />
            <el-option value="update_time" label="更新时间" />
          </el-select>
          <el-date-picker
            v-model="userQuery.date_range"
            type="daterange"
            class="filter-item"
            style="width: 240px;"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="userSearch()">查询</el-button>
          <el-button class="filter-item" @click="userRefresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="1" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="userAddition()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 用户列表 -->
    <el-table v-loading="loading" :data="userData" :height="height" style="width: 100%" border @sort-change="userSort">
      <el-table-column prop="user_id" label="用户ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="username" label="账号" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="nickname" label="昵称" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="phone" label="手机" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="email" label="邮箱" min-width="220" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="create_time" label="注册时间" min-width="160" sortable="custom" />
      <el-table-column prop="login_time" label="登录时间" min-width="160" sortable="custom" />
      <el-table-column prop="remark" label="备注" min-width="110" show-overflow-tooltip />
      <el-table-column prop="sort" label="排序" width="80" sortable="custom" />
      <el-table-column prop="is_disable" label="禁用" min-width="80" sortable="custom" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="userIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="210" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userPassword(row)">密码</el-button>
          <el-button size="mini" type="success" @click="userModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="userDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户分页 -->
    <pagination v-show="userCount > 0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="userList" />
    <!-- 用户添加、修改 -->
    <el-dialog :title="userDialogTitle" :visible.sync="userDialog" top="1vh" :before-close="userCancel">
      <el-form ref="userRef" :model="userModel" :rules="userRules" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item v-if="userModel.user_id" label="头像" prop="avatar">
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
            <span>jpg、png图片，小于100KB，宽高1:1</span>
          </el-col>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input key="username" v-model="userModel.username" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input key="nickname" v-model="userModel.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="userModel.user_id == ''" label="密码" prop="password">
          <el-input key="password" v-model="userModel.password" placeholder="请输入密码" clearable show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userModel.email" clearable />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="userModel.phone" clearable />
        </el-form-item>
        <el-form-item label="地区" prop="region_id">
          <el-cascader v-model="userModel.region_id" :options="regionTree" :props="regionProps" placeholder="" style="width:100%" @change="regionChange" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userModel.remark" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="userModel.sort" type="number" />
        </el-form-item>
        <el-form-item v-if="userModel.user_id" label="登录时间" prop="login_time">
          <el-col :span="10">
            <el-input v-model="userModel.login_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">登录地区</el-col>
          <el-col :span="10">
            <el-input v-model="userModel.login_region" disabled />
          </el-col>
        </el-form-item>
        <el-form-item v-if="userModel.user_id" label="注册时间" prop="create_time">
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
    <!-- 用户密码重置 -->
    <el-dialog :title="'密码重置：'+userModel.username" :visible.sync="userPwdDialog" top="1vh" :before-close="userCancelPwd">
      <el-form ref="userPwdRef" :rules="userPwdRules" :model="userModel" label-width="100px" class="dialog-body" :style="{height:height+30+'px'}">
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
import { getAdminUserId, getAdminToken } from '@/utils/auth'
import {
  userList,
  userAdd,
  userEdit,
  userDele,
  userDisable,
  userPassword
} from '@/api/user'

export default {
  name: 'UserList',
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
      userPwdDialog: false,
      userModel: {
        user_id: '',
        username: '',
        nickname: '',
        password: '',
        email: '',
        phone: '',
        region_id: '',
        avatar: '',
        remark: '',
        sort: 10000,
        login_region: ''
      },
      regionTree: [],
      regionProps: {
        expandTrigger: 'click',
        checkStrictly: true,
        value: 'region_id',
        label: 'region_name'
      },
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/User/userAvatar',
      uploadHeaders: {
        AdminToken: getAdminToken(),
        AdminUserId: getAdminUserId()
      },
      uploadData: { user_id: '' },
      userRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      userPwdRules: {
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.userList()
  },
  methods: {
    // 用户列表
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
    // 用户查询
    userSearch() {
      this.userQuery.page = 1
      this.userList()
    },
    // 用户刷新
    userRefresh() {
      this.userQuery = this.$options.data().userQuery
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
    // 用户信息重置
    userModelReset() {
      this.userModel = this.$options.data().userModel
      if (this.$refs['userRef'] !== undefined) {
        this.$refs['userRef'].resetFields()
      }
    },
    // 用户地区选择
    regionChange(value) {
      if (value) {
        this.userModel.region_id = value[value.length - 1]
      }
    },
    // 用户添加打开
    userAddition() {
      this.userDialog = true
      this.userDialogTitle = '用户添加'
      userAdd().then(res => {
        this.regionTree = res.data.region_tree
      })
      this.userModelReset()
    },
    // 用户修改打开
    userModify(row) {
      this.userDialog = true
      this.userDialogTitle = '用户修改：' + row.username
      userEdit({
        user_id: row.user_id
      }).then(res => {
        this.userModel = res.data.user_info
        this.regionTree = res.data.region_tree
      })
    },
    // 用户修改头像
    uploadBefore(file) {
      this.uploadData.user_id = this.userModel.user_id
    },
    uploadSuccess(res, file) {
      if (res.code === 200) {
        this.userModel.avatar = res.data.avatar
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 用户删除
    userDelete(row) {
      this.$confirm(
        '确定要删除用户 <span style="color:red">' + row.username + ' </span>吗？',
        '删除：' + row.user_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        userDele({
          user_id: row.user_id
        }).then(res => {
          this.userList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 用户是否禁用
    userIsProhibit(row) {
      this.loading = true
      userDisable(row).then(res => {
        this.userList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.userList()
      })
    },
    // 用户密码重置打开
    userPassword(row) {
      this.userPwdDialog = true
      this.userModel.user_id = row.user_id
      this.userModel.username = row.username
      this.userModel.nickname = row.nickname
      this.userModel.password = ''
    },
    // 用户密码重置取消
    userCancelPwd() {
      this.userPwdDialog = false
      this.userModelReset()
    },
    // 用户密码重置提交
    userSubmitPwd() {
      this.$refs['userPwdRef'].validate(valid => {
        if (valid) {
          this.loading = true
          userPassword({
            user_id: this.userModel.user_id,
            password: this.userModel.password
          }).then(res => {
            this.userList()
            this.userPwdDialog = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 用户添加、修改取消
    userCancel() {
      this.userModelReset()
      this.userDialog = false
    },
    // 用户添加、修改提交
    userSubmit() {
      this.$refs['userRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.userModel.user_id) {
            userEdit(this.userModel, 'post').then(res => {
              this.userList()
              this.userDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            userAdd(this.userModel, 'post').then(res => {
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
