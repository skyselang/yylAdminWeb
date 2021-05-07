<template>
  <el-card class="box-card">
    <el-row :gutter="0">
      <el-col :xs="24" :sm="12">
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item label="Token有效时间" prop="token_exp">
            <el-input v-model="model.token_exp" type="number">
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { tokenInfo, tokenEdit } from '@/api/setting'

export default {
  name: 'Token',
  components: {},
  data() {
    return {
      loading: false,
      model: {
        token_exp: 720
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
      tokenInfo().then(res => {
        this.model = res.data
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          tokenEdit(this.model).then(res => {
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
