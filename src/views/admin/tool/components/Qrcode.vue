<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>生成二维码</span>
    </div>
    <div class="text item" style="height:280px">
      <el-form
        ref="formRef"
        :rules="formRules"
        :model="formModel"
        label-position="right"
        label-width="80px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="文本" prop="qrcode_str">
          <el-input
            v-model="formModel.qrcode_str"
            placeholder="请输入文本内容"
            clearable
          />
        </el-form-item>
        <el-form-item label="二维码" prop="qrcode_url">
          <el-image
            v-if="formModel.qrcode_url"
            style="width: 150px; height: 150px"
            :src="formModel.qrcode_url"
            fit="fill"
            title="右击图片另存为"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="download()">
            下载
          </el-button>
          <el-button type="primary" @click="qrcodeSubmit(formModel.raw)">
            生成
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { Qrcode } from '@/api/admin'

export default {
  name: 'Qrcode',
  components: {},
  data() {
    return {
      formModel: {
        qrcode_str: '',
        qrcode_url: ''
      },
      formRules: {
        qrcode_str: [
          { required: true, message: '请输入文本内容', trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
  methods: {
    download() {
      if (this.formModel.qrcode_url) {
        window.open(this.formModel.qrcode_url)
      } else {
        this.$message({
          message: '请生成二维码',
          type: 'error'
        })
      }
    },
    qrcodeSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          Qrcode({ qrcode_str: this.formModel.qrcode_str }).then(res => {
            this.formModel.qrcode_url = res.data.qrcode_url
          })
        }
      })
    }
  }
}
</script>
