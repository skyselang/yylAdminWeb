<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('注册')" prop="is_register">
            <ElSwitchOnoff v-model="model.is_register" />
            <el-text size="default">{{ $t('关闭后，不能使用账号密码注册') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('注册验证码')" prop="is_captcha_register">
            <ElSwitchOnoff v-model="model.is_captcha_register" />
            <el-text size="default">{{ $t('开启后，会员账号密码注册需要输入验证码') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('登录')" prop="is_login">
            <ElSwitchOnoff v-model="model.is_login" />
            <el-text size="default">{{ $t('关闭后，不能使用账号密码登录') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('登录验证码')" prop="is_captcha_login">
            <ElSwitchOnoff v-model="model.is_captcha_login" />
            <el-text size="default">{{ $t('开启后，会员账号密码登录需要输入验证码') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('手机验证码注册')" prop="is_phone_register">
            <ElSwitchOnoff v-model="model.is_phone_register" />
            <el-text size="default">{{ $t('关闭后，不能使用手机+验证码注册') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('手机验证码登录')" prop="is_phone_login">
            <ElSwitchOnoff v-model="model.is_phone_login" />
            <el-text size="default">{{ $t('关闭后，不能使用手机+验证码登录') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('邮箱验证码注册')" prop="is_email_register">
            <ElSwitchOnoff v-model="model.is_email_register" />
            <el-text size="default">{{ $t('关闭后，不能使用邮箱+验证码注册') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('邮箱验证码登录')" prop="is_email_login">
            <ElSwitchOnoff v-model="model.is_email_login" />
            <el-text size="default">{{ $t('关闭后，不能使用邮箱+验证码登录') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('注册后自动登录')" prop="is_auto_login">
            <ElSwitchOnoff v-model="model.is_auto_login" />
            <el-text size="default">{{ $t('开启后，注册成功会直接返回token') }}</el-text>
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
import { screenHeight } from '@/utils/index'
import { logregInfoApi as infoApi, logregEditApi as editApi } from '@/api/member/setting'

export default {
  data() {
    return {
      name: '登录注册设置',
      height: 750,
      loading: false,
      model: {
        is_register: 1,
        is_captcha_register: 0,
        is_login: 1,
        is_captcha_login: 0,
        is_phone_register: 1,
        is_phone_login: 1,
        is_email_register: 1,
        is_email_login: 1
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(270)
    this.info()
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
    }
  }
}
</script>
