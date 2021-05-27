<template>
  <el-card class="box-card">
    <el-row :gutter="0">
      <el-col :xs="24" :sm="12">
        <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="model.name" />
          </el-form-item>
          <el-form-item label="原始ID" prop="origin_id">
            <el-input v-model="model.origin_id" />
          </el-form-item>
          <el-form-item label="二维码" prop="qrcode">
            <el-image shape="circle" fit="contain" style="height: 100px" :src="model.qrcode_url" :preview-src-list="[model.qrcode_url]">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <el-upload
              name="file"
              :show-file-list="false"
              :action="uploadAction"
              :headers="uploadHeaders"
              :data="uploadData"
              :on-success="uploadSuccess"
              :on-error="uploadError"
            >
              <el-button size="mini">上传</el-button>
            </el-upload>
            <span>jpg、png图片，小于200KB，宽高1:1</span>
          </el-form-item>
          <el-form-item label="AppID" prop="appid">
            <el-input v-model="model.appid" />
          </el-form-item>
          <el-form-item label="AppSecret" prop="appsecret">
            <el-input v-model="model.appsecret" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" @click="refresh()">刷新</el-button>
            <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { miniInfo, miniEdit } from '@/api/setting-wechat'
import { getAdminToken } from '@/utils/auth'

export default {
  components: {},
  data() {
    return {
      loading: false,
      model: {
        name: '',
        origin_id: '',
        qrcode: '',
        appid: '',
        appsecret: '',
        qrcode_url: ''
      },
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/SettingWechat/qrcode',
      uploadHeaders: { AdminToken: getAdminToken() },
      uploadData: { type: 'mini' },
      rules: {
        appid: [{ required: true, message: '请输入appid', trigger: 'blur' }],
        appsecret: [{ required: true, message: '请输入appsecret', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.info()
  },
  methods: {
    // 信息
    info() {
      miniInfo().then((res) => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      miniInfo()
        .then((res) => {
          this.model = res.data
          this.loading = false
          this.$message.success(res.msg)
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
          miniEdit(this.model)
            .then((res) => {
              this.info()
              this.loading = false
              this.$message.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 上传二维码
    uploadSuccess(res, file) {
      if (res.code === 200) {
        this.model.qrcode_url = res.data.file_url
        this.model.qrcode = res.data.file_path
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    uploadError(res, file) {
      this.$message.error('上传出错')
    }
  }
}
</script>
