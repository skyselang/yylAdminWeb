<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>字符串转换</span>
    </div>
    <div class="text item">
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px">
        <el-form-item label="字符串" prop="str">
          <el-input v-model="model.str" type="textarea" placeholder="请输入字符串" clearable />
        </el-form-item>
        <el-form-item label="长度" prop="len">
          <el-input v-model="model.len" clearable />
        </el-form-item>
        <el-form-item label="小写" prop="lower">
          <el-input v-model="model.lower" clearable />
        </el-form-item>
        <el-form-item label="大写" prop="upper">
          <el-input v-model="model.upper" clearable />
        </el-form-item>
        <el-form-item label="反转" prop="rev">
          <el-input v-model="model.rev" clearable />
        </el-form-item>
        <el-form-item label="MD5" prop="md5">
          <el-input v-model="model.md5" clearable />
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
import { strtran } from '@/api/admin-utils'

export default {
  name: 'UtilsStrtran',
  components: {},
  data() {
    return {
      model: {
        str: '',
        len: '',
        lower: '',
        upper: '',
        rev: '',
        md5: ''
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
          strtran({
            str: this.model.str
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
.item {
  height: 410px;
}
</style>
