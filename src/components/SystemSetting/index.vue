<template>
  <el-row :loading="loading">
    <el-col :span="16">
      <el-form ref="ref" label-width="120px">
        <el-form-item label="设置主题">
          <el-col :span="6">
            <theme-picker @change="themeChange" />
          </el-col>
          <el-col :span="18">
            <span>自定义主题色</span>
          </el-col>
        </el-form-item>
        <el-form-item label="登录背景">
          <el-col :span="6">
            <el-color-picker
              v-model="loginBg"
              :predefine="['#2d3a4b', '#2C8AFF', '#1C2D56', '#121E56', '#079583', '#09AEC2', '#5F45CD', '#E10E2D']"
              class="theme-picker"
              popper-class="theme-picker-dropdown"
              @change="loginBgChange"
            />
          </el-col>
          <el-col :span="18">
            <span>登录页面背景色</span>
          </el-col>
        </el-form-item>
        <el-form-item label="便签导航">
          <el-col :span="6">
            <el-switch v-model="tagsView" />
          </el-col>
          <el-col :span="18">
            <span>是否显示便签导航</span>
          </el-col>
        </el-form-item>
        <el-form-item label="固定头部">
          <el-col :span="6">
            <el-switch v-model="fixedHeader" />
          </el-col>
          <el-col :span="18">
            <span>便签导航和头部是否固定</span>
          </el-col>
        </el-form-item>
        <el-form-item label="logo名称">
          <el-col :span="6">
            <el-switch v-model="sidebarLogo" />
          </el-col>
          <el-col :span="18">
            <span>左上角是否显示logo名称</span>
          </el-col>
        </el-form-item>
        <el-form-item label="清除设置">
          <el-col :span="6">
            <el-button :loading="loading" type="primary" @click="settingClear">清除</el-button>
          </el-col>
          <el-col :span="18">
            <span>清除后需要重新登录</span>
          </el-col>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
import { getLoginBgColor, setLoginBgColor } from '@/utils/settings'
import variables from '@/styles/element-variables.scss'

export default {
  components: { ThemePicker },
  data() {
    return {
      loading: false,
      loginBg: getLoginBgColor()
    }
  },
  computed: {
    // 便签导航
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    // 固定头部
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    // Logo名称
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  created() { },
  methods: {
    // 设置主题
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
    // 登录背景色
    loginBgChange(val) {
      setLoginBgColor(val)
    },
    // 清除设置
    settingClear() {
      this.loading = true

      localStorage.clear()
      sessionStorage.clear()
      var cookieKeys = document.cookie.match(/[^ =;]+(?=\=)/g)
      if (cookieKeys) {
        for (var i = cookieKeys.length; i--;) {
          document.cookie =
            cookieKeys[i] + '=0;path=/;expires=' + new Date(0).toUTCString()
          document.cookie =
            cookieKeys[i] +
            '=0;path=/;domain=' +
            document.domain +
            ';expires=' +
            new Date(0).toUTCString()
        }
      }
      this.themeChange(variables.theme)
      this.$router.push('/login')
      this.loading = false
      this.$message.success('本地缓存已清除')
    }
  }
}
</script>
<style>
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
