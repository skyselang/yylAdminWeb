<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>IP信息</span>
    </div>
    <div class="text item">
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px">
        <el-form-item label="IP">
          <el-input v-model="model.ip" type="text" clearable />
        </el-form-item>
        <el-form-item label="国家">
          <el-input v-model="model.country" type="text" />
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="model.province" type="text" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="model.city" type="text" />
        </el-form-item>
        <el-form-item label="区县">
          <el-input v-model="model.area" type="text" />
        </el-form-item>
        <el-form-item label="运营商">
          <el-input v-model="model.isp" type="text" />
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
import { ipinfo } from '@/api/admin-utils'

export default {
  name: 'Ip',
  components: {},
  data() {
    return {
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
  created() {},
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
    }
  }
}
</script>

<style scoped>
</style>
