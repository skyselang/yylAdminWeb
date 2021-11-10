<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="0">
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
                <el-image style="width:100px; height:100px;" :src="model.qrcode_url" :preview-src-list="[model.qrcode_url]" title="点击查看大图">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </el-col>
              <el-col :span="14">
                <el-button size="mini" @click="fileUpload()">上传二维码</el-button>
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
            <el-form-item>
              <el-button :loading="loading" @click="refresh()">刷新</el-button>
              <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="上传二维码" :visible.sync="fileDialog" width="80%" top="1vh">
      <file-manage file-type="image" @file-lists="fileLists" />
    </el-dialog>
  </div>
</template>

<script>
import clip from '@/utils/clipboard'
import FileManage from '@/components/FileManage'
import { miniInfo, miniEdit } from '@/api/setting-wechat'

export default {
  name: 'SettingWechatMini',
  components: { FileManage },
  data() {
    return {
      loading: false,
      model: {
        name: '',
        origin_id: '',
        appid: '',
        appsecret: '',
        qrcode_id: 0,
        qrcode_url: ''
      },
      fileDialog: false,
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
    fileUpload() {
      this.fileDialog = true
    },
    fileLists(filelists) {
      this.fileDialog = false
      this.model.qrcode_id = filelists[0]['file_id']
      this.model.qrcode_url = filelists[0]['file_url']
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
