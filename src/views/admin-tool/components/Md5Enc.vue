<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>MD5加密</span>
    </div>
    <div class="text item" style="height:280px">
      <el-form
        ref="md5encRef"
        :rules="md5encRules"
        :model="md5encModel"
        label-position="right"
        label-width="80px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="字符串" prop="str">
          <el-input v-model="md5encModel.str" clearable />
        </el-form-item>
        <el-form-item label="MD5 16位">
          <el-input v-model="md5encModel.md5_16" clearable />
        </el-form-item>
        <el-form-item label="MD5 32位">
          <el-input v-model="md5encModel.md5_32" clearable />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleCopy(md5encModel.md5_16, $event)"
          >
            复制16
          </el-button>
          <el-button
            type="primary"
            @click="handleCopy(md5encModel.md5_32, $event)"
          >
            复制32
          </el-button>
          <el-button type="primary" @click="md5encSubmit(md5encModel.raw)">
            加密
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import clip from '@/utils/clipboard'
import { md5Enc } from '@/api/admin-tool'

export default {
  name: 'Md5Enc',
  components: {},
  data() {
    return {
      md5encModel: {
        str: '',
        md5_16: '',
        md5_32: ''
      },
      md5encRules: {
        str: [{ required: true, message: '请输入字符串', trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    handleCopy(text, event) {
      clip(text, event)
    },
    md5encSubmit() {
      this.$refs['md5encRef'].validate(valid => {
        if (valid) {
          const md5enc = {
            str: this.md5encModel.str
          }
          md5Enc(md5enc).then(res => {
            this.md5encModel.md5_16 = res.data.md5_16
            this.md5encModel.md5_32 = res.data.md5_32
          })
        }
      })
    }
  }
}
</script>
