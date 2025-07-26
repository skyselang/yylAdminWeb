<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item>
            <el-col :span="8">AppID</el-col>
            <el-col :span="9">AppSecret</el-col>
            <el-col :span="2">{{ $t('注册') }}</el-col>
            <el-col :span="2">{{ $t('登录') }}</el-col>
            <el-col :span="2">{{ $t('绑定') }}</el-col>
          </el-form-item>
          <el-form-item v-for="(v, k) in apps" :key="k" :label="apps[k]" :prop="model[k + '_appid']">
            <el-col :span="8">
              <el-input v-model="model[k + '_appid']" clearable />
            </el-col>
            <el-col :span="9">
              <el-input v-model="model[k + '_appsecret']" clearable />
            </el-col>
            <el-col :span="2">
              <ElSwitchOnoff v-model="model[k + '_register']" />
            </el-col>
            <el-col :span="2">
              <ElSwitchOnoff v-model="model[k + '_login']" />
            </el-col>
            <el-col :span="2">
              <ElSwitchOnoff v-model="model[k + '_bind']" />
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-form-item>
      <!-- <el-button :loading="loading" @click="dialog = true">说明</el-button> -->
      <el-button :loading="loading" @click="refresh">{{ $t('刷新') }}</el-button>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </el-form-item>
  </el-form>
  <el-dialog v-model="dialog" :title="$t('说明')" center>
    <el-form :model="model" label-width="0">
      <el-form-item prod="platform_desc">
        <div v-html="model.platform_desc"></div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="dialog = false">{{ $t('关闭') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { screenHeight } from '@/utils/index'
import { thirdInfoApi as infoApi, thirdEditApi as editApi } from '@/api/member/setting'

export default {
  data() {
    return {
      name: '第三方账号设置',
      height: 750,
      loading: false,
      apps: {},
      model: {
        wx_miniapp_appid: '',
        wx_miniapp_appsecret: '',
        wx_miniapp_register: 1,
        wx_miniapp_login: 1,
        wx_miniapp_bind: 1,
        wx_offiacc_appid: '',
        wx_offiacc_appsecret: '',
        wx_offiacc_register: 1,
        wx_offiacc_login: 1,
        wx_offiacc_bind: 1,
        wx_website_appid: '',
        wx_website_appsecret: '',
        wx_owebsite_register: 1,
        wx_owebsite_login: 1,
        wx_owebsite_bind: 1,
        wx_mobile_appid: '',
        wx_mobile_appsecret: '',
        wx_mobile_register: 1,
        wx_mobile_login: 1,
        wx_mobile_bind: 1,
        qq_miniapp_appid: '',
        qq_miniapp_appsecret: '',
        qq_miniapp_register: 1,
        qq_miniapp_login: 1,
        qq_miniapp_bind: 1,
        qq_website_appid: '',
        qq_website_appsecret: '',
        qq_website_register: 1,
        qq_website_login: 1,
        qq_website_bind: 1,
        qq_mobile_appid: '',
        qq_mobile_appsecret: '',
        qq_mobile_register: 1,
        qq_mobile_login: 1,
        qq_mobile_bind: 1,
        wb_website_appid: '',
        wb_website_appsecret: '',
        wb_owebsite_register: 1,
        wb_owebsite_login: 1,
        wb_owebsite_bind: 1
      },
      rules: {},
      dialog: false
    }
  },
  created() {
    this.height = screenHeight(270)
    this.info()
    this.apps = {
      wx_miniapp: this.$t('微信小程序'),
      wx_offiacc: this.$t('微信公众号'),
      wx_website: this.$t('微信网站应用'),
      wx_mobile: this.$t('微信移动应用'),
      qq_miniapp: this.$t('QQ小程序'),
      qq_website: this.$t('QQ网站应用'),
      qq_mobile: this.$t('QQ移动应用'),
      wb_website: this.$t('微博网站应用')
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
          delete this.model.platform_desc
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
