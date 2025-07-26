<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('内容默认图片')" prop="content_default_img_open">
            <ElSwitchOnoff v-model="model.content_default_img_open" />
            <el-text size="default">{{ $t('是否开启内容默认图片') }}</el-text>
          </el-form-item>
          <el-form-item prop="content_default_img_id">
            <FileImage
              v-model="model.content_default_img_id"
              :file-url="model.content_default_img_url"
              :file-title="$t('上传内容默认图片')"
              :file-tip="$t('图片小于 100 KB，jpg、png 格式')"
              :height="100"
              upload
            />
          </el-form-item>
          <el-form-item :label="$t('分类默认图片')" prop="category_default_img_open">
            <ElSwitchOnoff v-model="model.category_default_img_open" />
            <el-text size="default">{{ $t('是否开启分类默认图片') }}</el-text>
          </el-form-item>
          <el-form-item prop="category_default_img_id">
            <FileImage
              v-model="model.category_default_img_id"
              :file-url="model.category_default_img_url"
              :file-title="$t('上传分类默认图片')"
              :file-tip="$t('图片小于 100 KB，jpg、png 格式')"
              :height="100"
              upload
            />
          </el-form-item>
          <el-form-item :label="$t('标签默认图片')" prop="tag_default_img_open">
            <ElSwitchOnoff v-model="model.tag_default_img_open" />
            <el-text size="default">{{ $t('是否开启标签默认图片') }}</el-text>
          </el-form-item>
          <el-form-item prop="tag_default_img_id">
            <FileImage
              v-model="model.tag_default_img_id"
              :file-url="model.tag_default_img_url"
              :file-title="$t('上传标签默认图片')"
              :file-tip="$t('图片小于 100 KB，jpg、png 格式')"
              :height="100"
              upload
            />
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
import { basicInfoApi as infoApi, basicEditApi as editApi } from '@/api/content/setting'

export default {
  data() {
    return {
      name: '基本设置',
      height: 680,
      loading: false,
      model: {
        content_default_img_open: 0,
        content_default_img_id: 0,
        content_default_img_url: '',
        category_default_img_open: 0,
        category_default_img_id: 0,
        category_default_img_url: '',
        tag_default_img_open: 0,
        tag_default_img_id: 0,
        tag_default_img_url: ''
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
