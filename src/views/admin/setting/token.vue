<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
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
                <el-button :loading="tokenRefLoad" @click="tokenRefresh()">刷新</el-button>
                <el-button :loading="tokenSubLoad" type="primary" @click="tokenSubmit()">提交</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { settingToken } from '@/api/admin'

export default {
  name: 'SettingToken',
  components: {},
  data() {
    return {
      tokenRefLoad: false,
      tokenSubLoad: false,
      tokenModel: {
        iss: 'yylAdmin',
        exp: 1
      },
      tokenRules: {
        iss: [
          {
            required: true,
            message: '请输入签发者',
            trigger: 'blur'
          }
        ],
        exp: [
          {
            required: true,
            message: '请输入有效时间',
            trigger: 'blur'
          }
        ]
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
      this.tokenRefLoad = true
      settingToken()
        .then(res => {
          this.tokenModel = res.data
          this.tokenRefLoad = false
          this.$message({ message: res.msg, type: 'success' })
        })
        .catch(() => {
          this.tokenRefLoad = false
        })
    },
    // 提交
    tokenSubmit() {
      this.$refs['tokenRef'].validate(valid => {
        if (valid) {
          this.tokenSubLoad = true
          settingToken(this.tokenModel)
            .then(res => {
              this.tokenSubLoad = false
              this.$message({ message: res.msg, type: 'success' })
            })
            .catch(() => {
              this.tokenSubLoad = false
            })
        }
      })
    }
  }
}
</script>
