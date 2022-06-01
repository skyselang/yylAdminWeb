<template>
  <el-card class="box-card">
    <el-row class="dialog-body" :style="{height:height+'px'}">
      <el-col :xs="24" :sm="22" :md="20" :lg="16" :xl="12">
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item label="Token密钥" prop="token_key">
            <el-input v-model="model.token_key" type="password" clearable show-password>
              <template slot="append">修改后会员登录状态失效，需重新登录。</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Token有效时间" prop="token_exp">
            <el-input v-model="model.token_exp" type="number">
              <template slot="append">小时，登录后超过此时间，需重新登录。</template>
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
import screenHeight from '@/utils/screen-height'
import { tokenInfo, tokenEdit } from '@/api/setting/setting'

export default {
  name: 'SettingSettingToken',
  components: {},
  data() {
    return {
      name: 'Token设置',
      height: 680,
      loading: false,
      model: {
        token_key: '',
        token_exp: 720
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(210)
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
      tokenInfo().then((res) => {
        this.model = res.data
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          tokenEdit(this.model).then(res => {
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
