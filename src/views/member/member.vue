<template>
  <div class="app-container">
    <!-- 会员查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="23">
          <el-input v-model="memberQuery.member_id" class="filter-item" style="width: 150px;" placeholder="会员ID" clearable />
          <el-input v-model="memberQuery.username" class="filter-item" style="width: 150px;" placeholder="账号" clearable />
          <el-input v-model="memberQuery.phone" class="filter-item" style="width: 150px;" placeholder="手机" clearable />
          <el-input v-model="memberQuery.email" class="filter-item" style="width: 250px;" placeholder="邮箱" clearable />
          <el-select v-model="memberQuery.date_type" class="filter-item" style="width:110px;" placeholder="日期类型" clearable>
            <el-option value="create_time" label="注册时间" />
            <el-option value="login_time" label="登录时间" />
            <el-option value="update_time" label="更新时间" />
          </el-select>
          <el-date-picker
            v-model="memberQuery.date_range"
            type="daterange"
            class="filter-item"
            style="width: 240px;"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="memberSearch()">查询</el-button>
          <el-button class="filter-item" @click="memberRefresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="1" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="memberAddition()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 会员列表 -->
    <el-table v-loading="loading" :data="memberData" :height="height" style="width: 100%" border @sort-change="memberSort">
      <el-table-column prop="member_id" label="会员ID" min-width="100" sortable="custom" fixed="left" />
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
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="memberIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="210" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="memberPassword(row)">密码</el-button>
          <el-button size="mini" type="success" @click="memberModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="memberDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 会员分页 -->
    <pagination v-show="memberCount > 0" :total="memberCount" :page.sync="memberQuery.page" :limit.sync="memberQuery.limit" @pagination="memberList" />
    <!-- 会员添加、修改 -->
    <el-dialog :title="memberDialogTitle" :visible.sync="memberDialog" top="1vh" :before-close="memberCancel">
      <el-form ref="memberRef" :model="memberModel" :rules="memberRules" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item v-if="memberModel.member_id" label="头像" prop="avatar">
          <el-col :span="10">
            <el-avatar shape="circle" fit="contain" :size="100" :src="memberModel.avatar" />
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
          <el-input key="username" v-model="memberModel.username" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input key="nickname" v-model="memberModel.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="memberModel.member_id == ''" label="密码" prop="password">
          <el-input key="password" v-model="memberModel.password" placeholder="请输入密码" clearable show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="memberModel.email" clearable />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="memberModel.phone" clearable />
        </el-form-item>
        <el-form-item label="地区" prop="region_id">
          <el-cascader v-model="memberModel.region_id" :options="regionTree" :props="regionProps" placeholder="" style="width:100%" @change="regionChange" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="memberModel.remark" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="memberModel.sort" type="number" />
        </el-form-item>
        <el-form-item v-if="memberModel.member_id" label="登录时间" prop="login_time">
          <el-col :span="10">
            <el-input v-model="memberModel.login_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">登录地区</el-col>
          <el-col :span="10">
            <el-input v-model="memberModel.login_region" disabled />
          </el-col>
        </el-form-item>
        <el-form-item v-if="memberModel.member_id" label="注册时间" prop="create_time">
          <el-col :span="10">
            <el-input v-model="memberModel.create_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">更新时间</el-col>
          <el-col :span="10">
            <el-input v-model="memberModel.update_time" disabled />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="memberCancel">取消</el-button>
        <el-button type="primary" @click="memberSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 会员密码重置 -->
    <el-dialog :title="'密码重置：'+memberModel.username" :visible.sync="memberPwdDialog" top="1vh" :before-close="memberCancelPwd">
      <el-form ref="memberPwdRef" :rules="memberPwdRules" :model="memberModel" label-width="100px" class="dialog-body" :style="{height:height+30+'px'}">
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
        <el-button type="primary" @click="memberSubmitPwd">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { getAdminUserId, getAdminToken } from '@/utils/auth'
import {
  memberList,
  memberAdd,
  memberEdit,
  memberDele,
  memberDisable,
  memberPassword
} from '@/api/member'

export default {
  name: 'Member',
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
      memberPwdDialog: false,
      memberModel: {
        member_id: '',
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
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/Member/memberAvatar',
      uploadHeaders: {
        AdminToken: getAdminToken(),
        AdminUserId: getAdminUserId()
      },
      uploadData: { member_id: '' },
      memberRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      memberPwdRules: {
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.memberList()
  },
  methods: {
    // 会员列表
    memberList() {
      this.loading = true
      memberList(this.memberQuery).then(res => {
        this.memberData = res.data.list
        this.memberCount = res.data.count
        this.loading = false
      }).catch(() => {
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
      this.memberQuery = this.$options.data().memberQuery
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
    // 会员信息重置
    memberModelReset() {
      this.memberModel = this.$options.data().memberModel
      if (this.$refs['memberRef'] !== undefined) {
        this.$refs['memberRef'].resetFields()
      }
    },
    // 会员地区选择
    regionChange(value) {
      if (value) {
        this.memberModel.region_id = value[value.length - 1]
      }
    },
    // 会员添加打开
    memberAddition() {
      this.memberDialog = true
      this.memberDialogTitle = '会员添加'
      memberAdd().then(res => {
        this.regionTree = res.data.region_tree
      })
      this.memberModelReset()
    },
    // 会员修改打开
    memberModify(row) {
      this.memberDialog = true
      this.memberDialogTitle = '会员修改：' + row.username
      memberEdit({
        member_id: row.member_id
      }).then(res => {
        this.memberModel = res.data.member_info
        this.regionTree = res.data.region_tree
      })
    },
    // 会员修改头像
    uploadBefore(file) {
      this.uploadData.member_id = this.memberModel.member_id
    },
    uploadSuccess(res, file) {
      if (res.code === 200) {
        this.memberModel.avatar = res.data.avatar
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 会员删除
    memberDelete(row) {
      this.$confirm(
        '确定要删除会员 <span style="color:red">' + row.username + ' </span>吗？',
        '删除：' + row.member_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        memberDele({
          member_id: row.member_id
        }).then(res => {
          this.memberList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 会员是否禁用
    memberIsProhibit(row) {
      this.loading = true
      memberDisable(row).then(res => {
        this.memberList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.memberList()
      })
    },
    // 会员密码重置打开
    memberPassword(row) {
      this.memberPwdDialog = true
      this.memberModel.member_id = row.member_id
      this.memberModel.username = row.username
      this.memberModel.nickname = row.nickname
      this.memberModel.password = ''
    },
    // 会员密码重置取消
    memberCancelPwd() {
      this.memberPwdDialog = false
      this.memberModelReset()
    },
    // 会员密码重置提交
    memberSubmitPwd() {
      this.$refs['memberPwdRef'].validate(valid => {
        if (valid) {
          this.loading = true
          memberPassword({
            member_id: this.memberModel.member_id,
            password: this.memberModel.password
          }).then(res => {
            this.memberList()
            this.memberPwdDialog = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 会员添加、修改取消
    memberCancel() {
      this.memberModelReset()
      this.memberDialog = false
    },
    // 会员添加、修改提交
    memberSubmit() {
      this.$refs['memberRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.memberModel.member_id) {
            memberEdit(this.memberModel, 'post').then(res => {
              this.memberList()
              this.memberDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            memberAdd(this.memberModel, 'post').then(res => {
              this.memberList()
              this.memberDialog = false
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
