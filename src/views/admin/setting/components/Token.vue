<template>
  <el-card class="box-card">
    <el-row :gutter="0">
      <el-col :xs="24" :sm="12">
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item label="Token名称" prop="token_name">
            <el-input v-model="model.token_name" type="text" style="width:90%" />
            <i class="el-icon-warning-outline" title="必须与前端设置一致，否则Token验证失败。" />
          </el-form-item>
          <el-form-item label="Token密钥" prop="token_key">
            <el-input v-model="model.token_key" type="text" style="width:90%" />
            <i class="el-icon-warning-outline" title="修改后所有用户登录状态失效，需重新登录。" />
          </el-form-item>
          <el-form-item label="Token有效时间" prop="token_exp">
            <el-input v-model="model.token_exp" type="number">
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" @click="refresh()">刷新</el-button>
            <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { tokenInfo, tokenEdit } from '@/api/admin-setting'

export default {
  name: 'Token',
  components: {},
  data() {
    return {
      loading: false,
      model: {
        token_name: '',
        token_key: '',
        token_exp: 12
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
    // 刷新
    refresh() {
      this.loading = true
      tokenInfo()
        .then((res) => {
          this.model = res.data
          this.loading = false
          this.$message.success(res.msg)
        })
        .catch(() => {
          this.loading = false
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
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
