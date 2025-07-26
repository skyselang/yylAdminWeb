<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('SMTP服务器')" prop="email_host">
            <el-col :span="10">
              <el-input v-model="model.email_host" clearable />
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('发送邮件服务器，如：smtp.qq.com') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('SMTP协议')" prop="email_secure">
            <el-col :span="10">
              <el-select v-model="model.email_secure">
                <el-option v-for="item in secure" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('发送邮件服务器加密方式，如：SSL') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('SMTP端口')" prop="email_port">
            <el-col :span="10">
              <el-input v-model="model.email_port" type="number" clearable />
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('发送邮件服务器端口号，如：465') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('SMTP账号')" prop="email_username">
            <el-col :span="10">
              <el-input v-model="model.email_username" clearable />
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('发件邮箱账号') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('SMTP密码')" prop="email_password">
            <el-col :span="10">
              <el-input v-model="model.email_password" type="password" clearable show-password />
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('发件邮箱密码或授权码') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('SMTP名称')" prop="email_setfrom">
            <el-col :span="10">
              <el-input v-model="model.email_setfrom" clearable />
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('发件邮箱名称即发件人名称') }}</el-text>
            </el-col>
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
import { emailInfoApi as infoApi, emailEditApi as editApi } from '@/api/system/setting'

export default {
  data() {
    return {
      name: '邮件设置',
      height: 750,
      loading: false,
      model: {
        email_host: '',
        email_port: '',
        email_secure: '',
        email_username: '',
        email_password: '',
        email_setfrom: ''
      },
      rules: {},
      secure: [
        { value: 'ssl', label: 'SSL' },
        { value: 'tls', label: 'TLS' }
      ]
    }
  },
  created() {
    this.height = screenHeight(270)
    this.info()
    this.rules = {
      email_host: [{ required: true, message: this.$t('请输入SMTP服务器'), trigger: 'blur' }],
      email_secure: [{ required: true, message: this.$t('请选择SMTP协议'), trigger: 'blur' }],
      email_port: [{ required: true, message: this.$t('请输入SMTP端口'), trigger: 'blur' }],
      email_username: [{ required: true, message: this.$t('请输入SMTP账号'), trigger: 'blur' }],
      email_password: [{ required: true, message: this.$t('请输入SMTP密码'), trigger: 'blur' }]
    }
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
