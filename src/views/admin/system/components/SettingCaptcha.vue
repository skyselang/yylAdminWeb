<template>
  <el-card class="box-card dialog-body" :style="{height:height+'px'}">
    <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
      <el-form-item label="验证码开关" prop="captcha_switch">
        <el-switch v-model="model.captcha_switch" :active-value="1" :inactive-value="0" />
        <span style="margin-left:180px">开启后，后台登录需要输入验证码。</span>
      </el-form-item>
      <el-form-item label="验证码类型" prop="captcha_type">
        <el-select v-model="model.captcha_type" placeholder="">
          <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
import { captchaInfo, captchaEdit } from '@/api/admin/setting'

export default {
  name: 'SystemSettingCaptcha',
  components: {},
  data() {
    return {
      name: '验证码设置',
      height: 680,
      loading: false,
      model: {
        captcha_switch: 0,
        captcha_type: 1
      },
      rules: {},
      type: [
        { value: 1, label: '数字' },
        { value: 2, label: '字母' },
        { value: 3, label: '数字字母' },
        { value: 4, label: '算术' },
        { value: 5, label: '中文' }
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
      captchaInfo().then(res => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      captchaInfo().then((res) => {
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
          captchaEdit(this.model).then(res => {
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
