<template>
  <el-card class="dialog-body" :style="{height:height+'px'}">
    <el-row>
      <el-col :span="12">
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item label="注册" prop="is_register">
            <el-col :span="8">
              <el-switch v-model="model.is_register" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能再注册（用户名、手机、邮箱）
            </el-col>
          </el-form-item>
          <el-form-item label="登录" prop="is_login">
            <el-col :span="8">
              <el-switch v-model="model.is_login" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能再登录（用户名、手机、邮箱）
            </el-col>
          </el-form-item>
          <el-form-item label="公众号注册" prop="is_offi_register">
            <el-col :span="8">
              <el-switch v-model="model.is_offi_register" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能再注册（公众号）
            </el-col>
          </el-form-item>
          <el-form-item label="公众号登录" prop="is_offi_login">
            <el-col :span="8">
              <el-switch v-model="model.is_offi_login" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能再登录（公众号）
            </el-col>
          </el-form-item>
          <el-form-item label="小程序注册" prop="is_mini_register">
            <el-col :span="8">
              <el-switch v-model="model.is_mini_register" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能再注册（小程序）
            </el-col>
          </el-form-item>
          <el-form-item label="小程序登录" prop="is_mini_login">
            <el-col :span="8">
              <el-switch v-model="model.is_mini_login" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              关闭后，不能再登录（小程序）
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
        is_login: 1,
        is_offi_register: 1,
        is_offi_login: 1,
        is_mini_register: 1,
        is_mini_login: 1
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
