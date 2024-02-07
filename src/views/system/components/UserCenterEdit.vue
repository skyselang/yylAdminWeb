<template>
  <el-scrollbar native :height="height">
    <el-row>
      <el-col :span="12">
        <el-form ref="ref" :rules="rules" :model="model" label-width="120px">
          <el-form-item label="头像" prop="avatar_id">
            <FileImage
              v-model="model.avatar_id"
              :file-url="model.avatar_url"
              file-title="上传头像"
              file-tip="图片小于 100 KB，jpg、png格式，100 x 100"
              :height="100"
              avatar
              upload
            />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="model.nickname" placeholder="请输入昵称" clearable />
          </el-form-item>
          <el-form-item label="账号" prop="username">
            <el-input v-model="model.username" placeholder="请输入账号" clearable />
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="model.phone" placeholder="请输入手机" clearable />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="model.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" @click="refresh">刷新</el-button>
            <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { useUserStoreHook } from '@/store/modules/user'
import { info, edit } from '@/api/system/user-center'

export default {
  name: 'SystemUserCenterEdit',
  data() {
    return {
      name: '修改信息',
      height: 680,
      loading: false,
      model: {
        avatar_id: 0,
        avatar_url: '',
        username: '',
        nickname: '',
        phone: '',
        email: ''
      },
      rules: {
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight(210)
    this.info()
  },
  methods: {
    // 信息
    info(msg = false) {
      info()
        .then((res) => {
          this.reset(res.data)
          this.update(res.data)
          if (msg) {
            ElMessage.success(res.msg)
          }
        })
        .catch(() => {})
    },
    // 刷新
    refresh() {
      this.loading = true
      this.info(true)
      this.loading = false
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          edit(this.model)
            .then((res) => {
              this.update(this.model)
              this.loading = false
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    update(data) {
      const userStore = useUserStoreHook()
      userStore.user.avatar_url = data.avatar_url
      userStore.user.nickname = data.nickname
      userStore.user.username = data.username
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        try {
          this.$refs['ref'].resetFields()
          this.$refs['ref'].clearValidate()
        } catch (error) {}
      }
    }
  }
}
</script>
