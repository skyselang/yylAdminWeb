<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12">
          <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
            <el-form-item label="账号" prop="username">
              <el-input v-model="model.username" placeholder="请输入账号" clearable />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="model.nickname" placeholder="请输入昵称" clearable />
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="model.phone" placeholder="请输入手机" clearable />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="model.email" placeholder="请输入邮箱" clearable />
            </el-form-item>
            <el-form-item>
              <el-button @click="refresh">刷新</el-button>
              <el-button type="primary" @click="submit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getAdminUserId } from '@/utils/auth'
import { info, edit } from '@/api/admin-user-center'
import store from '@/store'

export default {
  name: 'UserCenterEdit',
  components: {},
  data() {
    return {
      loading: false,
      model: {
        admin_user_id: getAdminUserId(),
        username: '',
        nickname: '',
        phone: '',
        email: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.info()
  },
  methods: {
    info() {
      info({
        admin_user_id: this.model.admin_user_id
      }).then(res => {
        this.$refs['ref'].resetFields()
        this.model = res.data
      })
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          edit(this.model).then(res => {
            this.refresh()
            store.commit('user/SET_NICKNAME', res.data.nickname)
            store.commit('user/SET_USERNAME', res.data.username)
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    refresh() {
      this.loading = true
      this.info()
      this.loading = false
    }
  }
}
</script>
