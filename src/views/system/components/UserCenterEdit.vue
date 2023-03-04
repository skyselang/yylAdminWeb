<template>
  <div>
    <el-card v-loading="loading" class="dialog-body" :style="{height:height+'px'}">
      <el-row>
        <el-col :span="12">
          <el-form ref="ref" :rules="rules" :model="model" label-width="120px">
            <el-form-item label="头像" prop="avatar_url">
              <el-col :span="12">
                <el-avatar v-if="model.avatar_url" :size="100" fit="contain" :src="model.avatar_url" shape="circle" />
                <el-avatar v-else icon="el-icon-user-solid" :size="100" />
              </el-col>
              <el-col :span="12">
                <el-button size="mini" @click="fileUpload()">上传头像</el-button>
                <el-button size="mini" @click="fileDelete()">删除</el-button>
                <p>jpg、png图片，小于 100 KB，宽高1:1</p>
              </el-col>
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
    </el-card>
    <!-- 文件管理 -->
    <el-dialog title="上传头像" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import store from '@/store'
import FileManage from '@/components/FileManage'
import { info, edit } from '@/api/system/user-center'

export default {
  name: 'SystemUserCenterEdit',
  components: { FileManage },
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
      },
      fileDialog: false
    }
  },
  created() {
    this.height = screenHeight(180)
    this.info()
  },
  methods: {
    // 信息
    info(msg = false) {
      info().then(res => {
        this.reset(res.data)
        store.commit('user/SET_AVATAR', res.data.avatar_url)
        store.commit('user/SET_NICKNAME', res.data.nickname)
        store.commit('user/SET_USERNAME', res.data.username)
        if (msg) {
          this.$message.success(res.msg)
        }
      }).catch(() => { })
    },
    // 刷新
    refresh() {
      this.loading = true
      this.info(true)
      this.loading = false
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          edit(this.model).then(res => {
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
        this.$refs['ref'].clearValidate()
      }
    },
    // 上传头像
    fileUpload() {
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(fileList) {
      this.fileDialog = false
      const fileLength = fileList.length
      if (fileLength) {
        const i = fileLength - 1
        this.model.avatar_id = fileList[i]['file_id']
        this.model.avatar_url = fileList[i]['file_url']
      }
    },
    fileDelete() {
      this.model.avatar_id = 0
      this.model.avatar_url = ''
    }
  }
}
</script>
