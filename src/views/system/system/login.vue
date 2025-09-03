<template>
  <div :style="loginContainerStyle" class="login-container disable-select">
    <el-row class="mt-4">
      <el-col :span="1" :offset="23">
        <lang-select class="cursor-pointer mr-4 mt-[3px]" />
        <theme-select class="cursor-pointer" />
      </el-col>
    </el-row>
    <el-form
      ref="ref"
      :model="model"
      :rules="rules"
      class="login-form shadow-[var(--el-box-shadow-light)] backdrop-blur-3px border-rd-10px"
    >
      <div class="login-logo">
        <el-image v-if="logo_url" :src="logo_url" class="h-108px">
          <template #error><Icons icon="Picture" /></template>
        </el-image>
        <div v-else class="h-115px"></div>
      </div>
      <div class="login-title">
        <el-text>
          <h2 class="login-title-name">{{ system_name }}</h2>
        </el-text>
      </div>
      <el-form-item prop="username">
        <el-input v-model="model.username" :placeholder="$t('账号')" clearable>
          <template #prefix><Icons icon="User" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="model.password"
          :placeholder="$t('密码')"
          type="password"
          clearable
          show-password
          autocomplete="new-password"
        >
          <template #prefix><Icons icon="Lock" /></template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="captcha_switch && captcha_img" prop="captcha_code">
        <el-col :span="12">
          <el-input v-model="model.captcha_code" :placeholder="$t('验证码')" clearable>
            <template #prefix><Icons icon="Picture" /></template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-image
            :src="captcha_img"
            :alt="$t('验证码')"
            :title="$t('点击刷新验证码')"
            :style="{ height: captchaHeight }"
            class="login-captcha"
            fit="fill"
            @click="captcha"
          />
        </el-col>
      </el-form-item>
      <el-form-item prop="rememberMe">
        <el-checkbox v-model="rememberMe" :label="$t('记住我')" name="rememberMe" @change="rememberMeChange" />
      </el-form-item>
      <aj-captcha
        v-if="captcha_switch && captcha_mode === 2"
        ref="ajcaptcha"
        mode="pop"
        :captcha-type="captcha_type"
        @success="ajcaptchaSuccess"
      />
      <el-button
        v-if="captcha_switch && captcha_mode === 2"
        :loading="loading"
        type="primary"
        class="login-bottom"
        @click="ajcaptchaShow"
      >
        {{ $t('登录') }}
      </el-button>
      <el-button v-else :loading="loading" type="primary" class="login-bottom" @click.prevent="handleLogin">
        {{ $t('登录') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import defaultSettings from '@/settings'
import LangSelect from '@/components/LangSelect/index.vue'
import ThemeSelect from '@/components/ThemeSelect/index.vue'
import AjCaptcha from './component/AjCaptcha/index.vue'
import { settingApi, captchaApi } from '@/api/system/login'
import { useAppStoreHook } from '@/store/modules/app'
import { useSettingsStoreHook } from '@/store/modules/settings'
import { useUserStoreHook } from '@/store/modules/user'
import { delNotice, rememberMe } from '@/utils/index'

export default {
  components: { LangSelect, ThemeSelect, AjCaptcha },
  data() {
    return {
      name: '登录',
      loading: false,
      redirect: undefined,
      otherQuery: {},
      logo_url: '',
      system_name: 'yylAdmin',
      login_bg_url: '',
      login_bg_color: '',
      captcha_switch: 0,
      captcha_mode: 1,
      captcha_type: 'blockPuzzle',
      captcha_img: '',
      rememberMe: false,
      model: {
        username: '',
        password: '',
        captcha_id: '',
        captcha_code: '',
        ajcaptcha: {}
      }
    }
  },
  computed: {
    captchaHeight() {
      const appStore = useAppStoreHook()
      if (appStore.size === 'large') {
        return '40px'
      } else if (appStore.size === 'small') {
        return '24px'
      }
      return '32px'
    },
    rules() {
      return {
        username: [{ required: true, message: this.$t('请输入账号'), trigger: 'submit' }],
        password: [{ required: true, message: this.$t('请输入密码'), trigger: 'submit' }],
        captcha_code: [{ required: true, message: this.$t('请输入验证码'), trigger: 'submit' }]
      }
    },
    loginContainerStyle() {
      const settingsStore = useSettingsStoreHook()
      if (settingsStore.theme === 'dark') {
        return { backgroundImage: 'url(' + this.login_bg_url + ')' }
      } else {
        return { backgroundImage: 'url(' + this.login_bg_url + ')', backgroundColor: this.login_bg_color }
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
  methods: {
    // 设置
    setting() {
      const storePrefix = defaultSettings.storePrefix
      this.login_bg_url = localStorage.getItem(storePrefix + 'loginBgUrl')
      this.login_bg_color = localStorage.getItem(storePrefix + 'loginBgColor')
      this.logo_url = localStorage.getItem(storePrefix + 'logoUrl')
      this.system_name = localStorage.getItem(storePrefix + 'systemName')
      this.captcha_switch = localStorage.getItem(storePrefix + 'captchaSwitch')
      this.captcha_mode = localStorage.getItem(storePrefix + 'captchaMode')
      this.captcha_type = localStorage.getItem(storePrefix + 'captchaType')
      this.captcha_img = localStorage.getItem(storePrefix + 'captchaImg')
      this.model.captcha_id = ''
      this.model.captcha_code = ''
      this.rememberMeChange(this.rememberMe)
      const settingsStore = useSettingsStoreHook()
      settingsStore.changeSetting({ key: 'watermarkContent', value: '' })
      settingApi()
        .then((res) => {
          delNotice()
          const data = res.data
          this.captchaData(data)
          this.login_bg_url = data.login_bg_url
          this.login_bg_color = data.login_bg_color
          this.logo_url = data.logo_url
          this.system_name = data.system_name
          data.watermark_content = data.system_name
          settingsStore.setSetting(data)
          this.message(data)
        })
        .catch(() => {})
    },
    // 验证码
    captcha() {
      captchaApi().then((res) => {
        this.captchaData(res.data)
        this.$refs['ref'].clearValidate()
      })
    },
    captchaData(data) {
      this.captcha_switch = data.captcha_switch
      this.captcha_mode = data.captcha_mode
      this.model.captcha_id = ''
      this.model.captcha_code = ''
      if (data.captcha_switch) {
        if (data.captcha_mode === 1) {
          this.captcha_img = data.captcha_img
          this.model.captcha_id = data.captcha_id
        }
      }
      if (data.captcha_type === 1) {
        this.captcha_type = 'blockPuzzle'
      } else {
        this.captcha_type = 'clickWord'
      }
      const storePrefix = defaultSettings.storePrefix
      localStorage.setItem(storePrefix + 'captchaSwitch', data.captcha_switch)
      localStorage.setItem(storePrefix + 'captchaMode', data.captcha_mode)
      localStorage.setItem(storePrefix + 'captchaType', data.captcha_type)
      localStorage.setItem(storePrefix + 'captchaImg', data.captcha_img)
    },
    ajcaptchaSuccess(params) {
      this.model.ajcaptcha = params
      this.handleLogin()
    },
    ajcaptchaShow() {
      this.$refs['ref'].validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.$refs.ajcaptcha.show()
        }
      })
    },
    // 登录
    handleLogin() {
      this.$refs['ref'].validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.loading = true
          const userStore = useUserStoreHook()
          userStore
            .login(this.model)
            .then(() => {
              this.$router
                .push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                })
                .catch(() => {
                  this.loading = false
                })
            })
            .catch(() => {
              this.loading = false
              if (this.captcha_switch && this.captcha_mode === 2) {
                this.$refs.ajcaptcha.refresh()
              } else {
                this.captcha()
              }
            })
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
    },
    // 记住我
    rememberMeChange(value) {
      rememberMe(value)
    },
    // 提示
    message(data) {
      if (data.login_msg_switch) {
        ElMessage({
          message: data.login_msg_text,
          type: data.login_msg_type,
          duration: data.login_msg_time * 1000,
          showClose: true,
          grouping: true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-size: cover;
  background-position: center center;

  .login-form {
    position: relative;
    padding: 0 35px;
    margin: 10% auto 0 auto;
    width: 460px;
    max-width: 100%;
    overflow: hidden;
  }

  .login-title {
    position: relative;

    .login-title-name {
      height: 30px;
      line-height: 30px;
      margin: 0px auto 16px auto;
      text-align: center;
    }
  }

  .login-logo {
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
  }

  .login-captcha {
    float: right;
    width: 90%;
    border-radius: 4px;
    vertical-align: middle;
    cursor: pointer;
    border: var(--el-border);
  }

  .login-bottom {
    width: 100%;
    margin-bottom: 30px;
  }
}
.disable-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
