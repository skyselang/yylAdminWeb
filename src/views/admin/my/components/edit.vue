<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24" :md="12">
          <el-form ref="userRef" :rules="userRules" :model="userModel" label-width="100px">
            <el-form-item label="账号" prop="username">
              <el-input v-model="userModel.username" placeholder="请输入账号" clearable />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="userModel.nickname" placeholder="请输入昵称" clearable />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userModel.email" placeholder="请输入邮箱" clearable />
            </el-form-item>
            <el-form-item>
              <el-button @click="userReset">刷新</el-button>
              <el-button type="primary" @click="userSubmit">提交</el-button>
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
      loading: false,
      userModel: {
        admin_user_id: getAdminUserId(),
        username: '',
        nickname: '',
        email: ''
      },
      userRules: {
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
      myEdit({
        admin_user_id: this.userModel.admin_user_id
      }).then(res => {
        this.$refs['userRef'].resetFields()
        this.userModel = res.data
      })
    },
    userReset() {
      this.loading = true
      this.myEdit()
      this.loading = false
    },
    userSubmit() {
      this.$refs['userRef'].validate(valid => {
        if (valid) {
          this.loading = true
          myEdit(this.userModel, 'post').then(res => {
            this.userReset()
            store.commit('user/SET_NICKNAME', res.data.nickname)
            store.commit('user/SET_USERNAME', res.data.username)
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
