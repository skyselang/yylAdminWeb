<template>
  <el-card class="box-card">
    <el-form ref="formRef" :rules="formRules" :model="formModel" label-width="100px">
      <el-form-item label="原密码" prop="password">
        <el-input v-model="formModel.password" type="password" autocomplete="off" placeholder="请输入原密码" clearable show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="passwords">
        <el-input v-model="formModel.passwords" type="password" autocomplete="off" placeholder="请输入新密码" clearable show-password />
      </el-form-item>
      <el-form-item>
        <el-button @click="formReset">重置</el-button>
        <el-button type="primary" @click="formSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { usersPwd } from '@/api/admin'
import { getAdminUserId } from '@/utils/auth'

export default {
  name: 'UsersPwd',
  components: {},
  data() {
    return {
      formModel: {
        admin_user_id: getAdminUserId(),
        password: '',
        passwords: ''
      },
      formRules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        passwords: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
  methods: {
    formReset() {
      this.$refs['formRef'].resetFields()
    },
    formSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          usersPwd(this.formModel).then(res => {
            this.$message({ message: res.msg, type: 'success' })
            this.formReset()
          })
        }
      })
    }
  }
}
</script>
