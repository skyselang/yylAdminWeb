<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-tabs v-model="tabActName">
          <el-tab-pane label="系统设置" name="setting">
            <el-card class="box-card">
              <el-form ref="formRef" label-position="right" label-width="120px" style="width: 60%; margin-left:50px;">
                <el-form-item label="设置主题">
                  <theme-picker @change="themeChange" />
                </el-form-item>
                <el-form-item label="便签导航">
                  <el-switch v-model="tagsView" class="drawer-switch" />
                </el-form-item>
                <el-form-item label="固定头部">
                  <el-switch v-model="fixedHeader" class="drawer-switch" />
                </el-form-item>
                <el-form-item label="Logo标题">
                  <el-switch v-model="sidebarLogo" class="drawer-switch" />
                </el-form-item>
                <el-form-item label="清除缓存">
                  <el-button :loading="cacheClearLoad" type="primary" @click="cacheClearClick()">清除</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
import { cacheClear } from '@/api/admin'

export default {
  name: 'Setting',
  components: { ThemePicker },
  data() {
    return {
      tabActName: 'setting',
      cacheClearLoad: false
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
    // Logo标题
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
    // 清除缓存
    cacheClearClick() {
      this.cacheClearLoad = true
      cacheClear()
        .then(res => {
          this.cacheClearLoad = false
          this.$message({ message: res.msg, type: 'success' })
        })
        .catch(() => {
          this.cacheClearLoad = false
        })
    }
  }
}
</script>
