<template>
  <div class="app-container">
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12">
          <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
            <el-form-item label="Token签发者" prop="iss">
              <el-input v-model="model.iss" type="text" />
            </el-form-item>
            <el-form-item label="Token有效时间" prop="exp">
              <el-input v-model="model.exp" type="number">
                <template slot="append">小时</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="refresh()">刷新</el-button>
              <el-button type="primary" @click="submit()">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { info, token } from '@/api/admin-setting'

export default {
  name: 'SettingToken',
  components: {},
  data() {
    return {
      loading: false,
      model: {
        iss: 'yylAdmin',
        exp: 12
      },
      rules: {
        iss: [{ required: true, message: '请输入签发者', trigger: 'blur' }],
        exp: [{ required: true, message: '请输入有效时间', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.info()
  },
  methods: {
    // 信息
    info() {
      info().then(res => {
        this.model = res.data.token
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          token(this.model).then(res => {
            this.info()
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      info().then(res => {
        this.model = res.data.token
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
