<template>
  <el-card v-loading="loading" class="box-card">
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
            <el-col :span="12">
              <el-image shape="circle" fit="contain" style="height: 100px" :src="model.qrcode_url" :preview-src-list="[model.qrcode_url]">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </el-col>
            <el-col :span="12">
              <el-upload
                name="file"
                :show-file-list="false"
                :action="uploadAction"
                :headers="uploadHeaders"
                :data="uploadData"
                :on-success="uploadSuccess"
                :on-error="uploadError"
              >
                <el-button>上传</el-button>
              </el-upload>
              <span>jpg、png图片，小于200KB，宽高1:1</span>
            </el-col>
          </el-form-item>
          <el-form-item label="AppID" prop="appid">
            <el-input v-model="model.appid" />
          </el-form-item>
          <el-form-item label="AppSecret" prop="appsecret">
            <el-input v-model="model.appsecret" />
          </el-form-item>
          <el-form-item label="服务器地址(URL)" prop="url">
            <el-input v-model="model.url" />
          </el-form-item>
          <el-form-item label="令牌(Token)" prop="token">
            <el-input v-model="model.token" />
          </el-form-item>
          <el-form-item label="消息加解密密钥" prop="encoding_aes_key">
            <el-input v-model="model.encoding_aes_key" />
          </el-form-item>
          <el-form-item label="消息加解密方式" prop="encoding_aes_type">
            <el-radio-group v-model="model.encoding_aes_type">
              <el-radio v-for="item in encoding_aes_types" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button @click="refresh()">刷新</el-button>
            <el-button type="primary" @click="submit()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { offiInfo, offiEdit } from '@/api/wechat-config'
import { getAdminUserId, getAdminToken } from '@/utils/auth'

export default {
  components: {},
  data() {
    return {
      loading: false,
      encoding_aes_types: [
        { value: 1, label: '明文模式' },
        { value: 2, label: '兼容模式' },
        { value: 3, label: '安全模式' }
      ],
      model: {
        name: '',
        origin_id: '',
        qrcode: '',
        appid: '',
        appsecret: '',
        url: '',
        token: '',
        encoding_aes_key: '',
        encoding_aes_type: 1,
        qrcode_url: ''
      },
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/WechatConfig/qrcode',
      uploadHeaders: { AdminUserId: getAdminUserId(), AdminToken: getAdminToken() },
      uploadData: { type: 'offi' },
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
      offiInfo().then((res) => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      offiInfo()
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
          offiEdit(this.model)
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
