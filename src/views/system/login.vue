<template>
  <div class="login-container" :style="{backgroundImage:'url('+login_bg_url+')' }">
    <el-form ref="ref" class="login-form" :model="model" :rules="rules" label-position="left">
      <div class="login-title">
        <h3 class="login-title-name">{{ system_name }}</h3>
      </div>
      <div class="login-logo">
        <el-image v-if="logo_url" class="login-logo-img" :src="logo_url" fit="contain">
          <div slot="error" class="image-slot" />
        </el-image>
        <div v-else style="height:134px" />
      </div>
      <el-form-item prop="username">
        <el-input v-model="model.username" type="text" placeholder="账号/手机/邮箱" prefix-icon="el-icon-user" autocomplete="on" clearable />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="model.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock" autocomplete="on" clearable show-password />
      </el-form-item>
      <el-form-item v-if="captcha_switch&&captcha_src" prop="captcha_code">
        <el-col :span="13">
          <el-input v-model="model.captcha_code" placeholder="请输入验证码" prefix-icon="el-icon-picture" autocomplete="off" clearable />
        </el-col>
        <el-col :span="11">
          <el-image class="login-captcha" :src="captcha_src" fit="fill" alt="验证码" title="点击刷新验证码" @click="captcha" />
        </el-col>
      </el-form-item>
      <aj-captcha v-if="captcha_switch&&captcha_mode==2" ref="ajcaptcha" mode="pop" :captcha-type="captcha_type" :img-size="{ width: '330px', height: '155px' }" @success="ajcaptchaSuccess" />
      <el-button v-if="captcha_switch&&captcha_mode==2" :loading="loading" type="primary" class="login-bottom" @click="ajcaptchaShow">登录</el-button>
      <el-button v-else :loading="loading" type="primary" class="login-bottom" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import AjCaptcha from '@/components/AjCaptcha'
import { captcha, setting } from '@/api/system/login'
import { delNotice } from '@/utils/settings'

export default {
  name: 'SystemLogin',
  components: { AjCaptcha },
  data() {
    return {
      name: '登录',
      system_name: '',
      loading: false,
      redirect: undefined,
      otherQuery: {},
      captcha_switch: 0,
      captcha_mode: 1,
      captcha_type: 'blockPuzzle',
      captcha_src: '',
      logo_url: '',
      login_bg_url: '',
      model: {
        username: '',
        password: '',
        captcha_id: '',
        captcha_code: '',
        ajcaptcha: {}
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
      handler(route) {
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
        this.captchaData(res.data)
      })
    },
    captchaData(data) {
      this.model.captcha_id = ''
      this.model.captcha_code = ''
      if (data.captcha_switch) {
        if (data.captcha_mode === 1) {
          this.captcha_src = data.captcha_src
          this.model.captcha_id = data.captcha_id
        }
      }
      this.captcha_switch = data.captcha_switch
      this.captcha_mode = data.captcha_mode
      if (data.captcha_type === 1) {
        this.captcha_type = 'blockPuzzle'
      } else {
        this.captcha_type = 'clickWord'
      }
    },
    ajcaptchaSuccess(params) {
      this.model.ajcaptcha = params
      this.handleLogin()
    },
    ajcaptchaShow() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.$refs.ajcaptcha.show()
        } else {
          return false
        }
      })
    },
    // 设置
    setting() {
      this.model.captcha_id = ''
      this.model.captcha_code = ''
      setting().then(res => {
        delNotice()
        const data = res.data
        this.captchaData(data)
        this.login_bg_url = data.login_bg_url
        this.system_name = data.system_name
        this.logo_url = data.logo_url
        this.$store.dispatch('settings/changeSetting', { key: 'tokenName', value: data.token_name })
        this.$store.dispatch('settings/changeSetting', { key: 'tokenType', value: data.token_type })
        this.$store.dispatch('settings/changeSetting', { key: 'systemName', value: data.system_name })
        this.$store.dispatch('settings/changeSetting', { key: 'pageTitle', value: data.page_title })
        this.$store.dispatch('settings/changeSetting', { key: 'logoUrl', value: data.logo_url })
        this.$store.dispatch('settings/changeSetting', { key: 'faviconUrl', value: data.favicon_url })
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
            if (this.captcha_switch && this.captcha_mode === 2) {
              this.$refs.ajcaptcha.refresh()
            } else {
              this.captcha()
            }
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
    padding: 160px 35px 0;
    margin: 0 auto;
    width: 460px;
    max-width: 100%;
    overflow: hidden;
  }

  .login-title {
    position: relative;

    .login-title-name {
      height: 29px;
      margin: 0px auto 22px auto;
      text-align: center;
      font-weight: bold;
      font-size: 26px;
      color: #eee;
    }
  }

  .login-logo {
    margin-bottom: 22px;
    text-align: center;

    .login-logo-img {
      height: 130px;
    }
  }

  .login-captcha {
    float: right;
    width: 200px;
    height: 36px;
    border-radius: 4px;
  }

  .login-bottom {
    width: 100%;
    margin-bottom: 30px;
  }
}
</style>