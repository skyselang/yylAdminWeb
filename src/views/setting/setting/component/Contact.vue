<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('公众号码')" prop="offi_id">
            <FileImage
              v-model="model.offi_id"
              :file-url="model.offi_url"
              :file-title="$t('上传公众号码')"
              :height="80"
              upload
            />
          </el-form-item>
          <el-form-item :label="$t('小程序码')" prop="mini_id">
            <FileImage
              v-model="model.mini_id"
              :file-url="model.mini_url"
              :file-title="$t('上传小程序码')"
              :height="80"
              upload
            />
          </el-form-item>
          <el-form-item :label="$t('视频号')" prop="video_id">
            <FileImage
              v-model="model.video_id"
              :file-url="model.video_url"
              :file-title="$t('上传视频号')"
              :height="80"
              upload
            />
          </el-form-item>
          <el-form-item :label="$t('抖音号')" prop="douyin_id">
            <FileImage
              v-model="model.douyin_id"
              :file-url="model.douyin_url"
              :file-title="$t('上传抖音号')"
              :height="80"
              upload
            />
          </el-form-item>
          <el-form-item :label="$t('地址')" prop="address">
            <el-input v-model="model.address" clearable />
          </el-form-item>
          <el-form-item :label="$t('电话')" prop="tel">
            <el-input v-model="model.tel" clearable />
          </el-form-item>
          <el-form-item :label="$t('传真')" prop="fax">
            <el-input v-model="model.fax" clearable />
          </el-form-item>
          <el-form-item :label="$t('手机')" prop="mobile">
            <el-input v-model="model.mobile" clearable />
          </el-form-item>
          <el-form-item :label="$t('邮箱')" prop="email">
            <el-input v-model="model.email" clearable />
          </el-form-item>
          <el-form-item :label="$t('微信')" prop="wechat">
            <el-input v-model="model.wechat" clearable />
          </el-form-item>
          <el-form-item label="QQ" prop="qq">
            <el-input v-model="model.qq" clearable />
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
import { contactInfoApi as infoApi, contactEditApi as editApi } from '@/api/setting/setting'

export default {
  data() {
    return {
      name: '联系设置',
      height: 750,
      loading: false,
      model: {
        offi_id: 0,
        offi_url: '',
        mini_id: 0,
        mini_url: '',
        douyin_id: 0,
        douyin_url: '',
        video_id: 0,
        video_url: '',
        address: '',
        tel: '',
        fax: '',
        mobile: '',
        email: '',
        wechat: '',
        qq: ''
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
