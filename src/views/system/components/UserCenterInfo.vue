<template>
  <el-card v-loading="loading" class="dialog-body" :style="{height:height+'px'}">
    <el-row>
      <el-col :span="12">
        <el-form ref="ref" :rules="rules" :model="model" label-width="120px">
          <el-form-item label="头像">
            <el-avatar v-if="model.avatar_url" :size="100" fit="contain" :src="model.avatar_url" shape="circle" />
            <el-avatar v-else icon="el-icon-user-solid" :size="100" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="model.nickname" />
          </el-form-item>
          <el-form-item label="账号" prop="username">
            <el-input v-model="model.username" />
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="model.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="model.email" />
          </el-form-item>
          <el-form-item label="添加时间" prop="create_time">
            <el-input v-model="model.create_time" />
          </el-form-item>
          <el-form-item label="修改时间" prop="update_time">
            <el-input v-model="model.update_time" />
          </el-form-item>
          <el-form-item label="登录时间" prop="login_time">
            <el-input v-model="model.login_time" />
          </el-form-item>
          <el-form-item label="登录地区" prop="login_region">
            <el-input v-model="model.login_region" />
          </el-form-item>
          <el-form-item label="退出时间" prop="logout_time">
            <el-input v-model="model.logout_time" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" @click="refresh">刷新</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { info } from '@/api/system/user-center'

export default {
  name: 'SystemUserCenterInfo',
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
