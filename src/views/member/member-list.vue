<template>
  <div class="app-container">
    <!-- 会员查询 -->
    <div class="filter-container">
      <el-input v-model="memberQuery.username" class="filter-item" style="width: 150px;" placeholder="账号" clearable />
      <el-input v-model="memberQuery.nickname" class="filter-item" style="width: 150px;" placeholder="昵称" clearable />
      <el-input v-model="memberQuery.phone" class="filter-item" style="width: 150px;" placeholder="手机" clearable />
      <el-input v-model="memberQuery.email" class="filter-item" style="width: 250px;" placeholder="邮箱" clearable />
      <el-button class="filter-item" type="primary" @click="memberSearch">查询</el-button>
      <el-button class="filter-item" type="primary" style="float:right;margin-left:10px" @click="memberAddition">添加</el-button>
      <el-button class="filter-item" type="primary" style="float:right;" @click="memberRefresh">刷新</el-button>
    </div>
    <!-- 会员列表 -->
    <el-table v-loading="loading" :data="memberData" :height="height" style="width: 100%" border @sort-change="memberSort">
      <el-table-column prop="member_id" label="ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="username" label="账号" min-width="120" sortable="custom" />
      <el-table-column prop="nickname" label="昵称" min-width="120" sortable="custom" />
      <el-table-column prop="phone" label="手机" min-width="120" sortable="custom" />
      <el-table-column prop="email" label="邮箱" min-width="200" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="create_time" label="注册时间" min-width="160" sortable="custom" />
      <el-table-column prop="login_time" label="登录时间" min-width="160" sortable="custom" />
      <el-table-column prop="remark" label="备注" min-width="110" />
      <el-table-column prop="sort" label="排序" width="80" sortable="custom" />
      <el-table-column prop="is_disable" label="禁用" min-width="80" sortable="custom" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" active-value="1" inactive-value="0" @change="userIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="220" align="right" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="memberPassword(row)">密码</el-button>
          <el-button size="mini" type="primary" @click="memberModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="memberDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 会员分页 -->
    <pagination v-show="memberCount > 0" :total="memberCount" :page.sync="memberQuery.page" :limit.sync="memberQuery.limit" @pagination="memberList" />
    <!-- 会员添加、修改 -->
    <el-dialog :title="memberDialogTitle" :visible.sync="memberDialog" width="65%" top="1vh" :before-close="memberCancel">
      <el-form ref="userRef" :model="memberModel" :rules="memberRoles" class="dialog-body" label-width="100px" :style="{height:height+50+'px'}">
        <el-form-item v-if="memberModel.member_id" label="头像" prop="avatar">
          <el-avatar shape="circle" fit="contain" :size="100" :src="memberModel.avatar" />
        </el-form-item>
        <el-form-item v-if="memberModel.member_id" label="" prop="avatar_file">
          <el-upload name="avatar_file" :show-file-list="false" :before-upload="uploadBefore" :action="uploadAction" :headers="uploadHeaders" :data="uploadData" :on-success="uploadSuccess">
            <el-button title="jpg、png图片，小于100kb，宽高1:1">更换头像</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input key="username" v-model="memberModel.username" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input key="nickname" v-model="memberModel.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="memberModel.member_id == ''" label="密码" prop="password">
          <el-input key="password" v-model="memberModel.password" placeholder="请输入密码" clearable show-password />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="memberModel.phone" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="memberModel.email" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="memberModel.remark" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="memberModel.sort" type="number" />
        </el-form-item>
        <el-form-item v-if="memberModel.member_id" label="登录地区" prop="login_region">
          <el-input v-model="memberModel.login_region" disabled />
        </el-form-item>
        <el-form-item v-if="memberModel.member_id" label="添加时间" prop="create_time">
          <el-input v-model="memberModel.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="memberModel.member_id" label="更新时间" prop="update_time">
          <el-input v-model="memberModel.update_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="memberCancel">取消</el-button>
        <el-button type="primary" @click="userSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 会员密码重置 -->
    <el-dialog :title="'密码重置：'+memberModel.username" :visible.sync="memberDialogPwd" width="65%" top="1vh">
      <el-form ref="rePwdRef" :rules="memberPwdRoles" :model="memberModel" label-width="80px" class="dialog-body" :style="{height:height+50+'px'}">
        <el-form-item label="账号">
          <el-input v-model="memberModel.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="memberModel.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="memberModel.password" placeholder="请输入新密码" clearable show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="memberCancelPwd">取消</el-button>
        <el-button type="primary" @click="userSubmitPwd">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import {
  memberList,
  memberInfo,
  memberAdd,
  memberEdit,
  memberDele,
  memberPassword,
  memberDisable

} from '@/api/member'
import { getAdminUserId, getToken } from '@/utils/auth'

