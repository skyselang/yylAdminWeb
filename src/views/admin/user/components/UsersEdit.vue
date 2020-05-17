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
      <el-form-item label="账号" prop="username">
        <el-input
          v-model="formData.username"
          placeholder="请输入账号"
          clearable
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="formData.nickname"
          placeholder="请输入昵称"
          clearable
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="formReset">重置</el-button>
        <el-button type="primary" @click="formSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import store from '@/store'
import { usersInfo, usersEdit } from '@/api/admin'
import { getAdminUserId } from '@/utils/auth'
export default {
  name: 'UsersEdit',
  components: {},
  data() {
    return {
      formData: {
        admin_user_id: getAdminUserId(),
        username: '',
        nickname: '',
        email: ''
      },
      formRules: {
        username: [{ required: true, message: '必填', trigger: 'blur' }],
        nickname: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.usersInfo()
  },
  methods: {
    message(msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    },
    usersInfo() {
      usersInfo({ admin_user_id: this.formData.admin_user_id }).then(res => {
        this.formData = res.data
      })
    },
    formReset() {
      this.$refs['formRef'].resetFields()
      this.usersInfo()
    },
    formSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          usersEdit(this.formData).then(res => {
            this.message(res.msg)
            this.formReset()
            store.commit('user/SET_NICKNAME', res.data.nickname)
            store.commit('user/SET_USERNAME', res.data.username)
          })
        }
      })
    }
  }
}
</script>
