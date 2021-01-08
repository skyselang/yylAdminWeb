<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>IP查询</span>
    </div>
    <div class="text item">
      <el-form ref="ipQueryRef" :model="ipQueryModel" :rules="ipQueryRules" label-width="100px">
        <el-form-item label="IP">
          <el-input v-model="ipQueryModel.ip" type="text" clearable />
        </el-form-item>
        <el-form-item label="国家">
          <el-input v-model="ipQueryModel.country" type="text" />
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="ipQueryModel.province" type="text" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="ipQueryModel.city" type="text" />
        </el-form-item>
        <el-form-item label="区县">
          <el-input v-model="ipQueryModel.area" type="text" />
        </el-form-item>
        <el-form-item label="运营商">
          <el-input v-model="ipQueryModel.isp" type="text" />
        </el-form-item>
        <el-form-item>
          <el-button @click="ipQueryClear()">清空</el-button>
          <el-button type="primary" @click="ipQuerySubmit()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { ipQuery } from '@/api/admin'

export default {
  name: 'MixIpQuery',
  components: {},
  data() {
    return {
      ipQueryModel: {
        ip: '',
        country: '',
        province: '',
        city: '',
        area: '',
        isp: ''
      },
      ipQueryRules: {}
    }
  },
  created() {},
  methods: {
    ipQueryClear() {
      this.ipQueryModel = this.$options.data().ipQueryModel
    },
    ipQuerySubmit() {
      this.$refs['ipQueryRef'].validate(valid => {
        if (valid) {
          ipQuery({
            ip: this.ipQueryModel.ip
          }).then(res => {
            this.ipQueryModel = res.data
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
