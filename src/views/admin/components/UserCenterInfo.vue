<template>
  <div>
    <el-card v-loading="loading" class="dialog-body" :style="{height:height+'px'}">
      <el-row>
        <el-col :xs="24" :sm="22" :md="20" :lg="16" :xl="12">
          <el-form ref="ref" :rules="rules" :model="model" label-width="120px">
            <el-form-item label="头像">
              <el-avatar v-if="model.avatar_url" :src="model.avatar_url" fit="contain" shape="circle" :size="100" />
              <el-avatar v-else icon="el-icon-user-solid" :size="100" />
            </el-form-item>
            <el-form-item label="账号" prop="username">
              <el-input v-model="model.username" placeholder="请输入账号" clearable />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="model.nickname" placeholder="请输入昵称" clearable />
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
            <el-form-item v-if="model.admin_user_id" label="登录时间" prop="login_time">
              <el-input v-model="model.login_time" placeholder="" />
            </el-form-item>
            <el-form-item v-if="model.admin_user_id" label="登录地区" prop="login_region">
              <el-input v-model="model.login_region" placeholder="" />
            </el-form-item>
            <el-form-item v-if="model.admin_user_id" label="退出时间" prop="logout_time">
              <el-input v-model="model.logout_time" placeholder="" />
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" @click="refresh">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { info } from '@/api/admin/user-center'

export default {
  name: 'AdminUserCenterInfo',
  components: {},
  data() {
    return {
      name: '我的信息',
      height: 680,
      loading: false,
      model: {
        avatar_id: 0,
        avatar_url: '',
        username: '',
        nickname: '',
        phone: '',
        email: '',
        create_time: '',
        update_time: '',
        login_time: '',
        login_region: '',
        logout_time: ''
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(180)
    this.info()
  },
  methods: {
    // 信息
    info(msg = false) {
      this.loading = true
      info().then(res => {
        this.model = res.data
        this.loading = false
        if (msg) {
          this.$message.success(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 刷新
    refresh() {
      this.info(true)
    }
  }
}
</script>
