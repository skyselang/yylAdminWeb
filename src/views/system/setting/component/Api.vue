<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('接口速率')">
            <el-col :span="6">
              <el-input v-model="model.api_rate_num" type="number">
                <template #append>{{ $t('次/') }}</template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="model.api_rate_time" type="number">
                <template #append>{{ $t('秒') }}</template>
              </el-input>
            </el-col>
            <el-col :span="24">
              <el-text size="default">{{ $t('次数/时间；3/1：3次1秒；次数为 0 不限制') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('请求超时')">
            <el-col :span="6">
              <el-input v-model="model.api_timeout" type="number">
                <template #append>{{ $t('秒') }}</template>
              </el-input>
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
import { apiInfoApi as infoApi, apiEditApi as editApi } from '@/api/system/setting'
import { useSettingsStoreHook } from '@/store/modules/settings'

export default {
  data() {
    return {
      name: '接口设置',
      height: 680,
      loading: false,
      model: {
        api_rate_num: 3,
        api_rate_time: 1,
        api_timeout: 60
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(270)
    this.info()
    this.rules = {
      api_rate_num: [{ required: true, message: this.$t('请输入次数'), trigger: 'blur' }],
      api_rate_time: [{ required: true, message: this.$t('请输入时间'), trigger: 'blur' }],
      api_timeout: [{ required: true, message: this.$t('请输入请求超时'), trigger: 'blur' }]
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
          editApi(this.model)
            .then((res) => {
              this.loading = false
              ElMessage.success(res.msg)
              const settingsStore = useSettingsStoreHook()
              settingsStore.changeSetting({ key: 'timeout', value: this.model.api_timeout })
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
