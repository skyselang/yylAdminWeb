<template>
  <div class="app-container">
    <div v-loading="loading" class="filter-container">
      <el-card class="box-card">
        <div class="text item">
          <el-form
            ref="formRef"
            :rules="formRules"
            :model="formData"
            label-position="right"
            label-width="120px"
            style="width: 60%; margin-left:50px;"
          >
            <el-form-item label="账号" prop="username">
              <el-input v-model="formData.username" clearable />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="formData.nickname" clearable />
            </el-form-item>
            <el-form-item label="原密码" prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                autocomplete="off"
                clearable
                show-password
              />
            </el-form-item>
            <el-form-item label="新密码" prop="passwords">
              <el-input
                v-model="formData.passwords"
                type="password"
                autocomplete="off"
                clearable
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button @click="formReset">重置</el-button>
              <el-button type="primary" @click="formSubmit">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { userCenterGet, userCenterPost } from '@/api/admin'
import { getAdminUserId } from '@/utils/auth'
export default {
  name: 'UserCenter',
  components: {},
  data() {
    return {
      loading: false,
      loadingTime: 250,
      formData: {
        admin_user_id: getAdminUserId(),
        username: '',
        nickname: '',
        password: '',
        passwords: ''
      },
      formRules: {
        username: [{ required: true, message: '必填', trigger: 'blur' }],
        nickname: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.userCenter()
  },
  methods: {
    loadingOpen() {
      this.loading = true
    },
    loadingClose() {
      const that = this
      setTimeout(function() {
        that.loading = false
      }, that.loadingTime)
    },
    message(msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    },
    userCenter() {
      this.loadingOpen()
      userCenterGet({ admin_user_id: this.formData.admin_user_id })
        .then(res => {
          this.formData = res.data
          this.formData.password = ''
          this.formData.passwords = ''
          this.loadingClose()
        })
        .catch(() => {
          this.loadingClose()
        })
    },
    formReset() {
      this.$refs['formRef'].resetFields()
      this.userCenter()
    },
    formSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.loadingOpen()
          userCenterPost(this.formData)
            .then(res => {
              this.message(res.msg)
              this.formReset()
            })
            .catch(() => {
              this.loadingClose()
            })
        }
      })
    }
  }
}
</script>
