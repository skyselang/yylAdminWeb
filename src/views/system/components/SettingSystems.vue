<template>
  <el-scrollbar native :height="height">
    <el-row>
      <el-col :span="16">
        <el-form ref="ref" :model="model" label-width="120px">
          <el-form-item label="* 系统简称" prop="system_name">
            <el-col :span="8">
              <el-input v-model="model.system_name" type="text" clearable />
            </el-col>
            <el-col :span="16"> 侧边栏、登录页显示。</el-col>
          </el-form-item>
          <el-form-item label="* 页面标题" prop="page_title">
            <el-col :span="8">
              <el-input v-model="model.page_title" type="text" clearable />
            </el-col>
            <el-col :span="16"> 浏览器页面标题后缀。 </el-col>
          </el-form-item>
          <el-form-item label="网页图标" prop="favicon_id">
            <FileImage
              v-model="model.favicon_id"
              :file-url="model.favicon_url"
              file-title="上传favicon"
              file-tip="图片小于 50 KB，jpg、png、ico格式，128 x 128。"
              :height="50"
              upload
            />
          </el-form-item>
          <el-form-item label="系统logo" prop="logo_id">
            <FileImage
              v-model="model.logo_id"
              :file-url="model.logo_url"
              file-title="上传logo"
              file-tip="图片小于 200 KB，jpg、png格式，150 x 150。"
              :height="100"
              upload
            />
          </el-form-item>
          <el-form-item label="登录背景图" prop="login_bg_id">
            <FileImage
              v-model="model.login_bg_id"
              :file-url="model.login_bg_url"
              file-title="上传登录背景图"
              file-tip="图片小于 200 KB，jpg、png格式，1920 x 1080。"
              :height="100"
              upload
            />
          </el-form-item>
          <el-form-item label="登录背景色">
            <el-col :span="8">
              <el-color-picker
                v-model="model.login_bg_color"
                :predefine="[
                  '#2d3a4b',
                  '#2C8AFF',
                  '#1C2D56',
                  '#121E56',
                  '#079583',
                  '#09AEC2',
                  '#5F45CD',
                  '#E10E2D'
                ]"
                @change="loginBgColorChange"
              />
            </el-col>
            <el-col :span="16">
              <el-text size="default">登录页面背景颜色。</el-text>
            </el-col>
          </el-form-item>
          <el-form-item label="分页每页数量" prop="page_limit">
            <el-col :span="8">
              <el-input v-model="model.page_limit" type="number" />
            </el-col>
            <el-col :span="16">
              <el-text size="default">分页每页默认显示数量。</el-text>
            </el-col>
          </el-form-item>
          <el-form-item label="页面水印" prop="is_watermark">
            <el-col :span="8">
              <el-switch v-model="model.is_watermark" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              <el-text size="default">开启后页面会显示水印。</el-text>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" @click="refresh()">刷新</el-button>
            <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { systemInfo, systemEdit } from '@/api/system/setting'
import { useSettingsStore } from '@/store/modules/settings'

export default {
  name: 'SystemSettingSystem',
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
        page_limit: 20,
        is_watermark: 0
      }
    }
  },
  created() {
    this.height = screenHeight(210)
    this.info()
  },
  methods: {
    // 信息
    info() {
      systemInfo().then((res) => {
        this.model = res.data
        this.setting(this.model)
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      systemInfo()
        .then((res) => {
          this.model = res.data
          this.loading = false
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          systemEdit(this.model)
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
    setting(setting) {
      const settingsStore = useSettingsStore()
      settingsStore.changeSetting({ key: 'loginBgUrl', value: setting.login_bg_url })
      settingsStore.changeSetting({ key: 'loginBgColor', value: setting.login_bg_color })
      settingsStore.changeSetting({ key: 'systemName', value: setting.system_name })
      settingsStore.changeSetting({ key: 'pageTitle', value: setting.page_title })
      settingsStore.changeSetting({ key: 'faviconUrl', value: setting.favicon_url })
      settingsStore.changeSetting({ key: 'logoUrl', value: setting.logo_url })
      settingsStore.changeSetting({ key: 'pageLimit', value: setting.page_limit })
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
