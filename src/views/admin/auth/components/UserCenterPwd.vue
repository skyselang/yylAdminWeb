<template>
  <div>
    <el-card v-loading="loading" class="box-card dialog-body" :style="{height:height+'px'}">
      <el-row>
        <el-col :xs="24" :sm="18" :md="12">
          <el-form ref="ref" :rules="rules" :model="model" label-width="120px">
            <el-form-item label="旧密码" prop="password_old">
              <el-input v-model="model.password_old" type="password" placeholder="请输入旧密码" autocomplete="off" clearable show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="password_new">
              <el-input v-model="model.password_new" type="password" placeholder="请输入新密码" autocomplete="off" clearable show-password />
            </el-form-item>
            <el-form-item label="确认新密码" prop="password_confirm">
              <el-input v-model="model.password_confirm" type="password" placeholder="请再次输入新密码" autocomplete="off" clearable show-password />
            </el-form-item>
            <el-form-item>
              <el-button @click="reset">重置</el-button>
              <el-button type="primary" @click="submit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { pwd } from '@/api/admin/user-center'

export default {
  name: 'UserCenterPwd',
  components: {},
  data() {
    var validatePasswordConfirm = (rule, value, callback) => {
      if (value !== this.model.password_new) {
        callback(new Error('两次输入的新密码不一致'))
      } else {
        callback()
      }
    }
    return {
      name: '修改密码',
      height: 680,
      loading: false,
      model: {
        password_old: '',
        password_new: '',
        password_confirm: ''
      },
      rules: {
        password_old: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        password_new: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        password_confirm: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }, { validator: validatePasswordConfirm, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight(180)
  },
  methods: {
    // 重置
    reset() {
      this.$refs['ref'].resetFields()
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          pwd(this.model).then(res => {
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
