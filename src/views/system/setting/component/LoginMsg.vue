<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('登录页提示开关')" prop="login_msg_switch">
            <el-col :span="10">
              <ElSwitchOnoff v-model="model.login_msg_switch" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('登录页提示类型')" prop="login_msg_type">
            <el-col :span="10">
              <el-select v-model="model.login_msg_type">
                <el-option value="primary" label="primary" />
                <el-option value="success" label="success" />
                <el-option value="warning" label="warning" />
                <el-option value="info" label="info" />
                <el-option value="error" label="error" />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('登录页提示时间')" prop="login_msg_time">
            <el-col :span="10">
              <el-input v-model="model.login_msg_time" type="number">
                <template #append>{{ $t('秒') }}</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('登录页提示文字')" prop="login_msg_text">
            <el-col :span="10">
              <el-input v-model="model.login_msg_text" type="textarea" />
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-form-item>
      <el-button :loading="loading" @click="refresh">{{ $t('刷新') }}</el-button>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
      <el-button :loading="loading" @click="preview">{{ $t('预览') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { screenHeight } from '@/utils/index'
import { loginMsgInfoApi as infoApi, loginMsgEditApi as editApi } from '@/api/system/setting'

export default {
  data() {
    return {
      name: '登录页提示',
      height: 680,
      loading: false,
      model: {
        login_msg_switch: 0,
        login_msg_type: 'primary',
        login_msg_time: 15,
        login_msg_text: ''
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(270)
    this.info()
    this.rules = {}
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
    },
    // 预览
    preview() {
      ElMessage({
        message: this.model.login_msg_text,
        type: this.model.login_msg_type,
        duration: this.model.login_msg_time * 1000,
        showClose: true,
        grouping: true
      })
    }
  }
}
</script>
