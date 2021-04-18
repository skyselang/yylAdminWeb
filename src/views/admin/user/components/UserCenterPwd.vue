<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12">
          <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
            <el-form-item label="旧密码" prop="password_old">
              <el-input v-model="model.password_old" type="password" placeholder="请输入旧密码" autocomplete="off" clearable show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="password_new">
              <el-input v-model="model.password_new" type="password" placeholder="请输入新密码" autocomplete="off" clearable show-password />
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
import { getAdminUserId } from '@/utils/auth'
import { pwd } from '@/api/admin-user-center'

export default {
  name: 'UserCenterPwd',
  components: {},
  data() {
    return {
      loading: false,
      model: {
        admin_user_id: getAdminUserId(),
        password_old: '',
        password_new: ''
      },
      rules: {
        password_old: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        password_new: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    reset() {
      this.$refs['ref'].resetFields()
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          pwd(this.model).then(res => {
            this.reset()
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
