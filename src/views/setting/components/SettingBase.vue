<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
    <el-row>
      <el-col :span="16">
        <el-form-item label="favicon" prop="favicon_id">
          <FileImage
            v-model="model.favicon_id"
            :file-url="model.favicon_url"
            file-title="上传favicon"
            file-tip="图片小于 50 KB，jpg、png、ico格式，128 x 128。"
            :height="100"
            upload
          />
        </el-form-item>
        <el-form-item label="logo" prop="logo_id">
          <FileImage
            v-model="model.logo_id"
            :file-url="model.logo_url"
            file-title="上传logo"
            file-tip="图片小于 200 KB，jpg、png格式。"
            :height="100"
            upload
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="model.name" placeholder="name" clearable />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" placeholder="title" clearable />
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="model.keywords" placeholder="keywords" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="model.description" type="textarea" autosize placeholder="description" />
        </el-form-item>
        <el-form-item label="备案号" prop="icp">
          <el-input v-model="model.icp" placeholder="icp" clearable />
        </el-form-item>
        <el-form-item label="版权" prop="copyright">
          <el-input v-model="model.copyright" placeholder="copyright" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button :loading="loading" @click="refresh()">刷新</el-button>
      <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { info, edit } from '@/api/setting/setting'

export default {
  name: 'SettingBase',
  data() {
    return {
      name: '基本信息',
      loading: false,
      model: {
        favicon_id: 0,
        favicon_url: '',
        logo_id: 0,
        logo_url: '',
        name: '',
        title: '',
        keywords: '',
        description: '',
        icp: '',
        copyright: ''
      },
      rules: {}
    }
  },
  created() {
    this.info()
  },
  methods: {
    // 信息
    info() {
      info().then((res) => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      info()
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
          edit(this.model)
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
