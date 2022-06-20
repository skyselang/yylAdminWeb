<template>
  <el-card class="dialog-body" :style="{height:height+'px'}">
    <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
      <el-form-item label="系统简称" prop="system_name">
        <el-col :span="8">
          <el-input v-model="model.system_name" type="text" clearable />
        </el-col>
        <el-col :span="16">
          侧边栏、登录页显示，12字以内。
        </el-col>
      </el-form-item>
      <el-form-item label="页面标题" prop="page_title">
        <el-col :span="8">
          <el-input v-model="model.page_title" type="text" clearable />
        </el-col>
        <el-col :span="16">
          浏览器页面标题后缀，128字以内。
        </el-col>
      </el-form-item>
      <el-form-item label="logo" prop="logo_id">
        <el-col :span="18">
          <el-col :span="8">
            <el-image class="image-logo" :src="model.logo_url" :preview-src-list="[model.logo_url]" title="点击查看大图">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-col>
          <el-col :span="16">
            <el-button size="mini" @click="fileUpload('logo', '上传logo')">上传logo</el-button>
            <el-button size="mini" @click="fileDelete('logo')">删除</el-button>
            <p>jpg、png图片，200 x 200，小于 100 KB。</p>
          </el-col>
        </el-col>
      </el-form-item>
      <el-form-item label="favicon" prop="favicon_id">
        <el-col :span="18">
          <el-col :span="8">
            <el-image class="image-favicon" :src="model.favicon_url" :preview-src-list="[model.favicon_url]" title="点击查看大图">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-col>
          <el-col :span="16">
            <el-button size="mini" @click="fileUpload('favicon', '上传favicon')">上传favicon</el-button>
            <el-button size="mini" @click="fileDelete('favicon')">删除</el-button>
            <p>jpg、png、ico图片，128 x 128，小于 50 KB。</p>
          </el-col>
        </el-col>
      </el-form-item>
      <el-form-item label="登录背景图" prop="login_bg_id">
        <el-col :span="18">
          <el-col :span="8">
            <el-image class="image-login-bg" :src="model.login_bg_url" :preview-src-list="[model.login_bg_url]" title="点击查看大图">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-col>
          <el-col :span="16">
            <el-button size="mini" @click="fileUpload('login_bg', '上传登录背景')">上传背景图</el-button>
            <el-button size="mini" @click="fileDelete('login_bg')">删除</el-button>
            <p>jpg、png图片，1920 x 1080，小于 300 KB。</p>
          </el-col>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" @click="refresh()">刷新</el-button>
        <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>
    <!-- 文件管理 -->
    <el-dialog :title="fileTitle" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </el-card>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import FileManage from '@/components/FileManage'
import { systemInfo, systemEdit } from '@/api/admin/setting'

export default {
  name: 'AdminSettingSystem',
  components: { FileManage },
  data() {
    return {
      name: '系统设置',
      loading: false,
      model: {
        system_name: '',
        page_title: '',
        logo_id: 0,
        logo_url: '',
        favicon_id: 0,
        favicon_url: '',
        login_bg_id: 0,
        login_bg_url: ''
      },
      fileDialog: false,
      fileField: 'logo',
      fileTitle: '文件管理',
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(180)
    this.info()
  },
  methods: {
    // 信息
    info() {
      systemInfo().then(res => {
        this.model = res.data
        this.$store.dispatch('settings/changeSetting', { key: 'systemName', value: res.data.system_name })
        this.$store.dispatch('settings/changeSetting', { key: 'pageTitle', value: res.data.page_title })
        this.$store.dispatch('settings/changeSetting', { key: 'logoUrl', value: res.data.logo_url })
        this.$store.dispatch('settings/changeSetting', { key: 'faviconUrl', value: res.data.favicon_url })
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      systemInfo().then((res) => {
        this.model = res.data
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          systemEdit(this.model).then(res => {
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
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
    fileSubmit(filelists) {
      this.fileDialog = false
      this.fileTitle = ''
      if (this.fileField === 'logo') {
        this.model.logo_id = filelists[0]['file_id']
        this.model.logo_url = filelists[0]['file_url']
      } else if (this.fileField === 'favicon') {
        this.model.favicon_id = filelists[0]['file_id']
        this.model.favicon_url = filelists[0]['file_url']
      } else if (this.fileField === 'login_bg') {
        this.model.login_bg_id = filelists[0]['file_id']
        this.model.login_bg_url = filelists[0]['file_url']
      }
    },
    fileDelete(field = '') {
      if (field === 'logo') {
        this.model.logo_id = 0
        this.model.logo_url = ''
      } else if (field === 'favicon') {
        this.model.favicon_id = 0
        this.model.favicon_url = ''
      } else if (field === 'login_bg') {
        this.model.login_bg_id = 0
        this.model.login_bg_url = ''
      }
    }
  }
}
</script>

<style scoped>
.image-logo{
  width: 60px;
  height: 100%;
}
.image-favicon{
  width: 32px;
  height: 100%;
}
.image-login-bg{
  width: 150px;
  height: 100%;
}
</style>
