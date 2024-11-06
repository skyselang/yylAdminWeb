<template>
  <el-row>
    <el-col :span="16">
      <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
        <el-form-item label="收件人" prop="email_recipient">
          <el-col :span="8">
            <el-input v-model="model.email_recipient" type="text" clearable />
          </el-col>
          <el-col :span="16"> 邮箱地址 </el-col>
        </el-form-item>
        <el-form-item label="主题" prop="email_theme">
          <el-col :span="8">
            <el-input v-model="model.email_theme" type="text" clearable />
          </el-col>
          <el-col :span="16"> 邮件主题 </el-col>
        </el-form-item>
        <el-form-item label="内容" prop="email_content">
          <el-col :span="8">
            <el-input v-model="model.email_content" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" />
          </el-col>
          <el-col :span="16"> 邮件内容 </el-col>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" @click="reset()">重置</el-button>
          <el-button :loading="loading" type="primary" @click="submit()">发送</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import defaultSettings from '@/settings'
import { emailTest } from '@/api/setting/setting'

export default {
  name: 'SettingEmailTest',
  data() {
    return {
      name: '邮件测试',
      loading: false,
      model: {
        email_recipient: '',
        email_theme: '',
        email_content: ''
      },
      rules: {
        email_recipient: [{ required: true, message: '请输入收件人', trigger: 'blur' }],
        email_theme: [{ required: true, message: '请输入主题', trigger: 'blur' }],
        email_content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.default('get')
  },
  methods: {
    // 默认
    default(type = 'get') {
      const storePrefix = defaultSettings.storePrefix
      if (type == 'set') {
        localStorage.setItem(storePrefix + 'email_recipient', this.model.email_recipient)
        localStorage.setItem(storePrefix + 'email_theme', this.model.email_theme)
        localStorage.setItem(storePrefix + 'email_content', this.model.email_content)
      } else {
        this.model.email_recipient = localStorage.getItem(storePrefix + 'email_recipient')
        this.model.email_theme = localStorage.getItem(storePrefix + 'email_theme')
        this.model.email_content = localStorage.getItem(storePrefix + 'email_content')
        if (!this.model.email_theme) {
          this.model.email_theme = '测试邮件'
        }
        if (!this.model.email_content) {
          this.model.email_content = '这是一封测试邮件，收到此邮件说明邮件设置和发送正常。'
        }
      }
    },
    // 重置
    reset() {
      this.loading = true
      this.model.email_recipient = ''
      this.model.email_theme = ''
      this.model.email_content = ''
      this.loading = false
    },
    // 发送
    submit() {
      this.$refs['ref'].validate((valid) => {
        this.default('set')
        if (valid) {
          this.loading = true
          emailTest(this.model)
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
