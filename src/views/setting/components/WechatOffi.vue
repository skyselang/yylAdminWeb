<template>
  <div>
    <el-card class="box-card">
      <el-row class="dialog-body" :style="{height:height+'px'}">
        <el-col :xs="24" :sm="18" :md="12">
          <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="model.name">
                <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.name, $event)" />
              </el-input>
            </el-form-item>
            <el-form-item label="原始ID" prop="origin_id">
              <el-input v-model="model.origin_id">
                <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.origin_id, $event)" />
              </el-input>
            </el-form-item>
            <el-form-item label="二维码" prop="qrcode_url">
              <el-col :span="10">
                <el-image class="ya-img-form" :src="model.qrcode_url" :preview-src-list="[model.qrcode_url]" title="点击查看大图">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </el-col>
              <el-col :span="14">
                <el-button size="mini" @click="fileUpload()">上传二维码</el-button>
                <el-button size="mini" @click="fileDelete()">删除</el-button>
                <br>
                <span>jpg、png图片，小于200kb，宽高1:1</span>
              </el-col>
            </el-form-item>
            <el-form-item label="AppID" prop="appid">
              <el-input v-model="model.appid">
                <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.appid, $event)" />
              </el-input>
            </el-form-item>
            <el-form-item label="AppSecret" prop="appsecret">
              <el-input v-model="model.appsecret">
                <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.appsecret, $event)" />
              </el-input>
            </el-form-item>
            <el-form-item label="服务器地址(URL)" prop="server_url">
              <el-input v-model="model.server_url">
                <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.server_url, $event)" />
              </el-input>
            </el-form-item>
            <el-form-item label="令牌(Token)" prop="token">
              <el-input v-model="model.token">
                <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.token, $event)" />
              </el-input>
            </el-form-item>
            <el-form-item label="消息加解密密钥" prop="encoding_aes_key">
              <el-input v-model="model.encoding_aes_key">
                <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.encoding_aes_key, $event)" />
              </el-input>
            </el-form-item>
            <el-form-item label="消息加解密方式" prop="encoding_aes_type">
              <el-radio-group v-model="model.encoding_aes_type">
                <el-radio v-for="item in encoding_aes_types" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" @click="refresh()">刷新</el-button>
              <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="上传二维码" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import clip from '@/utils/clipboard'
import FileManage from '@/components/FileManage'
import { offiInfo, offiEdit } from '@/api/setting-wechat'

export default {
  name: 'WechatOffi',
  components: { FileManage },
  data() {
    return {
      name: '微信公众号',
      height: 680,
      loading: false,
      encoding_aes_types: [
        { value: 1, label: '明文模式' },
        { value: 2, label: '兼容模式' },
        { value: 3, label: '安全模式' }
      ],
      model: {
        name: '',
        origin_id: '',
        qrcode_id: 0,
        qrcode_url: '',
        appid: '',
        appsecret: '',
        server_url: '',
        token: '',
        encoding_aes_key: '',
        encoding_aes_type: 1
      },
      fileDialog: false,
      rules: {
        appid: [{ required: true, message: '请输入appid', trigger: 'blur' }],
        appsecret: [{ required: true, message: '请输入appsecret', trigger: 'blur' }]
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
    fileUpload() {
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(filelist) {
      this.fileDialog = false
      if (filelist) {
        this.model.qrcode_id = filelist[0]['file_id']
        this.model.qrcode_url = filelist[0]['file_url']
      }
    },
    fileDelete() {
      this.model.qrcode_id = 0
      this.model.qrcode_url = ''
    },
    // 复制
    copy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message.error('内容为空')
      }
    }
  }
}
</script>

<style scoped>

</style>
