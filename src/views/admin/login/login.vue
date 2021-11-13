<template>
  <div class="login-container" :style="{backgroundImage:'url('+login_bg_url+')' }">
    <el-form ref="ref" :model="model" :rules="rules" class="login-form" label-position="left">
      <div class="title-container">
        <h3 class="title">{{ system_name }}</h3>
      </div>
      <el-form-item prop="username">
        <el-input v-model="model.username" type="text" placeholder="账号/手机/邮箱" prefix-icon="el-icon-user" autocomplete="on" clearable />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="model.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock" autocomplete="on" clearable show-password />
      </el-form-item>
      <el-form-item v-if="captcha_switch" prop="captcha_code">
        <el-col :span="13">
          <el-input v-model="model.captcha_code" placeholder="请输入验证码" prefix-icon="el-icon-picture" autocomplete="off" clearable />
        </el-col>
        <el-col :span="11">
          <el-image :src="captcha_src" fit="fill" alt="验证码" title="点击刷新验证码" style="width:200px;height:36px;float:right" @click="captcha" />
        </el-col>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { captcha, setting } from '@/api/admin/login'

export default {
  name: 'AdminLogin',
  components: {},
  data() {
    return {
      system_name: '',
      loading: false,
      redirect: undefined,
      otherQuery: {},
      captcha_src: '',
      captcha_switch: 0,
      login_bg_url: '',
      model: {
        username: '',
        password: '',
        captcha_id: '',
        captcha_code: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captcha_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.setting()
  },
  mounted() { },
  destroyed() { },
  methods: {
    // 验证码
    captcha() {
      captcha().then(res => {
        this.captchaSet(res)
      })
    },
    captchaSet(res) {
      this.model.captcha_id = ''
      this.model.captcha_code = ''
      if (res.data.captcha_switch) {
        this.captcha_src = res.data.captcha_src
        this.model.captcha_id = res.data.captcha_id
      }
      this.captcha_switch = res.data.captcha_switch
    },
    // 设置
    setting() {
      this.model.captcha_id = ''
      this.model.captcha_code = ''
      setting().then(res => {
        this.captchaSet(res)
        this.system_name = res.data.system_name
        this.login_bg_url = res.data.login_bg_url
        this.$store.dispatch('settings/changeSetting', { key: 'systemName', value: res.data.system_name })
        this.$store.dispatch('settings/changeSetting', { key: 'pageTitle', value: res.data.page_title })
        this.$store.dispatch('settings/changeSetting', { key: 'logoUrl', value: res.data.logo_url })
        this.$store.dispatch('settings/changeSetting', { key: 'faviconUrl', value: res.data.favicon_url })
      })
    },
    // 登录
    handleLogin() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.model).then(() => {
            this.$router.push({
              path: this.redirect || '/',
              query: this.otherQuery
            }).catch(() => {
              this.loading = false
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100%;
  background-color: #2d3a4b;
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #eee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
