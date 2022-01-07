<template>
  <el-card class="box-card dialog-body" :style="{height:height+'px'}">
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
          <div v-else style="width:210px;height:210px" />
        </el-form-item>
        <el-form-item>
          <el-button @click="clear()">清空</el-button>
          <el-button id="download" @click="download()">下载</el-button>
          <el-button type="primary" @click="submit()">生成</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'UtilsQrcode',
  components: { QrcodeVue },
  data() {
    return {
      height: 680,
      model: {
        str: '',
        url: '',
        value: '',
        size: 200
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(180)
  },
  methods: {
    clear() {
      this.model.str = ''
      this.model.value = ''
    },
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
        this.model.str = 'https://gitee.com/skyselang/yylAdmin'
        this.model.value = this.model.str
      }
    }
  }
}
</script>

<style scoped>
</style>
