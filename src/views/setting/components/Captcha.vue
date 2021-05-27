<template>
  <el-card class="box-card">
    <el-row :gutter="0">
      <el-col :xs="24" :sm="12">
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item label="注册验证码" prop="captcha_register">
            <el-switch v-model="model.captcha_register" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="登录验证码" prop="captcha_login">
            <el-switch v-model="model.captcha_login" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" @click="refresh()">刷新</el-button>
            <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { captchaInfo, captchaEdit } from '@/api/setting'

export default {
  name: 'Captcha',
  components: {},
  data() {
    return {
      loading: false,
      model: {
        captcha_register: 0,
        captcha_login: 0
      },
      rules: {}
    }
  },
  created() {
    this.info()
  },
  methods: {
    // 信息
    info() {
      captchaInfo().then(res => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      captchaInfo()
        .then((res) => {
          this.model = res.data
          this.loading = false
          this.$message.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          captchaEdit(this.model).then(res => {
            this.info()
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
