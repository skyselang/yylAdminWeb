<template>
  <el-card class="box-card">
    <el-form ref="formRef" :rules="formRules" :model="formModel" label-width="80px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="formModel.username" placeholder="请输入账号" clearable />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formModel.nickname" placeholder="请输入昵称" clearable />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formModel.email" placeholder="" clearable />
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
      formModel: {
        admin_user_id: getAdminUserId(),
        username: '',
        nickname: '',
        email: ''
      },
      formRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.usersInfo()
  },
  methods: {
    usersInfo() {
      usersInfo({ admin_user_id: this.formModel.admin_user_id }).then(res => {
        this.formModel = res.data
      })
    },
    formReset() {
      this.$refs['formRef'].resetFields()
      this.usersInfo()
    },
    formSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          usersEdit(this.formModel).then(res => {
            this.$message({ message: res.msg, type: 'success' })
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
