<template>
  <el-scrollbar :height="height">
    <el-row>
      <el-col :md="24" :lg="16" :xl="14">
        <el-form ref="ref" :rules="rules" :model="model" label-width="120px">
          <el-form-item :label="$t('旧密码')" prop="password_old">
            <el-input
              v-model="model.password_old"
              type="password"
              :placeholder="$t('请输入旧密码')"
              clearable
              show-password
            />
          </el-form-item>
          <el-form-item :label="$t('新密码')" prop="password_new">
            <el-input
              v-model="model.password_new"
              type="password"
              :placeholder="$t('请输入新密码')"
              clearable
              show-password
            />
          </el-form-item>
          <el-form-item :label="$t('确认新密码')" prop="password_confirm">
            <el-input
              v-model="model.password_confirm"
              type="password"
              :placeholder="$t('请再次输入新密码')"
              clearable
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" @click="reset">{{ $t('重置') }}</el-button>
            <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script>
import { screenHeight } from '@/utils/index'
import { pwdApi } from '@/api/system/user-center'

export default {
  data() {
    return {
      name: '修改密码',
      height: 680,
      loading: false,
      model: {
        password_old: '',
        password_new: '',
        password_confirm: ''
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(210)
    const validatePasswordConfirm = (rule, value, callback) => {
      if (value !== this.model.password_new) {
        callback(new Error(this.$t('两次输入的新密码不一致')))
      } else {
        callback()
      }
    }
    this.rules = {
      password_old: [{ required: true, message: this.$t('请输入旧密码'), trigger: 'blur' }],
      password_new: [{ required: true, message: this.$t('请输入新密码'), trigger: 'blur' }],
      password_confirm: [
        { required: true, message: this.$t('请再次输入新密码'), trigger: 'blur' },
        { validator: validatePasswordConfirm, trigger: 'blur' }
      ]
    }
  },
  methods: {
    // 重置
    reset() {
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
        this.$refs['ref'].clearValidate()
      }
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (!valid) {
          ElMessage.error(this.$t('请完善必填项'))
        } else {
          this.loading = true
          pwdApi(this.model)
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
