<template>
  <el-card class="dialog-body" :style="{height:height+'px'}">
    <el-row>
      <el-col :span="14">
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item label="Token密钥" prop="token_key">
            <el-col :span="8">
              <el-input v-model="model.token_key" type="text" clearable />
            </el-col>
            <el-col :span="16">
              修改后会员登录状态失效，需重新登录
            </el-col>
          </el-form-item>
          <el-form-item label="Token有效时间" prop="token_exp">
            <el-col :span="8">
              <el-input v-model="model.token_exp" type="number" />
            </el-col>
            <el-col :span="16">
              小时，登录后超过此时间，需重新登录
            </el-col>
          </el-form-item>
          <el-form-item label="多端登录" prop="is_multi_login">
            <el-col :span="8">
              <el-switch v-model="model.is_multi_login" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              开启后可以在多个设备同时登录
            </el-col>
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
import { tokenInfo, tokenEdit } from '@/api/member/setting'

export default {
  name: 'MemberSettingToken',
  components: {},
  data() {
    return {
      name: 'Token设置',
      height: 680,
      loading: false,
      model: {
        token_key: '',
        token_exp: 720,
        is_multi_login: 0
      },
      rules: {
        token_key: [{ required: true, message: '请输入Token密钥', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight(170)
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
