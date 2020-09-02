<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>时间戳转换</span>
    </div>
    <div class="text item">
      <el-form ref="formRef" :rules="formRules" :model="formModel" label-width="80px">
        <el-row>
          <el-col :sm="{span:24}" :md="{span:24}">
            <el-form-item label="时间">
              <el-date-picker v-model="formModel.datetime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="{span:24}" :md="{span:24}">
            <el-form-item label="时间戳">
              <el-input v-model="formModel.timestamp" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="timestampSubmit()">
            转时间
          </el-button>
          <el-button type="primary" @click="datetimeSubmit()">
            转时间戳
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { timestamp } from '@/api/admin'

export default {
  name: 'ToolsTimestamp',
  components: {},
  data() {
    return {
      formModel: {
        trantype: 'time',
        datetime: '',
        timestamp: ''
      },
      formRules: {}
    }
  },
  created() {},
  methods: {
    datetimeSubmit() {
      if (!this.formModel.datetime) {
        this.$message({
          message: '请选择时间',
          type: 'error'
        })
      } else {
        this.formModel.trantype = 'time'
        timestamp(this.formModel).then(res => {
          this.formModel.datetime = res.data.datetime
          this.formModel.timestamp = res.data.timestamp
        })
      }
    },
    timestampSubmit() {
      if (!this.formModel.timestamp) {
        this.$message({
          message: '请输入时间戳',
          type: 'error'
        })
      } else {
        this.formModel.trantype = 'date'
        timestamp(this.formModel).then(res => {
          this.formModel.datetime = res.data.datetime
          this.formModel.timestamp = res.data.timestamp
        })
      }
    }
  }
}
</script>

<style scoped>
.item {
  height: 255px;
}
</style>
