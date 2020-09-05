<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24" :md="12">
          <el-form ref="usersRef" :rules="usersRules" :model="usersModel" label-width="100px">
            <el-form-item label="原密码" prop="password">
              <el-input v-model="usersModel.password" type="password" autocomplete="off" placeholder="请输入原密码" clearable show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="passwords">
              <el-input v-model="usersModel.passwords" type="password" autocomplete="off" placeholder="请输入新密码" clearable show-password />
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
import { usersPwd } from '@/api/admin'
import { getAdminUserId } from '@/utils/auth'

export default {
  name: 'Pwd',
  components: {},
  data() {
    return {
      usersModel: {
        admin_user_id: getAdminUserId(),
        password: '',
        passwords: ''
      },
      usersRules: {
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
    usersReset() {
      this.$refs['usersRef'].resetFields()
    },
    usersSubmit() {
      this.$refs['usersRef'].validate(valid => {
        if (valid) {
          usersPwd(this.usersModel).then(res => {
            this.$message({ message: res.msg, type: 'success' })
            this.usersReset()
          })
        }
      })
    }
  }
}
</script>
