<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="hasPerm(['admin/member.Setting/basicInfo'])" :label="$t('基本设置')" lazy>
        <Basic />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/member.Setting/logregInfo'])" :label="$t('登录注册设置')" lazy>
        <Logreg />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/member.Setting/thirdInfo'])" :label="$t('第三方账号设置')" lazy>
        <Third />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/member.Setting/captchaInfo'])" :label="$t('验证码设置')" lazy>
        <Captcha />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/member.Setting/logInfo'])" :label="$t('日志设置')" lazy>
        <Log />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/member.Setting/apiInfo'])" :label="$t('接口设置')" lazy>
        <Api />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/member.Setting/tokenInfo'])" :label="$t('Token设置')" lazy>
        <Token />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { hasPerm } from '@/utils/index'
import Api from './component/Api.vue'
import Basic from './component/Basic.vue'
import Captcha from './component/Captcha.vue'
import Log from './component/Log.vue'
import Logreg from './component/Logreg.vue'
import Third from './component/Third.vue'
import Token from './component/Token.vue'

export default {
  name: 'MemberSetting',
  components: { Api, Basic, Captcha, Log, Logreg, Third, Token },
  data() {
    return {
      name: '会员设置'
    }
  },
  methods: {
    hasPerm
  }
}
</script>
