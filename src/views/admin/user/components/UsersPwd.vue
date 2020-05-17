<template>
  <el-card class="box-card">
    <el-form
      ref="formRef"
      :rules="formRules"
      :model="formData"
      label-position="right"
      label-width="120px"
      style="width: 60%; margin-left:50px;"
    >
      <el-form-item label="原密码" prop="password">
        <el-input
          v-model="formData.password"
          type="password"
          autocomplete="off"
          clearable
          show-password
          placeholder="请输入原密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="passwords">
        <el-input
          v-model="formData.passwords"
          type="password"
          autocomplete="off"
          clearable
          show-password
          placeholder="请输入新密码"
        />
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
      formData: {
        admin_user_id: getAdminUserId(),
        password: '',
        passwords: ''
      },
      formRules: {
        password: [{ required: true, message: '必填', trigger: 'blur' }],
        passwords: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    message(msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    },
    formReset() {
      this.$refs['formRef'].resetFields()
    },
    formSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          usersPwd(this.formData).then(res => {
            this.message(res.msg)
            this.formReset()
          })
        }
      })
    }
  }
}
</script>
