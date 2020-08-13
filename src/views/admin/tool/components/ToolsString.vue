<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>字符串</span>
    </div>
    <div class="text item">
      <el-form ref="formRef" :rules="formRules" :model="formModel" label-width="80px">
        <el-form-item label="字符串" prop="str">
          <el-input v-model="formModel.str" type="textarea" placeholder="请输入字符串" clearable />
        </el-form-item>
        <el-form-item label="长度">
          <el-input v-model="formModel.len" clearable />
        </el-form-item>
        <el-form-item label="小写">
          <el-input v-model="formModel.lower" clearable />
        </el-form-item>
        <el-form-item label="大写">
          <el-input v-model="formModel.upper" clearable />
        </el-form-item>
        <el-form-item label="反转">
          <el-input v-model="formModel.rev" clearable />
        </el-form-item>
        <el-form-item label="MD5">
          <el-input v-model="formModel.md5" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="stringClear()">
            清空
          </el-button>
          <el-button type="primary" @click="stringSubmit()">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { string } from '@/api/admin'

export default {
  name: 'ToolsString',
  components: {},
  data() {
    return {
      formModel: {
        str: '',
        len: '',
        lower: '',
        upper: '',
        rev: '',
        md5: ''
      },
      formRules: {
        str: [{ required: true, message: '请输入字符串', trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    stringClear() {
      this.formModel.str = ''
      this.formModel.len = ''
      this.formModel.lower = ''
      this.formModel.upper = ''
      this.formModel.rev = ''
      this.formModel.md5 = ''
    },
    stringSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          string({ str: this.formModel.str }).then(res => {
            this.formModel = res.data
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.item {
  height: 400px;
}
</style>
