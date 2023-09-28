<template>
  <el-card class="dialog-body" :style="{height:height+'px'}">
    <el-row>
      <el-col :span="16">
        <el-form
          ref="ref"
          :model="model"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="验证码开关" prop="captcha_switch">
            <el-col :span="8">
              <el-switch v-model="model.captcha_switch" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              开启后，后台登录需要输入验证码。
            </el-col>
          </el-form-item>
          <el-form-item label="验证码方式" prop="captcha_mode">
            <el-col :span="8">
              <el-select v-model="model.captcha_mode" placeholder="" @change="moldChange">
                <el-option
                  v-for="item in mold"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="16">
              字符：输入字符；行为：滑动或点选。
            </el-col>
          </el-form-item>
          <el-form-item label="验证码类型" prop="captcha_type">
            <el-col :span="8">
              <el-select v-if="model.captcha_mode==1" v-model="model.captcha_type" placeholder="">
                <el-option
                  v-for="item in typestr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-else v-model="model.captcha_type" placeholder="">
                <el-option
                  v-for="item in typeaj"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" @click="refresh()">刷新</el-button>
            <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { captchaInfo, captchaEdit } from '@/api/system/setting'

export default {
  name: 'SystemSettingCaptcha',
  components: {},
  data() {
    return {
      name: '验证码设置',
      height: 680,
      loading: false,
      model: {
        captcha_switch: 0,
        captcha_mode: 1,
        captcha_type: 1
      },
      rules: {},
      mold: [
        { value: 1, label: '字符' },
        { value: 2, label: '行为' }
      ],
      typestr: [
        { value: 1, label: '数字' },
        { value: 2, label: '字母' },
        { value: 3, label: '数字字母' },
        { value: 4, label: '算术' },
        { value: 5, label: '中文' }
      ],
      typeaj: [
        { value: 1, label: '滑动拼图' },
        { value: 2, label: '点选文字' }
      ]
    }
  },
  created() {
    this.height = screenHeight(180)
    this.info()
  },
  methods: {
    // 信息
    info() {
      captchaInfo().then(res => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      captchaInfo().then((res) => {
        this.model = res.data
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          captchaEdit(this.model).then(res => {
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    moldChange(value) {
      this.model.captcha_type = 1
    }
  }
}
</script>
