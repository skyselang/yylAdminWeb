<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-col :xs="24" :sm="18" :md="12">
          <el-form ref="ref" label-width="120px">
            <el-form-item label="设置主题">
              <theme-picker @change="themeChange" />
            </el-form-item>
            <el-form-item label="便签导航">
              <el-switch v-model="tagsView" class="drawer-switch" />
            </el-form-item>
            <el-form-item label="固定头部">
              <el-switch v-model="fixedHeader" class="drawer-switch" />
            </el-form-item>
            <el-form-item label="logo名称">
              <el-switch v-model="sidebarLogo" class="drawer-switch" />
            </el-form-item>
            <el-form-item label="本地缓存">
              <el-button :loading="loading" type="primary" size="mini" @click="localCacheClear">清除</el-button>
              <i class="el-icon-warning-outline" title="清除后需要重新登录" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'

export default {
  name: 'UserCenterSetting',
  components: { ThemePicker },
  data() {
    return {
      name: '我的设置',
      loading: false
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
  methods: {
    // 设置主题
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
    // 本地缓存清除
    localCacheClear() {
      this.loading = true

      localStorage.clear()
      sessionStorage.clear()
      var cookieKeys = document.cookie.match(/[^ =;]+(?=\=)/g)
      if (cookieKeys) {
        for (var i = cookieKeys.length; i--;) {
          document.cookie = cookieKeys[i] + '=0;path=/;expires=' + new Date(0).toUTCString()
          document.cookie = cookieKeys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString()
        }
      }

      this.$router.push('/login')

      this.loading = false
      this.$message.success('本地缓存已清除')
    }
  }
}
</script>
