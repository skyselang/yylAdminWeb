<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('头像')" prop="avatar_id">
            <FileImage
              v-model="model.avatar_id"
              v-model:file-url="model.avatar_url"
              :file-title="$t('上传头像')"
              :file-tip="$t('图片小于 100 KB，jpg、png格式，100 x 100')"
              :height="100"
              avatar
              upload
            />
          </el-form-item>
          <el-form-item :label="$t('昵称')" prop="nickname">
            <el-input v-model="model.nickname" clearable />
          </el-form-item>
          <el-form-item :label="$t('账号')" prop="username">
            <el-input v-model="model.username" clearable />
          </el-form-item>
          <el-form-item :label="$t('手机')" prop="phone">
            <el-input v-model="model.phone" clearable />
          </el-form-item>
          <el-form-item :label="$t('邮箱')" prop="email">
            <el-input v-model="model.email" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-form-item>
      <el-button :loading="loading" @click="refresh">{{ $t('刷新') }}</el-button>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { screenHeight } from '@/utils/index'
import { useUserStoreHook } from '@/store/modules/user'
import { infoApi, editApi } from '@/api/system/user-center'

export default {
  data() {
    return {
      name: '修改信息',
      height: 680,
      loading: false,
      model: {
        avatar_id: 0,
        avatar_url: '',
        nickname: '',
        username: '',
        phone: '',
        email: ''
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(270)
    this.info()
    this.rules = {
      nickname: [{ required: true, message: this.$t('请输入昵称'), trigger: 'blur' }],
      username: [{ required: true, message: this.$t('请输入账号'), trigger: 'blur' }]
    }
  },
  methods: {
    // 信息
    info(ismsg = false) {
      if (ismsg) {
        this.loading = true
      }
      infoApi()
        .then((res) => {
          this.reset(res.data)
          this.store(res.data)
          if (ismsg) {
            this.loading = false
            ElMessage.success(res.msg)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 刷新
    refresh() {
      this.info(true)
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (!valid) {
          ElMessage.error(this.$t('请完善必填项'))
        } else {
          this.loading = true
          let params = {
            avatar_id: this.model.avatar_id,
            nickname: this.model.nickname,
            username: this.model.username,
            email: this.model.email,
            phone: this.model.phone
          }
          editApi(params)
            .then((res) => {
              this.store(this.model)
              this.loading = false
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    store(data) {
      const userStore = useUserStoreHook()
      userStore.user.avatar_url = data.avatar_url
      userStore.user.nickname = data.nickname
      userStore.user.username = data.username
    },
    // 重置
    reset(data) {
      if (data) {
        this.model = data
      } else {
        this.model = this.$options.data().model
      }
      this.$refs['ref'].resetFields()
      this.$refs['ref'].clearValidate()
    }
  }
}
</script>
