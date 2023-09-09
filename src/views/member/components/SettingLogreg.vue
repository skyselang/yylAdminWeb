<template>
  <el-card class="dialog-body" :style="{height:height+'px'}">
    <el-row>
      <el-col :span="14">
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item label="注册验证码" prop="is_captcha_register">
            <el-col :span="8">
              <el-switch v-model="model.is_captcha_register" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              开启后，会员账号密码注册需要输入验证码
            </el-col>
          </el-form-item>
          <el-form-item label="注册" prop="is_register">
            <el-col :span="8">
              <el-switch v-model="model.is_register" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能使用账号密码注册
            </el-col>
          </el-form-item>
          <el-form-item label="登录验证码" prop="is_captcha_login">
            <el-col :span="8">
              <el-switch v-model="model.is_captcha_login" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              开启后，会员账号密码登录需要输入验证码
            </el-col>
          </el-form-item>
          <el-form-item label="登录" prop="is_login">
            <el-col :span="8">
              <el-switch v-model="model.is_login" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能使用账号密码登录
            </el-col>
          </el-form-item>
          <el-form-item label="手机验证码注册" prop="is_phone_register">
            <el-col :span="8">
              <el-switch v-model="model.is_phone_register" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能使用手机+验证码注册
            </el-col>
          </el-form-item>
          <el-form-item label="手机验证码登录" prop="is_phone_login">
            <el-col :span="8">
              <el-switch v-model="model.is_phone_login" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能使用手机+验证码登录
            </el-col>
          </el-form-item>
          <el-form-item label="邮箱验证码注册" prop="is_email_register">
            <el-col :span="8">
              <el-switch v-model="model.is_email_register" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能使用邮箱+验证码注册
            </el-col>
          </el-form-item>
          <el-form-item label="邮箱验证码登录" prop="is_email_login">
            <el-col :span="8">
              <el-switch v-model="model.is_email_login" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能使用邮箱+验证码登录
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
import { logregInfo, logregEdit } from '@/api/member/setting'

export default {
  name: 'MemberSettingLogreg',
  components: {},
  data() {
    return {
      name: '登录注册设置',
      height: 680,
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
    this.height = screenHeight(170)
    this.info()
  },
  methods: {
    // 信息
    info() {
      logregInfo().then(res => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      logregInfo().then((res) => {
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
          logregEdit(this.model).then(res => {
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
