<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <input name="username" hidden autocomplete="off" />
          <el-form-item :label="$t('Token密钥')" prop="token_key">
            <el-col :span="12">
              <el-input v-model="model.token_key" clearable type="password" show-password autocomplete="new-password">
                <template #append>
                  <el-text size="default" :title="$t('重新生成')" class="cursor-pointer" @click="tokenKey">
                    {{ $t('生成') }}
                  </el-text>
                </template>
              </el-input>
            </el-col>
            <el-col :span="24">
              <el-text size="default">{{ $t('修改后会员登录状态失效，需重新登录') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('Token有效时间')" prop="token_exp">
            <el-col :span="12">
              <el-input v-model="model.token_exp" type="number">
                <template #append>
                  <el-text size="default">{{ $t('小时') }}</el-text>
                </template>
              </el-input>
            </el-col>
            <el-col :span="24">
              <el-text size="default">{{ $t('会员登录后超过有效时间，需重新登录') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('多端登录')" prop="is_multi_login">
            <ElSwitchOnoff v-model="model.is_multi_login" />
            <el-text size="default">{{ $t('开启后，可以在多个设备同时登录') }}</el-text>
          </el-form-item>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-form-item>
      <el-button :loading="loading" @click="refresh">{{ $t('刷新') }}</el-button>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { screenHeight, randomBytes } from '@/utils/index'
import { tokenInfoApi as infoApi, tokenEditApi as editApi } from '@/api/member/setting'

export default {
  data() {
    return {
      name: 'Token设置',
      height: 750,
      loading: false,
      model: {
        token_key: '',
        token_exp: 720,
        is_multi_login: 0
      },
      rules: {}
    }
  },
  created() {
    this.info()
    this.height = screenHeight(270)
    this.rules = { token_key: [{ required: true, message: this.$t('请输入Token密钥'), trigger: 'blur' }] }
  },
  methods: {
    // 信息
    info(ismsg = false) {
      if (ismsg) {
        this.loading = true
      }
      infoApi()
        .then((res) => {
          this.model = res.data
          this.loading = false
          if (ismsg) {
            ElMessage.success(res.msg)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 刷新
    refresh() {
      this.info(true)
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (!valid) {
          ElMessage.error(this.$t('请完善必填项'))
        } else {
          this.loading = true
          editApi(this.model)
            .then((res) => {
              this.loading = false
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 生成 token key
    tokenKey() {
      this.model.token_key = randomBytes(23)
    }
  }
}
</script>