export default {
  name: 'MemberList',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      memberData: [],
      memberCount: 0,
      memberQuery: {
        page: 1,
        limit: 13
      },
      memberDialog: false,
      memberDialogTitle: '',
      memberDialogPwd: false,
      memberModel: {
        member_id: '',
        username: '',
        nickname: '',
        password: '',
        phone: '',
        email: '',
        remark: '',
        sort: 10000,
        login_region: '',
        is_disable: '0'
      },
      uploadAction:
        process.env.VUE_APP_BASE_API + '/admin/Member/memberAvatar',
      uploadHeaders: {
        AdminToken: getToken(),
        AdminUserId: getAdminUserId()
      },
      uploadData: { member_id: '' },
      memberRoles: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      memberPwdRoles: {
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.memberList()
  },
  methods: {
    // 会员重置
    userReset() {
      this.memberModel = this.$options.data().memberModel
      if (this.$refs['userRef'] !== undefined) {
        this.$refs['userRef'].resetFields()
      }
    },
    // 会员列表
    memberList() {
      this.loading = true
      memberList(this.memberQuery)
        .then(res => {
          this.memberData = res.data.list
          this.memberCount = res.data.count
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 会员查询
    memberSearch() {
      this.memberQuery.page = 1
      this.memberList()
    },
    // 会员刷新
    memberRefresh() {
      this.memberQuery = { page: 1, limit: 13 }
      this.memberList()
    },
    // 会员排序
    memberSort(sort) {
      this.memberQuery.sort_field = sort.prop
      this.memberQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.memberQuery.sort_type = 'asc'
        this.memberList()
      }
      if (sort.order === 'descending') {
        this.memberQuery.sort_type = 'desc'
        this.memberList()
      }
    },
    // 会员添加打开
    memberAddition() {
      this.memberDialog = true
      this.memberDialogTitle = '会员添加'
      this.userReset()
    },
    // 会员修改打开
    memberModify(row) {
      this.memberDialog = true
      this.memberDialogTitle = '会员修改：' + row.username
      this.userReset()
      memberInfo({ member_id: row.member_id })
        .then(res => {
          this.memberModel = res.data
        })
        .catch(() => {
        })
    },
    // 会员修改头像
    uploadBefore(file) {
      this.uploadData.member_id = this.memberModel.member_id
    },
    uploadSuccess(res, file) {
      if (res.code === 200) {
        this.memberModel.avatar = res.data.avatar
        this.$message({ message: res.msg, type: 'success' })
      } else {
        this.$message({ message: res.msg, type: 'error' })
      }
    },
    // 会员删除
    memberDelete(row) {
      this.$confirm(
        '确定要删除会员 <span style="color:red">' + row.username + ' </span>吗？',
        '会员删除确认',
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        })
        .then(() => {
          this.loading = true
          memberDele({ member_id: row.member_id })
            .then(res => {
              this.$message({ message: res.msg, type: 'success' })
              this.memberList()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },
    // 会员是否禁用
    userIsProhibit(row) {
      this.loading = true
      memberDisable(row)
        .then(res => {
          this.$message({ message: res.msg, type: 'success' })
          this.memberList()
        })
        .catch(() => {
          this.memberList()
        })
    },
    // 会员密码重置打开
    memberPassword(row) {
      this.memberDialogPwd = true
      this.memberModel.member_id = row.member_id
      this.memberModel.username = row.username
      this.memberModel.nickname = row.nickname
      this.memberModel.password = ''
    },
    // 会员密码重置取消
    memberCancelPwd() {
      this.memberDialogPwd = false
      this.userReset()
    },
    // 会员密码重置提交
    userSubmitPwd() {
      this.$refs['rePwdRef'].validate(valid => {
        if (valid) {
          this.loading = true
          memberPassword({
            member_id: this.memberModel.member_id,
            password: this.memberModel.password
          })
            .then(res => {
              this.memberDialogPwd = false
              this.$message({ message: res.msg, type: 'success' })
              this.memberList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 会员添加、修改取消
    memberCancel() {
      this.userReset()
      this.memberDialog = false
    },
    // 会员添加、修改提交
    userSubmit() {
      this.$refs['userRef'].validate(valid => {
        if (valid) {
          this.loading = true
          var params = {
            member_id: this.memberModel.member_id,
            username: this.memberModel.username,
            nickname: this.memberModel.nickname,
            password: this.memberModel.password,
            phone: this.memberModel.phone,
            email: this.memberModel.email,
            remark: this.memberModel.remark,
            sort: this.memberModel.sort
          }
          if (params.member_id) {
            memberEdit(params)
              .then(res => {
                this.memberDialog = false
                this.$message({ message: res.msg, type: 'success' })
                this.memberList()
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            memberAdd(params)
              .then(res => {
                this.memberDialog = false
                this.$message({ message: res.msg, type: 'success' })
                this.memberList()
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
