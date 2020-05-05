<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>生成二维码</span>
    </div>
    <div class="text item" style="height:280px">
      <el-form
        ref="qrcodeRef"
        :rules="qrcodeRules"
        :model="qrcodeModel"
        label-position="right"
        label-width="80px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="文本" prop="qrcode_str">
          <el-input v-model="qrcodeModel.qrcode_str" clearable />
        </el-form-item>
        <el-form-item label="二维码" prop="qrcode_url">
          <img
            v-if="qrcodeModel.qrcode_url"
            :src="qrcodeModel.qrcode_url"
            style="width:140px;height:140px"
            title="右击图片另存为"
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="download()">
            下载
          </el-button>
          <el-button type="primary" @click="qrcodeSubmit(qrcodeModel.raw)">
            生成
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { Qrcode } from '@/api/admin-tool'

export default {
  name: 'Qrcode',
  components: {},
  data() {
    return {
      qrcodeModel: {
        qrcode_str: '',
        qrcode_url: ''
      },
      qrcodeRules: {
        qrcode_str: [{ required: true, message: '请输入文本', trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    download() {
      if (this.qrcodeModel.qrcode_url) {
        window.open(this.qrcodeModel.qrcode_url)
      } else {
        this.$message({
          message: '请生成二维码',
          type: 'error'
        })
      }
    },
    qrcodeSubmit() {
      this.$refs['qrcodeRef'].validate(valid => {
        if (valid) {
          const qrcode = {
            qrcode_str: this.qrcodeModel.qrcode_str
          }
          Qrcode(qrcode).then(res => {
            this.qrcodeModel.qrcode_url = res.data.qrcode_url
          })
        }
      })
    }
  }
}
</script>
