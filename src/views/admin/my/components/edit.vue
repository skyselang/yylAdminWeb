<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12">
          <el-form ref="adminRef" :rules="adminRules" :model="adminModel" label-width="100px">
            <el-form-item label="账号" prop="username">
              <el-input v-model="adminModel.username" placeholder="请输入账号" clearable />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="adminModel.nickname" placeholder="请输入昵称" clearable />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="adminModel.email" placeholder="请输入邮箱" clearable />
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="adminModel.phone" placeholder="请输入手机" clearable />
            </el-form-item>
            <el-form-item>
              <el-button @click="adminRefresh">刷新</el-button>
              <el-button type="primary" @click="adminSubmit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getAdminAdminId } from '@/utils/auth'
import { myEdit } from '@/api/admin'
import store from '@/store'

export default {
  name: 'MyEdit',
  components: {},
  data() {
    return {
      loading: false,
      adminModel: {
        admin_admin_id: getAdminAdminId(),
        username: '',
        nickname: '',
        email: '',
        phone: ''
      },
      adminRules: {
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
        admin_admin_id: this.adminModel.admin_admin_id
      }).then(res => {
        this.$refs['adminRef'].resetFields()
        this.adminModel = res.data
      })
    },
    adminRefresh() {
      this.loading = true
      this.myEdit()
      this.loading = false
    },
    adminSubmit() {
      this.$refs['adminRef'].validate(valid => {
        if (valid) {
          this.loading = true
          myEdit(this.adminModel, 'post').then(res => {
            this.adminRefresh()
            store.commit('user/SET_NICKNAME', res.data.nickname)
            store.commit('user/SET_USERNAME', res.data.username)
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
