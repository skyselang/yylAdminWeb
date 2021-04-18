<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12">
          <el-form ref="settingRef" label-width="100px">
            <el-form-item label="设置主题">
              <theme-picker @change="themeChange" />
            </el-form-item>
            <el-form-item label="便签导航">
              <el-switch v-model="tagsView" class="drawer-switch" />
            </el-form-item>
            <el-form-item label="固定头部">
              <el-switch v-model="fixedHeader" class="drawer-switch" />
            </el-form-item>
            <el-form-item label="Logo名称">
              <el-switch v-model="sidebarLogo" class="drawer-switch" />
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
    return {}
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
    }
  }
}
</script>
