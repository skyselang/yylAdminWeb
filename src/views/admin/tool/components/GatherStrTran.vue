<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>字符串转换</span>
    </div>
    <div class="text item">
      <el-form ref="strTranRef" :rules="strTranRules" :model="strTranModel" label-width="80px">
        <el-form-item label="字符串" prop="">
          <el-input v-model="strTranModel.str" type="textarea" placeholder="请输入字符串" clearable />
        </el-form-item>
        <el-form-item label="长度">
          <el-input v-model="strTranModel.len" clearable />
        </el-form-item>
        <el-form-item label="小写">
          <el-input v-model="strTranModel.lower" clearable />
        </el-form-item>
        <el-form-item label="大写">
          <el-input v-model="strTranModel.upper" clearable />
        </el-form-item>
        <el-form-item label="反转">
          <el-input v-model="strTranModel.rev" clearable />
        </el-form-item>
        <el-form-item label="MD5">
          <el-input v-model="strTranModel.md5" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="strTranClear()">清空</el-button>
          <el-button type="primary" @click="strTranSubmit()">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { strTran } from '@/api/admin'

export default {
  name: 'GatherStrTran',
  components: {},
  data() {
    return {
      strTranModel: {
        str: '',
        len: '',
        lower: '',
        upper: '',
        rev: '',
        md5: ''
      },
      strTranRules: {
        str: [{ required: true, message: '请输入字符串', trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    strTranClear() {
      this.strTranModel.str = ''
      this.strTranModel.len = ''
      this.strTranModel.lower = ''
      this.strTranModel.upper = ''
      this.strTranModel.rev = ''
      this.strTranModel.md5 = ''
    },
    strTranSubmit() {
      this.$refs['strTranRef'].validate(valid => {
        if (valid) {
          strTran({ str: this.strTranModel.str }).then(res => {
            this.strTranModel = res.data
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
