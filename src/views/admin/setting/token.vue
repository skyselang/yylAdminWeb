<template>
  <div class="app-container">
    <el-card v-loading="tokenLoad" class="box-card">
      <el-form ref="tokenRef" :rules="tokenRules" :model="tokenModel" label-width="120px">
        <el-row>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Token签发者" prop="iss">
              <el-input v-model="tokenModel.iss" type="text" />
            </el-form-item>
            <el-form-item label="Token有效时间" prop="exp">
              <el-input v-model="tokenModel.exp" type="number">
                <template slot="append">小时</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="tokenRefresh()">刷新</el-button>
              <el-button type="primary" @click="tokenSubmit()">提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { settingToken } from '@/api/admin'

export default {
  name: 'SettingToken',
  components: {},
  data() {
    return {
      tokenLoad: false,
      tokenModel: {
        iss: 'yylAdmin',
        exp: 1
      },
      tokenRules: {
        iss: [{ required: true, message: '请输入签发者', trigger: 'blur' }],
        exp: [{ required: true, message: '请输入有效时间', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.tokenGet()
  },
  methods: {
    // 获取
    tokenGet() {
      settingToken().then(res => {
        this.tokenModel = res.data
      })
    },
    // 刷新
    tokenRefresh() {
      this.tokenLoad = true
      settingToken().then(res => {
        this.tokenModel = res.data
        this.tokenLoad = false
        this.$message({ message: res.msg, type: 'success' })
      }).catch(() => {
        this.tokenLoad = false
      })
    },
    // 提交
    tokenSubmit() {
      this.$refs['tokenRef'].validate(valid => {
        if (valid) {
          this.tokenLoad = true
          settingToken(this.tokenModel).then(res => {
            this.tokenLoad = false
            this.$message({ message: res.msg, type: 'success' })
          }).catch(() => {
            this.tokenLoad = false
          })
        }
      })
    }
  }
}
</script>
