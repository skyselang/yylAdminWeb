<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24" :md="12">
          <el-form ref="userRef" :rules="userRules" :model="userModel" class="dialog-body" label-width="100px">
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
            <el-form-item v-if="userModel.admin_user_id" label="添加时间" prop="create_time">
              <el-input v-model="userModel.create_time" placeholder="" />
            </el-form-item>
            <el-form-item v-if="userModel.admin_user_id" label="更新时间" prop="update_time">
              <el-input v-model="userModel.update_time" placeholder="" />
            </el-form-item>
            <el-form-item v-if="userModel.admin_user_id" label="登录时间" prop="update_time">
              <el-input v-model="userModel.login_time" placeholder="" />
            </el-form-item>
            <el-form-item v-if="userModel.admin_user_id" label="退出时间" prop="logout_time">
              <el-input v-model="userModel.logout_time" placeholder="" />
            </el-form-item>
            <el-form-item>
              <el-button @click="userReset()">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getAdminUserId } from '@/utils/auth'
import { myInfo } from '@/api/admin'

export default {
  name: 'MyInfo',
  components: {},
  data() {
    return {
      loading: false,
      userModel: {
        admin_user_id: getAdminUserId(),
        username: '',
        nickname: '',
        email: '',
        create_time: '',
        update_time: '',
        login_time: '',
        logout_time: ''
      },
      userRules: {}
    }
  },
  created() {
    this.myInfo()
  },
  methods: {
    myInfo(msg = false) {
      this.loading = true
      myInfo({
        admin_user_id: this.userModel.admin_user_id
      }).then(res => {
        this.userModel = res.data
        this.loading = false
        if (msg) {
          this.$message({ message: res.msg, type: 'success' })
        }
      }).catch(() => {
        this.loading = false
      })
    },
    userReset() {
      this.myInfo(true)
    }
  }
}
</script>
