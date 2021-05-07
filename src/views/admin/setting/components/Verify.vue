<template>
  <el-card class="box-card">
    <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
      <el-form-item label="验证码开关" prop="verify_switch">
        <el-switch v-model="model.verify_switch" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { verifyInfo, verifyEdit } from '@/api/admin-setting'

export default {
  name: 'Verify',
  components: {},
  data() {
    return {
      loading: false,
      model: {
        verify_switch: 0
      },
      rules: {}
    }
  },
  created() {
    this.info()
  },
  methods: {
    // 信息
    info() {
      verifyInfo().then(res => {
        this.model = res.data
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          verifyEdit(this.model).then(res => {
            this.info()
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.info()
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
