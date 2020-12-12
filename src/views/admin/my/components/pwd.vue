<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24" :md="12">
          <el-form ref="userRef" :rules="userRules" :model="userModel" label-width="100px">
            <el-form-item label="旧密码" prop="password_old">
              <el-input v-model="userModel.password_old" type="password_old" autocomplete="off" placeholder="请输入旧密码" clearable show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="password_new">
              <el-input v-model="userModel.password_new" type="password" autocomplete="off" placeholder="请输入新密码" clearable show-password />
            </el-form-item>
            <el-form-item>
              <el-button @click="userReset">重置</el-button>
              <el-button type="primary" @click="userSubmit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getAdminUserId } from '@/utils/auth'
import { myPwd } from '@/api/admin'

export default {
  name: 'MyPwd',
  components: {},
  data() {
    return {
      loading: false,
      userModel: {
        admin_user_id: getAdminUserId(),
        password_old: '',
        password_new: ''
      },
      userRules: {
        password_old: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        password_new: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    userReset() {
      this.$refs['userRef'].resetFields()
    },
    userSubmit() {
      this.$refs['userRef'].validate(valid => {
        if (valid) {
          this.loading = true
          myPwd(this.userModel).then(res => {
            this.userReset()
            this.loading = false
            this.$message({ message: res.msg, type: 'success' })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
