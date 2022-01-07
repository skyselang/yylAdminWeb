<template>
  <el-card class="box-card dialog-body" :style="{height:height+'px'}">
    <div slot="header" class="clearfix">
      <span>IP信息</span>
    </div>
    <div class="text item">
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px">
        <el-form-item label="IP">
          <el-input v-model="model.ip" type="text" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.ip, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="国家">
          <el-input v-model="model.country" type="text">
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.country, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="model.province" type="text">
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.province, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="model.city" type="text">
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.city, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="区县">
          <el-input v-model="model.area" type="text">
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.area, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="运营商">
          <el-input v-model="model.isp" type="text">
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.isp, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="clear()">清空</el-button>
          <el-button type="primary" @click="submit()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import clip from '@/utils/clipboard'
import { ipinfo } from '@/api/admin/utils'

export default {
  name: 'UtilsIpinfo',
  components: {},
  data() {
    return {
      height: 680,
      model: {
        ip: '',
        country: '',
        province: '',
        city: '',
        area: '',
        isp: ''
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(180)
  },
  methods: {
    clear() {
      this.model = this.$options.data().model
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          ipinfo({
            ip: this.model.ip
          }).then(res => {
            this.model = res.data
          })
        }
      })
    },
    copy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message.error('请查询IP')
      }
    }
  }
}
</script>

<style scoped>

</style>
