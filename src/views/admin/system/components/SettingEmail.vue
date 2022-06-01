<template>
  <el-card class="box-card dialog-body" :style="{height:height+'px'}">
    <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
      <el-form-item label="SMTP服务器" prop="email_host">
        <el-col :span="8">
          <el-input v-model="model.email_host" type="text" clearable />
        </el-col>
        <el-col :span="16">
          发送邮件服务器，如：smtp.qq.com
        </el-col>
      </el-form-item>
      <el-form-item label="SMTP协议" prop="email_secure">
        <el-col :span="8">
          <el-select v-model="model.email_secure" placeholder="">
            <el-option v-for="item in secure" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="16">
          发送邮件服务器加密方式，如：SSL
        </el-col>
      </el-form-item>
      <el-form-item label="SMTP端口" prop="email_port">
        <el-col :span="8">
          <el-input v-model="model.email_port" type="number" clearable />
        </el-col>
        <el-col :span="16">
          发送邮件服务器端口号，如：465
        </el-col>
      </el-form-item>
      <el-form-item label="邮箱名称" prop="email_setfrom">
        <el-col :span="8">
          <el-input v-model="model.email_setfrom" type="text" clearable />
        </el-col>
        <el-col :span="16">
          发件邮箱名称即发件人，如：yylAdmin
        </el-col>
      </el-form-item>
      <el-form-item label="邮箱账号" prop="email_username">
        <el-col :span="8">
          <el-input v-model="model.email_username" type="text" clearable />
        </el-col>
        <el-col :span="16">
          发件邮箱账号，如：123456789@qq.com
        </el-col>
      </el-form-item>
      <el-form-item label="授权码/密码" prop="email_password">
        <el-col :span="8">
          <el-input v-model="model.email_password" type="password" clearable show-password />
        </el-col>
        <el-col :span="16">
          发件邮箱的授权码或密码，如：y1y2l3a4d5m6i7n
        </el-col>
      </el-form-item>
      <el-form-item label="测试邮箱" prop="email_test">
        <el-col :span="8">
          <el-input v-model="model.email_test" type="text" clearable />
        </el-col>
        <el-col :span="16">
          <el-button :loading="loading" type="primary" title="先提交再发送" @click="test()">发送测试邮件</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" @click="refresh()">刷新</el-button>
        <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { emailInfo, emailEdit, emailTest } from '@/api/admin/setting'

export default {
  name: 'SystemSettingEmail',
  components: {},
  data() {
    return {
      name: '邮件设置',
      height: 680,
      loading: false,
      model: {
        email_host: '',
        email_port: '',
        email_secure: '',
        email_username: '',
        email_password: '',
        email_setfrom: '',
        email_test: ''
      },
      rules: {
        email_host: [{ required: true, message: '请输入SMTP服务器', trigger: 'blur' }],
        email_secure: [{ required: true, message: '请选择SMTP协议', trigger: 'blur' }],
        email_port: [{ required: true, message: '请输入SMTP端口', trigger: 'blur' }],
        email_username: [{ required: true, message: '请输入邮箱账号', trigger: 'blur' }],
        email_password: [{ required: true, message: '请输入授权码/密码', trigger: 'blur' }]
      },
      secure: [
        { value: 'ssl', label: 'SSL' },
        { value: 'tls', label: 'TLS' }
      ]
    }
  },
  created() {
    this.height = screenHeight(180)
    this.info()
  },
  methods: {
    // 信息
    info() {
      emailInfo().then(res => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      emailInfo().then((res) => {
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
          emailEdit(this.model).then(res => {
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 测试
    test() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          if (!this.model.email_test) {
            this.$message.error('请输入测试邮箱')
          } else {
            this.loading = true
            emailTest(this.model).then(res => {
              this.loading = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    }
  }
}
</script>
