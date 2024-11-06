<template>
  <el-row>
    <el-col :span="24">
      <el-scrollbar native :height="height">
        <el-form ref="ref" label-width="120px">
          <el-form-item>
            <el-col :span="8"> AppID </el-col>
            <el-col :span="9"> AppSecret </el-col>
            <el-col :span="2"> 注册 </el-col>
            <el-col :span="2"> 登录 </el-col>
            <el-col :span="2"> 绑定 </el-col>
          </el-form-item>
        </el-form>
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item v-for="(item, index) in apps" :key="index" :label="apps[index]">
            <el-col :span="8">
              <el-input v-model="model[index + '_appid']" />
            </el-col>
            <el-col :span="9">
              <el-input v-model="model[index + '_appsecret']" />
            </el-col>
            <el-col :span="2">
              <el-switch v-model="model[index + '_register']" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="2">
              <el-switch v-model="model[index + '_login']" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="2">
              <el-switch v-model="model[index + '_bind']" :active-value="1" :inactive-value="0" />
            </el-col>
          </el-form-item>
        </el-form>
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item>
            <el-button :loading="loading" @click="refresh()">刷新</el-button>
            <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-col>
  </el-row>
  <el-dialog v-model="dialogFormVisible" title="说明" center>
    <el-form :model="model" label-width="0">
      <el-form-item prod="platform_desc">
        <div v-html="model.platform_desc"></div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { thirdInfo, thirdEdit } from '@/api/member/setting'

export default {
  name: 'MemberSettingThird',
  data() {
    return {
      name: '第三方账号设置',
      height: 680,
      loading: false,
      apps: {
        wx_miniapp: '微信小程序',
        wx_offiacc: '微信公众号',
        wx_website: '微信网站应用',
        wx_mobile: '微信移动应用',
        qq_miniapp: 'QQ小程序',
        qq_website: 'QQ网站应用',
        qq_mobile: 'QQ移动应用',
        wb_website: '微博网站应用'
      },
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
      dialogFormVisible: false
    }
  },
  created() {
    this.height = screenHeight(210)
    this.info()
  },
  methods: {
    // 信息
    info() {
      thirdInfo().then((res) => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      thirdInfo()
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
          thirdEdit(this.model)
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
