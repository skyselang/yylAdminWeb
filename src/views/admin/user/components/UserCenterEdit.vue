<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="18" :md="12">
          <el-form ref="ref" :rules="rules" :model="model" label-width="120px">
            <el-form-item label="头像" prop="avatar_url">
              <el-col :span="10">
                <el-avatar v-if="model.avatar_url" :src="model.avatar_url" :size="100" fit="contain" shape="circle" />
                <el-avatar v-else icon="el-icon-user-solid" :size="100" />
              </el-col>
              <el-col :span="14">
                <el-button size="mini" @click="fileUpload()">上传头像</el-button>
                <el-button size="mini" @click="fileDelete('avatar')">删除</el-button>
                <br>
                <span>jpg、png图片，小于100kb，宽高1:1</span>
              </el-col>
            </el-form-item>
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
    <!-- 文件管理 -->
    <el-dialog title="上传头像" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import FileManage from '@/components/FileManage'
import { info, edit } from '@/api/admin/user-center'

export default {
  name: 'UserCenterEdit',
  components: { FileManage },
  data() {
    return {
      name: '修改信息',
      loading: false,
      model: {
        avatar_id: 0,
        avatar_url: '',
        username: '',
        nickname: '',
        phone: '',
        email: ''
      },
      fileDialog: false,
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
    // 信息
    info() {
      info({
        admin_user_id: this.model.admin_user_id
      }).then(res => {
        this.$refs['ref'].resetFields()
        this.model = res.data
        store.commit('user/SET_AVATAR', res.data.avatar_url)
        store.commit('user/SET_NICKNAME', res.data.nickname)
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          edit(this.model).then(res => {
            this.refresh()
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      this.info()
      this.loading = false
    },
    // 上传头像
    fileUpload() {
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(filelists) {
      this.fileDialog = false
      this.model.avatar_id = filelists[0]['file_id']
      this.model.avatar_url = filelists[0]['file_url']
    },
    fileDelete(field = '') {
      if (field === 'avatar') {
        this.model.avatar_id = 0
        this.model.avatar_url = ''
      }
    }
  }
}
</script>
