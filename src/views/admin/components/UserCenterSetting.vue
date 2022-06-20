<template>
  <div>
    <el-card v-loading="loading" class="dialog-body" :style="{height:height+'px'}">
      <el-row>
        <el-col :xs="24" :sm="22" :md="20" :lg="16" :xl="12">
          <el-form ref="ref" label-width="120px">
            <el-form-item label="设置主题">
              <theme-picker @change="themeChange" />
              <span> 设置主题（部分样式）</span>
            </el-form-item>
            <el-form-item label="便签导航">
              <el-switch v-model="tagsView" class="drawer-switch" />
              <span> 是否显示便签导航</span>
            </el-form-item>
            <el-form-item label="固定头部">
              <el-switch v-model="fixedHeader" class="drawer-switch" />
              <span> 便签导航和头部是否固定</span>
            </el-form-item>
            <el-form-item label="logo名称">
              <el-switch v-model="sidebarLogo" class="drawer-switch" />
              <span> 左上角是否显示logo名称</span>
            </el-form-item>
            <el-form-item label="本地缓存">
              <el-button :loading="loading" type="primary" size="mini" @click="localCacheClear">清除</el-button>
              <span> 清除后需要重新登录</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import ThemePicker from '@/components/ThemePicker'

export default {
  name: 'AdminUserCenterSetting',
  components: { ThemePicker },
  data() {
    return {
      name: '我的设置',
      height: 680,
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
  created() {
    this.height = screenHeight(180)
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
