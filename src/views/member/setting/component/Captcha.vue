<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('验证码方式')" prop="captcha_mode">
            <el-col :span="12">
              <el-select v-model="model.captcha_mode" @change="modeChange">
                <el-option v-for="item in captcha_modes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col :span="24">
              <el-text size="default">{{ $t('字符：输入字符；行为：滑动或点选') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('验证码类型')" prop="captcha_type">
            <el-col :span="12">
              <el-select v-if="model.captcha_mode == 1" v-model="model.captcha_type">
                <el-option v-for="item in captcha_strs" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-select v-else v-model="model.captcha_type">
                <el-option v-for="item in captcha_ajs" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item v-if="model.captcha_mode == 1" :label="$t('验证码透明')" prop="captcha_transparent">
            <el-col :span="10">
              <ElSwitchOnoff v-model="model.captcha_transparent" />
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('开启后，验证码图片是透明的') }}</el-text>
            </el-col>
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
import { captchaInfoApi as infoApi, captchaEditApi as editApi } from '@/api/member/setting'

export default {
  data() {
    return {
      name: '验证码设置',
      height: 750,
      loading: false,
      model: {
        captcha_mode: 1,
        captcha_type: 1,
        captcha_transparent: 1
      },
      rules: {},
      captcha_modes: [],
      captcha_strs: [],
      captcha_ajs: []
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
          this.captcha_modes = res.data.basedata.captcha_modes
          this.captcha_strs = res.data.basedata.captcha_strs
          this.captcha_ajs = res.data.basedata.captcha_ajs
          delete res.data.basedata
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
    },
    // 方式切换
    modeChange(value) {
      this.model.captcha_type = value
    }
  }
}
</script>
