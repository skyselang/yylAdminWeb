<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>生成二维码</span>
    </div>
    <div class="text item">
      <el-form ref="formRef" :rules="formRules" :model="formModel" label-width="80px">
        <el-form-item label="文本内容" prop="str">
          <el-input v-model="formModel.str" placeholder="请输入文本内容" clearable />
        </el-form-item>
        <el-form-item label="二维码" prop="qrl">
          <el-image v-if="formModel.url" style="width: 150px; height: 150px" :src="formModel.url" fit="fill" title="右击图片另存为" />
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
import { qrcode } from '@/api/admin'

export default {
  name: 'ToolsQrcode',
  components: {},
  data() {
    return {
      formModel: {
        str: '',
        url: ''
      },
      formRules: {
        str: [{ required: true, message: '请输入文本内容', trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    download() {
      if (this.formModel.url) {
        window.open(this.formModel.url)
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
          qrcode({ str: this.formModel.str }).then(res => {
            this.formModel.url = res.data.url
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.item {
  height: 280px;
}
</style>
