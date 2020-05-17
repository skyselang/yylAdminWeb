<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-tabs v-model="tabActName">
          <el-tab-pane label="系统设置" name="setting">
            <el-card class="box-card">
              <el-form
                ref="formRef"
                :rules="formRules"
                :model="formData"
                label-position="right"
                label-width="120px"
                style="width: 60%; margin-left:50px;"
              >
                <el-form-item label="主题">
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

export default {
  name: 'Setting',
  components: { ThemePicker },
  data() {
    return {
      tabActName: 'setting',
      formRules: {},
      formData: {}
    }
  },
  computed: {
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
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// .drawer-container {
//   padding: 24px;
//   font-size: 14px;
//   line-height: 1.5;
//   word-wrap: break-word;

//   .drawer-title {
//     margin-bottom: 12px;
//     color: rgba(0, 0, 0, .85);
//     font-size: 14px;
//     line-height: 22px;
//   }

//   .drawer-item {
//     color: rgba(0, 0, 0, .65);
//     font-size: 14px;
//     padding: 12px 0;
//   }

//   .drawer-switch {
//     float: right
//   }
// }
</style>
