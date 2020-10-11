<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>时间戳转换</span>
    </div>
    <div class="text item">
      <el-form ref="timeTranRef" :rules="timeTranRules" :model="timeTranModel" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="时间戳">
              <el-input v-model="timeTranModel.timestamp" class="timestamp" type="number" placeholder="请输入时间戳" clearable @input="timeTranValue('timestamp')" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="日期时间">
              <el-date-picker v-model="timeTranModel.datetime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期时间" clearable @change="timeTranValue('datetime')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="timeTranClear()">清空</el-button>
          <el-button type="primary" @click="timeTranSubmit()">转换</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { timeTran } from '@/api/admin'

export default {
  name: 'GatherTimeTran',
  components: {},
  data() {
    return {
      timeTranModel: {
        type: 'timestamp',
        value: '',
        timestamp: '',
        datetime: ''
      },
      timeTranRules: {}
    }
  },
  created() {},
  methods: {
    timeTranValue(type) {
      this.timeTranModel.type = type
      this.timeTranModel.value = this.timeTranModel[type]
    },
    timeTranClear() {
      this.timeTranModel.type = 'timestamp'
      this.timeTranModel.value = ''
      this.timeTranModel.datetime = ''
      this.timeTranModel.timestamp = ''
    },
    timeTranSubmit() {
      timeTran(this.timeTranModel).then((res) => {
        this.timeTranModel = res.data
      })
    }
  }
}
</script>

<style scoped>
.item {
  height: 410px;
}
.timestamp {
  width: 220px;
}
</style>
