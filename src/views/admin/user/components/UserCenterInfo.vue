<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12">
          <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px">
            <el-form-item label="头像">
              <el-avatar shape="circle" fit="contain" :size="100" :src="model.avatar_url" />
            </el-form-item>
            <el-form-item label="账号" prop="username">
              <el-input v-model="model.username" placeholder="请输入账号" clearable />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="model.nickname" placeholder="请输入昵称" clearable />
            </el-form-item>
            <el-form-item v-if="model.admin_user_id == ''" label="密码" prop="password">
              <el-input v-model="model.password" placeholder="请输入密码" clearable show-password />
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="model.phone" clearable />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="model.email" clearable />
            </el-form-item>
            <el-form-item v-if="model.admin_user_id" label="添加时间" prop="create_time">
              <el-input v-model="model.create_time" placeholder="" />
            </el-form-item>
            <el-form-item v-if="model.admin_user_id" label="修改时间" prop="update_time">
              <el-input v-model="model.update_time" placeholder="" />
            </el-form-item>
            <el-form-item v-if="model.admin_user_id" label="登录时间" prop="update_time">
              <el-input v-model="model.login_time" placeholder="" />
            </el-form-item>
            <el-form-item v-if="model.admin_user_id" label="退出时间" prop="logout_time">
              <el-input v-model="model.logout_time" placeholder="" />
            </el-form-item>
            <el-form-item>
              <el-button @click="refresh">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { info } from '@/api/admin/user-center'

export default {
  name: 'UserCenterInfo',
  components: {},
  data() {
    return {
      loading: false,
      model: {
        avatar: '',
        avatar_url: '',
        username: '',
        nickname: '',
        phone: '',
        email: '',
        create_time: '',
        update_time: '',
        login_time: '',
        logout_time: ''
      },
      rules: {}
    }
  },
  created() {
    this.info()
  },
  methods: {
    info(msg = false) {
      this.loading = true
      info({
        admin_user_id: this.model.admin_user_id
      }).then(res => {
        this.model = res.data
        this.loading = false
        if (msg) {
          this.$message.success(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    refresh() {
      this.info(true)
    }
  }
}
</script>
