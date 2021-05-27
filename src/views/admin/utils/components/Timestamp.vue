<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>时间戳转换</span>
    </div>
    <div class="text item">
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px">
        <el-form-item label="时间戳">
          <el-input v-model="model.timestamp" type="number" prefix-icon="el-icon-stopwatch" placeholder="请输入时间戳" clearable @input="value('timestamp')" />
          <el-button icon="el-icon-document-copy" @click="copy(model.datetime, $event)" />
        </el-form-item>
        <el-form-item label="日期时间">
          <el-date-picker v-model="model.datetime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期时间" clearable @change="value('datetime')" />
          <el-button icon="el-icon-document-copy" @click="copy(model.datetime, $event)" />
        </el-form-item>
        <el-form-item>
          <el-button @click="clear()">清空</el-button>
          <el-button type="primary" @click="submit()">转换</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import clip from '@/utils/clipboard'
import { timestamp } from '@/api/admin-utils'

export default {
  name: 'Timestamp',
  components: {},
  data() {
    return {
      model: {
        type: 'timestamp',
        value: '',
        timestamp: '',
        datetime: ''
      },
      rules: {}
    }
  },
  created() { },
  methods: {
    value(type) {
      this.model.type = type
      this.model.value = this.model[type]
    },
    clear() {
      this.model = this.$options.data().model
    },
    submit() {
      timestamp(this.model).then((res) => {
        this.model = res.data
      })
    },
    copy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message.error('请转换时间戳')
      }
    }
  }
}
</script>

<style scoped>
  .el-input{width: 90%;}
</style>
