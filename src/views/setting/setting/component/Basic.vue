<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item label="favicon" prop="favicon_id">
            <FileImage
              v-model="model.favicon_id"
              :file-url="model.favicon_url"
              :file-title="$t('上传favicon')"
              :file-tip="$t('图片小于 50 KB，jpg、png、ico 格式，128 x 128')"
              :height="100"
              upload
            />
          </el-form-item>
          <el-form-item label="logo" prop="logo_id">
            <FileImage
              v-model="model.logo_id"
              :file-url="model.logo_url"
              :file-title="$t('上传logo')"
              :file-tip="$t('图片小于 200 KB，jpg、png 格式')"
              :height="100"
              upload
            />
          </el-form-item>
          <el-form-item :label="$t('名称')" prop="name">
            <el-input v-model="model.name" clearable />
          </el-form-item>
          <el-form-item :label="$t('标题')" prop="title">
            <el-input v-model="model.title" clearable />
          </el-form-item>
          <el-form-item :label="$t('关键词')" prop="keywords">
            <el-input v-model="model.keywords" clearable />
          </el-form-item>
          <el-form-item :label="$t('描述')" prop="description">
            <el-input v-model="model.description" type="textarea" />
          </el-form-item>
          <el-form-item :label="$t('备案号')" prop="icp">
            <el-input v-model="model.icp" clearable />
          </el-form-item>
          <el-form-item :label="$t('版权')" prop="copyright">
            <el-input v-model="model.copyright" clearable />
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
import { basicInfoApi as infoApi, basicEditApi as editApi } from '@/api/setting/setting'

export default {
  data() {
    return {
      name: '基本设置',
      height: 750,
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
    this.height = screenHeight(270)
    this.info()
  },
  methods: {
    // 信息
    info(ismsg = false) {
      if (ismsg) {
        this.loading = true
      }
      infoApi()
        .then((res) => {
          this.model = res.data
          this.loading = false
          if (ismsg) {
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
          editApi(this.model)
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
