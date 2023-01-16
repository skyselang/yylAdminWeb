<template>
  <el-card>
    <el-form ref="ref" :model="model" :rules="rules" label-width="130px" class="dialog-body" :style="{height:height+'px'}">
      <el-form-item label="名称" prop="name">
        <el-col :span="12">
          <el-input v-model="model.name" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.name, $event)" />
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="原始ID" prop="origin_id">
        <el-col :span="12">
          <el-input v-model="model.origin_id" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.origin_id, $event)" />
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="小程序码" prop="qrcode_url">
        <el-col :span="12">
          <el-col :span="12">
            <el-image v-if="model.qrcode_url" class="ya-img-form" :src="model.qrcode_url" :preview-src-list="[model.qrcode_url]" title="点击看大图">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <el-image v-else class="ya-img-form">
              <div slot="error" class="image-slot" />
            </el-image>
          </el-col>
          <el-col :span="12">
            <el-button size="mini" @click="fileUpload()">上传小程序码</el-button>
            <el-button size="mini" @click="fileDelete()">删除</el-button>
            <p>图片小于 200 KB，jpg、png格式。</p>
          </el-col>
        </el-col>
      </el-form-item>
      <el-form-item label="* AppID" prop="appid">
        <el-col :span="12">
          <el-input v-model="model.appid" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.appid, $event)" />
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="* AppSecret" prop="appsecret">
        <el-col :span="12">
          <el-input v-model="model.appsecret" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.appsecret, $event)" />
          </el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <el-form ref="form" label-width="120px">
      <el-form-item>
        <el-button :loading="loading" @click="refresh()">刷新</el-button>
        <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="上传二维码" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </el-card>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import clip from '@/utils/clipboard'
import FileManage from '@/components/FileManage'
import { miniInfo, miniEdit } from '@/api/setting/wechat'

export default {
  name: 'SettingWechatMini',
  components: { FileManage },
  data() {
    return {
      name: '微信小程序',
      height: 680,
      loading: false,
      model: {
        name: '',
        origin_id: '',
        qrcode_id: 0,
        qrcode_url: '',
        appid: '',
        appsecret: ''
      },
      rules: {
      },
      fileDialog: false
    }
  },
  created() {
    this.height = screenHeight(270)
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
      miniInfo().then((res) => {
        this.model = res.data
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          miniEdit(this.model).then((res) => {
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 二维码
    fileUpload() {
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(filelists) {
      this.fileDialog = false
      this.model.qrcode_id = filelists[0]['file_id']
      this.model.qrcode_url = filelists[0]['file_url']
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
