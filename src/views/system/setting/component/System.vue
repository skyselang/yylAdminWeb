<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('系统简称')" prop="system_name">
            <el-col :span="10">
              <el-input v-model="model.system_name" clearable />
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('侧边栏、登录页显示') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('页面标题')" prop="page_title">
            <el-col :span="10">
              <el-input v-model="model.page_title" clearable />
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('浏览器页面标题后缀') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('网页图标')" prop="favicon_id">
            <FileImage
              v-model="model.favicon_id"
              v-model:file-url="model.favicon_url"
              :file-title="$t('上传favicon')"
              :file-tip="$t('图片小于 50 KB，jpg、png、ico 格式，128 x 128')"
              :height="100"
              upload
            />
          </el-form-item>
          <el-form-item :label="$t('系统logo')" prop="logo_id">
            <FileImage
              v-model="model.logo_id"
              v-model:file-url="model.logo_url"
              :file-title="$t('上传logo')"
              :file-tip="$t('图片小于 200 KB，jpg、png 格式，150 x 150')"
              :height="100"
              upload
            />
          </el-form-item>
          <el-form-item :label="$t('登录背景图')" prop="login_bg_id">
            <FileImage
              v-model="model.login_bg_id"
              v-model:file-url="model.login_bg_url"
              :file-title="$t('上传登录背景图')"
              :file-tip="$t('图片小于 200 KB，jpg、png 格式，1920 x 1080')"
              :height="100"
              upload
            />
          </el-form-item>
          <el-form-item :label="$t('登录背景色')">
            <el-col :span="10">
              <el-color-picker
                v-model="model.login_bg_color"
                :predefine="[
                  '#f0f2f5',
                  '#2d3a4b',
                  '#1C2D56',
                  '#121E56',
                  '#2C8AFF',
                  '#09AEC2',
                  '#079583',
                  '#5F45CD',
                  '#E10E2D',
                  '#9a091f'
                ]"
                @change="loginBgColorChange"
              />
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('登录页面背景颜色') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('页面水印')" prop="is_watermark">
            <el-col :span="10">
              <ElSwitchOnoff v-model="model.is_watermark" />
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('开启后页面会显示水印') }}</el-text>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-form-item>
      <el-button :loading="loading" @click="refresh">{{ $t('刷新') }}</el-button>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { screenHeight } from '@/utils/index'
import { systemInfoApi as infoApi, systemEditApi as editApi } from '@/api/system/setting'
import { useSettingsStore } from '@/store/modules/settings'

export default {
  data() {
    return {
      name: '系统设置',
      loading: false,
      height: 680,
      model: {
        system_name: '',
        page_title: '',
        favicon_id: 0,
        favicon_url: '',
        logo_id: 0,
        logo_url: '',
        login_bg_id: 0,
        login_bg_url: '',
        login_bg_color: '',
        is_watermark: 0
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(270)
    this.info()
  },
  methods: {
    // 信息
    info(ismsg = false) {
      if (ismsg) {
        this.loading = true
      }
      infoApi()
        .then((res) => {
          this.model = res.data
          this.setting(this.model)
          this.loading = false
          if (ismsg) {
            ElMessage.success(res.msg)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 刷新
    refresh() {
      this.info(true)
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (!valid) {
          ElMessage.error(this.$t('请完善必填项'))
        } else {
          this.loading = true
          editApi(this.model)
            .then((res) => {
              this.setting(this.model)
              this.loading = false
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 设置
    setting(setting) {
      const settingsStore = useSettingsStore()
      settingsStore.changeSetting({ key: 'loginBgUrl', value: setting.login_bg_url })
      settingsStore.changeSetting({ key: 'loginBgColor', value: setting.login_bg_color })
      settingsStore.changeSetting({ key: 'systemName', value: setting.system_name })
      settingsStore.changeSetting({ key: 'pageTitle', value: setting.page_title })
      settingsStore.changeSetting({ key: 'faviconUrl', value: setting.favicon_url })
      settingsStore.changeSetting({ key: 'logoUrl', value: setting.logo_url })
      settingsStore.changeSetting({ key: 'watermarkEnabled', value: setting.is_watermark })
    },
    // 上传图片
    fileUpload(field, title = '') {
      this.fileField = field
      this.fileTitle = title
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(fileList) {
      this.fileDialog = false
      const fileField = this.fileField
      const fileLength = fileList.length
      if (fileLength) {
        const i = fileLength - 1
        if (fileField === 'favicon') {
          this.model.favicon_id = fileList[i]['file_id']
          this.model.favicon_url = fileList[i]['file_url']
        } else if (fileField === 'logo') {
          this.model.logo_id = fileList[i]['file_id']
          this.model.logo_url = fileList[i]['file_url']
        } else if (fileField === 'login_bg') {
          this.model.login_bg_id = fileList[i]['file_id']
          this.model.login_bg_url = fileList[i]['file_url']
        }
      }
    },
    fileDelete(field = '') {
      if (field === 'favicon') {
        this.model.favicon_id = 0
        this.model.favicon_url = ''
      } else if (field === 'logo') {
        this.model.logo_id = 0
        this.model.logo_url = ''
      } else if (field === 'login_bg') {
        this.model.login_bg_id = 0
        this.model.login_bg_url = ''
      }
    },
    // 登录背景色
    loginBgColorChange(val) {
      const settingsStore = useSettingsStore()
      settingsStore.changeSetting({ key: 'loginBgColor', value: val })
    }
  }
}
</script>
