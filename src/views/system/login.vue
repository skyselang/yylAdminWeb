<template>
  <div
    class="login-container"
    :style="{
      backgroundImage: 'url(' + login_bg_url + ')',
      backgroundColor: login_bg_color
    }"
  >
    <el-row class="mt-4">
      <el-col :span="1" :offset="23">
        <lang-select class="cursor-pointer mr-4 mt-[3px]" />
        <theme-select class="cursor-pointer" />
      </el-col>
    </el-row>
    <el-form ref="ref" class="login-form" :model="model" :rules="rules">
      <div class="login-logo" :style="{ backgroundColor: login_bg_color }">
        <el-image v-if="logo_url" :src="logo_url" style="height: 108px">
          <template #error>
            <svg-icon icon-class="picture" />
          </template>
        </el-image>
        <div v-else style="height: 115px"></div>
      </div>
      <div class="login-title">
        <h3 class="login-title-name">{{ system_name }}</h3>
      </div>
      <el-form-item prop="username">
        <el-input v-model="model.username" :placeholder="$t('login.username')" clearable>
          <template #prefix>
            <svg-icon icon-class="user" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="model.password" type="password" :placeholder="$t('login.password')" clearable show-password>
          <template #prefix>
            <svg-icon icon-class="lock" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="captcha_switch && captcha_src" prop="captcha_code">
        <el-col :span="13">
          <el-input v-model="model.captcha_code" :placeholder="$t('login.captchaCode')" autocomplete="off" clearable>
            <template #prefix>
              <svg-icon icon-class="picture" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="11">
          <el-image
            class="login-captcha"
            :style="{ height: captchaHeight }"
            :src="captcha_src"
            fit="fill"
            :alt="$t('login.captchaCode')"
            :title="$t('login.Click to refresh the captcha code')"
            @click="captcha"
          />
        </el-col>
      </el-form-item>
      <aj-captcha
        v-if="captcha_switch && captcha_mode == 2"
        ref="ajcaptcha"
        mode="pop"
        :captcha-type="captcha_type"
        @success="ajcaptchaSuccess"
      />
      <el-button
        v-if="captcha_switch && captcha_mode == 2"
        :loading="loading"
        type="primary"
        class="login-bottom"
        @click="ajcaptchaShow"
      >
        {{ $t('login.login') }}
      </el-button>
      <el-button v-else :loading="loading" type="primary" class="login-bottom" @click.prevent="handleLogin">
        {{ $t('login.login') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import defaultSettings from '@/settings'
import LangSelect from '@/components/LangSelect/index.vue'
import ThemeSelect from '@/components/ThemeSelect/index.vue'
import AjCaptcha from '@/components/AjCaptcha/index.vue'
import { captcha, setting } from '@/api/system/login'
import { useAppStoreHook } from '@/store/modules/app'
import { useSettingsStoreHook } from '@/store/modules/settings'
import { useUserStoreHook } from '@/store/modules/user'
import { delNotice } from '@/utils/settings'

export default {
  name: 'SystemLogin',
  components: { LangSelect, ThemeSelect, AjCaptcha },
  data() {
    return {
      name: '登录',
      loading: false,
      redirect: undefined,
      otherQuery: {},
      captcha_switch: 0,
      captcha_mode: 1,
      captcha_type: 'blockPuzzle',
      captcha_src: '',
      login_bg_url: '',
      login_bg_color: '',
      logo_url: '',
      system_name: 'yylAdmin',
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
      if (appStore.size == 'large') {
        return '40px'
      } else if (appStore.size == 'small') {
        return '24px'
      }
      return '32px'
    },
    rules() {
      return {
        username: [{ required: true, message: this.$t('login.Please enter username'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('login.Please enter password'), trigger: 'blur' }],
        captcha_code: [{ required: true, message: this.$t('login.Please enter captcha code'), trigger: 'blur' }]
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
    // 验证码
    captcha() {
      captcha().then((res) => {
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
      const storePrefix = defaultSettings.storePrefix
      localStorage.setItem(storePrefix + 'captchaSwitch', data.captcha_switch)
      localStorage.setItem(storePrefix + 'captchaMode', data.captcha_mode)
      localStorage.setItem(storePrefix + 'captchaType', data.captcha_type)
      localStorage.setItem(storePrefix + 'captchaSrc', data.captcha_src)
    },
    ajcaptchaSuccess(params) {
      this.model.ajcaptcha = params
      this.handleLogin()
    },
    ajcaptchaShow() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.$refs.ajcaptcha.show()
        } else {
          return false
        }
      })
    },
    // 设置
    setting() {
      const storePrefix = defaultSettings.storePrefix
      this.login_bg_url = localStorage.getItem(storePrefix + 'loginBgUrl')
      this.login_bg_color = localStorage.getItem(storePrefix + 'loginBgColor')
      this.logo_url = localStorage.getItem(storePrefix + 'logoUrl')
      this.system_name = localStorage.getItem(storePrefix + 'systemName')
      this.model.captcha_id = ''
      this.model.captcha_code = ''
      this.captcha_switch = localStorage.getItem(storePrefix + 'captchaSwitch')
      this.captcha_mode = localStorage.getItem(storePrefix + 'captchaMode')
      this.captcha_type = localStorage.getItem(storePrefix + 'captchaType')
      this.captcha_src = localStorage.getItem(storePrefix + 'captchaSrc')
      const settingsStore = useSettingsStoreHook()
      settingsStore.changeSetting({ key: 'watermarkContent', value: '' })
      setting()
        .then((res) => {
          delNotice()
          const data = res.data
          this.captchaData(data)
          this.login_bg_url = data.login_bg_url
          this.login_bg_color = data.login_bg_color
          this.logo_url = data.logo_url
          this.system_name = data.system_name
          settingsStore.changeSetting({ key: 'loginBgUrl', value: data.login_bg_url })
          settingsStore.changeSetting({ key: 'loginBgColor', value: data.login_bg_color })
          settingsStore.changeSetting({ key: 'logoUrl', value: data.logo_url })
          settingsStore.changeSetting({ key: 'systemName', value: data.system_name })
          settingsStore.changeSetting({ key: 'pageTitle', value: data.page_title })
          settingsStore.changeSetting({ key: 'pageLimit', value: data.page_limit })
          settingsStore.changeSetting({ key: 'notice', value: 0 })
          settingsStore.changeSetting({ key: 'watermarkEnabled', value: data.is_watermark })
        })
        .catch(() => {})
    },
    // 登录
    handleLogin() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
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
  overflow: hidden;
  background-color: #2d3a4b;
  background-size: 100% 100%;
  background-position: center center;

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
      height: 30px;
      line-height: 30px;
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
  }

  .login-captcha {
    float: right;
    width: 90%;
    border-radius: 4px;
    vertical-align: middle;
  }

  .login-bottom {
    width: 100%;
    margin-bottom: 30px;
  }
}
</style>
