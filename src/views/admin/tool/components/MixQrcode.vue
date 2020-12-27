<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>生成二维码</span>
    </div>
    <div class="text item">
      <el-form ref="qrcodeRef" :model="qrcodeModel" :rules="qrcodeRules" label-width="100px">
        <el-form-item label="文本内容" prop="str">
          <el-input v-model="qrcodeModel.str" placeholder="请输入文本内容" clearable />
        </el-form-item>
        <el-form-item label="二维码" prop="url" style="margin-bottom: 0;">
          <el-image style="width: 150px; height: 150px" :src="qrcodeModel.url" fit="fill" title="右击图片另存为">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </el-form-item>
        <el-form-item>
          <el-button @click="qrcodeDown()">下载</el-button>
          <el-button type="primary" @click="qrcodeSubmit()">生成</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { qrcode } from '@/api/admin'

export default {
  name: 'MixQrcode',
  components: {},
  data() {
    return {
      qrcodeModel: {
        str: '',
        url: ''
      },
      qrcodeRules: {}
    }
  },
  created() {},
  methods: {
    qrcodeDown() {
      if (this.qrcodeModel.url) {
        window.open(this.qrcodeModel.url)
      } else {
        this.$message.error('请生成二维码')
      }
    },
    qrcodeSubmit() {
      this.$refs['qrcodeRef'].validate(valid => {
        if (valid) {
          qrcode({
            str: this.qrcodeModel.str
          }).then(res => {
            this.qrcodeModel = res.data
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.item {
  height: 410px;
}
</style>
