<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('日志记录开关')" prop="log_switch">
            <ElSwitchOnoff v-model="model.log_switch" />
            <el-text size="default">{{ $t('开启后，会记录会员日志') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('免登日志记录')" prop="log_unlogin">
            <ElSwitchWhether v-model="model.log_unlogin" />
            <el-text size="default">{{ $t('开启后，未登录会记录免登日志') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('日志保留时间')" prop="log_save_time">
            <el-col :span="10">
              <el-input v-model="model.log_save_time" type="number">
                <template #append>{{ $t('天') }}</template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('日志保留天数，0永久保留') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('日志排除参数')" prop="log_param_without">
            <el-col :span="10">
              <el-input v-model="model.log_param_without" type="textarea" clearable />
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('日志请求参数排除字段，逗号分隔') }}</el-text>
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
import { logInfoApi as infoApi, logEditApi as editApi } from '@/api/member/setting'

export default {
  data() {
    return {
      name: '日志设置',
      height: 750,
      loading: false,
      model: {
        log_switch: 0,
        log_unlogin: 0,
        log_save_time: 0,
        log_param_without: ''
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
