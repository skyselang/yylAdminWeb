<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>生成二维码</span>
    </div>
    <div class="text item">
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px">
        <el-form-item label="文本内容" prop="str">
          <el-input v-model="model.str" placeholder="请输入文本内容" clearable />
        </el-form-item>
        <el-form-item id="qrcode" label="二维码" prop="value" style="margin-bottom: 0;">
          <qrcode-vue v-if="model.value" v-model="model.value" :size="model.size" />
          <el-image v-else style="width: 200px; height: 200px">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </el-form-item>
        <el-form-item>
          <el-button id="download" @click="download()">下载</el-button>
          <el-button type="primary" @click="submit()">生成</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'UtilsQrcode',
  components: { QrcodeVue },
  data() {
    return {
      model: {
        str: '',
        url: '',
        value: '',
        size: 200
      },
      rules: {
        str: [{ required: true, message: '请输入文本内容', trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    download() {
      if (this.model.value) {
        const canvas = document.getElementById('qrcode').getElementsByTagName('canvas')
        const a = document.createElement('a')
        a.href = canvas[0].toDataURL('img/png')
        a.download = '二维码qrcode'
        a.click()
      } else {
        this.$message.error('请生成二维码')
      }
    },
    submit() {
      if (this.model.str) {
        this.model.value = this.model.str
      } else {
        this.$message.error('请输入文本内容')
      }
    }
  }
}
</script>

<style scoped>
.item {
  height: 410px;
}
</style>
