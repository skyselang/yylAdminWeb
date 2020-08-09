<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>MD5加密</span>
    </div>
    <div class="text item" style="min-height:280px">
      <el-form ref="formRef" :rules="formRules" :model="formModel" label-width="80px" style="width: 80%; margin-left:50px;">
        <el-form-item label="文本内容" prop="str">
          <el-input v-model="formModel.str" placeholder="请输入文本内容" clearable />
        </el-form-item>
        <el-form-item label="MD5 16位">
          <el-input v-model="formModel.md5_16" clearable />
        </el-form-item>
        <el-form-item label="MD5 32位">
          <el-input v-model="formModel.md5_32" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCopy(formModel.md5_16, $event)">
            复制16
          </el-button>
          <el-button type="primary" @click="handleCopy(formModel.md5_32, $event)">
            复制32
          </el-button>
          <el-button type="primary" @click="md5encSubmit(formModel.raw)">
            加密
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import clip from '@/utils/clipboard'
import { md5Enc } from '@/api/admin'

export default {
  name: 'Md5Enc',
  components: {},
  data() {
    return {
      formModel: {
        str: '',
        md5_16: '',
        md5_32: ''
      },
      formRules: {
        str: [{ required: true, message: '请输入文本内容', trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    handleCopy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message({
          message: '请点击MD5加密',
          type: 'error'
        })
      }
    },
    md5encSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          md5Enc({ str: this.formModel.str }).then(res => {
            this.formModel.md5_16 = res.data.md5_16
            this.formModel.md5_32 = res.data.md5_32
          })
        }
      })
    }
  }
}
</script>
