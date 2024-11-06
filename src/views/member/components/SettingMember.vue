<template>
  <el-row>
    <el-col :span="14">
      <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
        <el-form-item label="默认头像" prop="default_avatar_id">
          <FileImage
            v-model="model.default_avatar_id"
            :file-url="model.default_avatar_url"
            file-title="上传头像"
            file-tip="图片小于 50 KB，jpg、png格式，128 x 128。"
            :height="100"
            avatar
            upload
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" @click="refresh()">刷新</el-button>
          <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { memberInfo, memberEdit } from '@/api/member/setting'

export default {
  name: 'MemberSettingMember',
  data() {
    return {
      name: '会员设置',
      height: 680,
      loading: false,
      model: {
        default_avatar_id: 0,
        default_avatar_url: ''
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(210)
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
      memberInfo()
        .then((res) => {
          this.model = res.data
          this.loading = false
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          memberEdit(this.model)
            .then((res) => {
              this.loading = false
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
