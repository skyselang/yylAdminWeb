<template>
  <el-card class="dialog-body" :style="{height:height+'px'}">
    <el-form
      ref="ref"
      :model="model"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="默认头像" prop="default_avatar_id">
        <el-col :span="6" style="height:100px">
          <el-image
            style="height:100px"
            fit="contain"
            :src="model.default_avatar_url"
            :preview-src-list="[model.default_avatar_url]"
            title="点击看大图"
          >
            <div slot="error" class="image-slot">
              <el-avatar :size="100" icon="el-icon-user-solid" />
            </div>
          </el-image>
        </el-col>
        <el-col :span="6">
          <el-button @click="fileUpload('default_avatar', '上传默认头像')">上传默认头像</el-button>
          <el-button @click="fileDelete('default_avatar')">删除</el-button>
          <p>图片小于 50 KB，jpg、png格式，128 x 128。</p>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" @click="refresh()">刷新</el-button>
        <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      :title="fileTitle"
      :visible.sync="fileDialog"
      width="80%"
      top="1vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </el-card>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import FileManage from '@/components/FileManage'
import { memberInfo, memberEdit } from '@/api/member/setting'

export default {
  name: 'SettingMember',
  components: { FileManage },
  data() {
    return {
      name: '会员设置',
      height: 680,
      loading: false,
      model: {
        default_avatar_id: 0,
        default_avatar_url: ''
      },
      rules: {},
      fileDialog: false,
      fileField: 'logo',
      fileTitle: '文件管理'
    }
  },
  created() {
    this.height = screenHeight(170)
    this.info()
  },
  methods: {
    // 信息
    info() {
      memberInfo().then((res) => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      memberInfo().then((res) => {
        this.model = res.data
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          memberEdit(this.model).then((res) => {
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 上传图片
    fileUpload(field, title = '') {
      this.fileField = field
      this.fileTitle = title
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(fileList) {
      this.fileDialog = false
      const fileField = this.fileField
      const fileLength = fileList.length
      if (fileLength) {
        const i = fileLength - 1
        if (fileField === 'default_avatar') {
          this.model.default_avatar_id = fileList[i]['file_id']
          this.model.default_avatar_url = fileList[i]['file_url']
        }
      }
    },
    fileDelete(field = '') {
      if (field === 'default_avatar') {
        this.model.default_avatar_id = 0
        this.model.default_avatar_url = ''
      }
    }
  }
}
</script>

<style scoped>

</style>
