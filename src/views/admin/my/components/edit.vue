<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24" :md="12">
          <el-form ref="usersRef" :rules="usersRules" :model="usersModel" label-width="100px">
            <el-form-item label="账号" prop="username">
              <el-input v-model="usersModel.username" placeholder="请输入账号" clearable />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="usersModel.nickname" placeholder="请输入昵称" clearable />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="usersModel.email" placeholder="请输入邮箱" clearable />
            </el-form-item>
            <el-form-item>
              <el-button @click="usersReset">刷新</el-button>
              <el-button type="primary" @click="usersSubmit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import store from '@/store'
import { myEdit } from '@/api/admin'
import { getAdminUserId } from '@/utils/auth'

export default {
  name: 'MyEdit',
  components: {},
  data() {
    return {
      usersModel: {
        admin_user_id: getAdminUserId(),
        username: '',
        nickname: '',
        email: ''
      },
      usersRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.myEdit()
  },
  methods: {
    myEdit() {
      myEdit({ admin_user_id: this.usersModel.admin_user_id })
        .then(res => {
          this.usersModel = res.data
        })
    },
    usersReset() {
      this.$refs['usersRef'].resetFields()
      this.myEdit()
    },
    usersSubmit() {
      this.$refs['usersRef'].validate(valid => {
        if (valid) {
          myEdit(this.usersModel, 'post').then(res => {
            this.$message({ message: res.msg, type: 'success' })
            this.usersReset()
            store.commit('user/SET_NICKNAME', res.data.nickname)
            store.commit('user/SET_USERNAME', res.data.username)
          })
        }
      })
    }
  }
}
</script>
